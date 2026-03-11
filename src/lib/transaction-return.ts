import { api } from "./api";
import { ItemConditions } from "./transaction";


export type BorrowedDetailItem = {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  room: { name: string };
  transaction: { po_number: string };
  item: {      
    name: string;
    category: { name: string };
    subcategory: { name: string };
  };
  userId: { username: string };
};

export interface ReturnEntry {
  item: BorrowedDetailItem;
  kondisi: string;
}


export async function getBorrowedDetailItems(): Promise<BorrowedDetailItem[]> {
  const res = await api("/api/detail-items?status=borrowed&limit=100");
  return res.data ?? [];
}

export async function returnDetailItems(
  returnList: ReturnEntry[],
  returned_by: string
): Promise<void> {

  const detailedItems = await Promise.all(
    returnList.map(async (entry) => {
      const res = await api(`/api/detail-items/${entry.item.id}`);
      return { detail: res.data, kondisi: entry.kondisi };
    })
  );

  await Promise.all(
    detailedItems.map(({ detail, kondisi }) =>
      api(`/api/detail-items/${detail.id}`, {
        method: "PUT",
        body: JSON.stringify({
          item_id: detail.item_id,           // ✅ dari response langsung
          transaction_id: detail.transaction_id,
          room_id: detail.room_id,
          serial_number: detail.serial_number,
          status: "available",
          condition: kondisi,
        }),
      })
    )
  );

  // 3. Auto-update LoanRequest terkait → returned
  // 3. Auto-update LoanRequest terkait → returned
  const loanRes = await api(`/api/loan-requests?limit=100`);
  const allLoans: any[] = loanRes.data ?? [];

  // Debug — hapus setelah fix
  console.log("detailedItems ids:", detailedItems.map(e => e.detail.id));
  console.log("allLoans item_ids (approved):", 
    allLoans
      .filter(l => l.status === "approved")
      .map(l => ({ id: l.id, item_id: l.item_id }))
  );

  const matchedLoans = allLoans.filter(
    (loan) =>
      detailedItems.some((e) => e.detail.id === loan.item_id) &&
      loan.status === "approved"
  );

  console.log("matchedLoans:", matchedLoans);

  if (matchedLoans.length > 0) {
    await Promise.all(
      matchedLoans.map((loan) =>
        api(`/api/loan-requests/${loan.id}`, {
          method: "PUT",
          body: JSON.stringify({
            user_id: loan.user_id,
            item_id: loan.item_id,      // ✅ wajib disertakan
            borrow_date: loan.borrow_date,
            return_date: new Date().toISOString(),
            status: "returned",
            description: loan.description ?? undefined,
          }),
        })
      )
    );
  }

  const uniqueTransactionIds = [
    ...new Set(detailedItems.map((e) => e.detail.transaction_id)),
  ];

  await Promise.all(
    uniqueTransactionIds.map(async (transaction_id) => {
      const existing = await api(`/api/transactions/${transaction_id}`);
      const trx = existing.data;

      return api(`/api/transactions/${transaction_id}`, {
        method: "PUT",
        body: JSON.stringify({
          user_id: trx.user_id,
          supplier_id: trx.supplier_id,
          po_number: trx.po_number,
          transaction_date: trx.transaction_date,
          status: trx.status,
          returned_by,
        }),
      });
    })
  );
}

export const getDetailItemsByTransaction = async (transactionId: string) => {
  const res = await api(`/api/detail-items?transaction_id=${transactionId}`);
  return (res.data ?? []).map((d: any) => ({
    name: d.item?.name ?? "—",
    condition: d.condition ?? "—",
  }));
};