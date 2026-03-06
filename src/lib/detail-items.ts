import { api } from "@/lib/api";

export function getAvailableDetailItems(itemId: string, roomId: string) {
  return api(
    `/api/detail-items?item_id=${itemId}&room_id=${roomId}&status=available`
  );
}

export function getDetailItemsByRoom(
  roomId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ""
) {
  const params = new URLSearchParams({
    room_id: roomId,
    status: "available",
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  });
  return api(`/api/detail-items?${params.toString()}`);
}

async function fetchAllPages(baseUrl: string) {
  const firstRes = await api(`${baseUrl}&page=1&limit=100`);
  const totalPages = firstRes.pagination?.totalPages ?? 1;

  if (totalPages <= 1) return firstRes.data ?? [];

  const pagePromises = [];
  for (let page = 2; page <= totalPages; page++) {
    pagePromises.push(
      api(`${baseUrl}&page=${page}&limit=100`).then((r) => r.data ?? [])
    );
  }
  const rest = await Promise.all(pagePromises);
  return [...(firstRes.data ?? []), ...rest.flat()];
}

export async function getCategoriesByWarehouse(roomId: string) {
  const detailItems: any[] = await fetchAllPages(
    `/api/detail-items?room_id=${roomId}&status=available`
  );

  const categoryMap = new Map();
  detailItems.forEach((d: any) => {
    // ✅ Skip jika item master sudah dihapus (relasi item jadi null)
    if (!d.item || !d.item.name || !d.item.category) return;

    const cat = d.item.category;
    const catId = cat?.id ?? cat?.name;
    if (catId && cat?.name && !categoryMap.has(catId)) {
      categoryMap.set(catId, { id: catId, name: cat.name });
    }
  });

  return { data: Array.from(categoryMap.values()) };
}

export async function getItemsByWarehouseAndCategory(roomId: string, categoryId: string) {
  const detailItems: any[] = await fetchAllPages(
    `/api/detail-items?room_id=${roomId}&status=available`
  );

  const itemMap = new Map();
  detailItems.forEach((d: any) => {
    // ✅ Skip jika item master sudah dihapus (relasi item jadi null)
    if (!d.item || !d.item.name || !d.item.category) return;

    const item = d.item;
    const cat = item.category;
    const catId = cat?.id ?? cat?.name;

    if (catId === categoryId && !itemMap.has(d.item_id)) {
      itemMap.set(d.item_id, {
        id: d.item_id,
        name: item.name,
        category_id: catId,
      });
    }
  });

  return { data: Array.from(itemMap.values()) };
}