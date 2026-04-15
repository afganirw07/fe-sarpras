import { api } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoanDetailItem = {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  item_id: string;
  room_id: string;
  transaction_id: string;
  room: { id: string; name: string };
  item: {
    id: string;
    name: string;
    category: { name: string };
    subcategory: { name: string };
  };
};

export type LoanRequestWithItems = {
  id: string;
  user_id: string;
  status: string;
  borrow_date: string;
  return_date: string | null;
  description: string | null;
  user?: { username: string };
  item: LoanDetailItem[]; // many-to-many
};

// Kondisi baru yang diinput user per item di tabel
export type ReturnItemEntry = {
  detail_item: LoanDetailItem;
  new_condition: string; // "Good" | "Fair" | "Poor"
};

// ─── GET Loan Requests yang statusnya approved (siap dikembalikan) ─────────────

export async function getApprovedLoanRequests(): Promise<LoanRequestWithItems[]> {
  const res = await api("/api/loan-requests?limit=100");
  const all: LoanRequestWithItems[] = res.data ?? [];
  return all.filter((loan) => loan.status === "approved");
}

// ─── RETURN semua item dalam 1 LoanRequest sekaligus ─────────────────────────
// Steps:
//   1. Update kondisi + status tiap DetailItem → "available"
//   2. Update LoanRequest → status "returned"

export async function returnLoanRequest(
  loan: LoanRequestWithItems,
  entries: ReturnItemEntry[], // harus sama jumlahnya dengan loan.item
  returned_by: string  //
): Promise<void> {
  // Validasi: semua item dalam loan harus ada di entries
  const entryIds = new Set(entries.map((e) => e.detail_item.id));
  const missingIds = loan.item.filter((d) => !entryIds.has(d.id));
  if (missingIds.length > 0) {
    throw new Error(
      `Semua item harus dikembalikan sekaligus. Item belum diisi kondisi: ${missingIds
        .map((d) => d.serial_number)
        .join(", ")}`
    );
  }

  // 1. Update tiap DetailItem: status → available, condition → new_condition
  await Promise.all(
    entries.map(({ detail_item, new_condition }) =>
      api(`/api/detail-items/${detail_item.id}`, {
        method: "PUT",
        body: JSON.stringify({
          item_id: detail_item.item_id,
          transaction_id: detail_item.transaction_id,
          room_id: detail_item.room_id,
          serial_number: detail_item.serial_number,
          status: "available",
          condition: new_condition,
        }),
      })
    )
  );

  // 2. Update LoanRequest → returned
// 2. Update LoanRequest → returned
await api(`/api/loan-requests/${loan.id}`, {
  method: "PUT",
  body: JSON.stringify({
    user_id:    loan.user_id,
    item_ids:   loan.item.map((d) => d.id), // ← tambah ini
    borrow_date: loan.borrow_date,
    return_date: new Date().toISOString(),
    status:      "returned",
    description: loan.description ?? undefined,
        returned_by,  // ← tambah ini
  }),
});
}