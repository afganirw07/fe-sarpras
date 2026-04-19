import { id } from "zod/v4/locales";
import { api } from "./api";

export interface Item {
  id: string;
  category_id: string;
  subcategory_id: string;
  type: string;
  price: number,
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  categoryName?: string;
  subCategory?: string;
  code: string;
  name: string;
  specification: string;
  brand?: string;
  stock: number;
  unit: string;
  // specification: string;
  category: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
  created_by: string
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export interface DetailItem {
  id: string;
  item_id: string;
  transaction_id: string;
  room_id: string;
  migration_id: string | null;
  spesification: string;
  serial_number: string;
  condition: string;
  specification: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  room?: { name: string };
  transaction?: { po_number: string };
  item?: {
    name: string;
    subcategory?: { name: string };
     category?: { name: string }; 
  };
  userId?: { username: string };
}

// CREATE - Menambah item baru
export async function createItem(data: Item): Promise<ApiResponse<Item>> {
  return await api('/api/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// READ - Mendapatkan semua items dengan pagination
export async function getItems(page: number = 1, perPage: number = 10): Promise<ApiResponse<Item[]>> {
  return await api(`/api/items?page=${page}&perPage=${perPage}`, {
    method: 'GET',
  });
}

// READ - Mendapatkan item by ID
export async function getItemById(id: string): Promise<ApiResponse<Item>> {
  return await api(`/api/items/${id}`, {
    method: 'GET',
  });
}

// UPDATE - Update item
export async function updateItem(id: string, data: Partial<Item>): Promise<ApiResponse<Item>> {
  return await api(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE - Hapus item
export async function deleteItem(id: string): Promise<ApiResponse<Item>> {
  return await api(`/api/items/${id}`, {
    method: 'DELETE',
  });
}

// RESTORE - Restore deleted item
export async function restoreDeleteItems(id: string): Promise<ApiResponse<Item>> {
  return await api(`/api/items-restore/${id}`, {
    method: 'PUT',
  });
}

// READ - Mendapatkan deleted items
export async function getDeletedItems(page: number = 1, perPage: number = 10): Promise<ApiResponse<Item[]>> {
  return await api(`/api/items-deleted?page=${page}&perPage=${perPage}`, {
    method: 'GET',
  });
}

export async function getDetailItemsByItemId(
  itemId: string,
  page: number = 1,
  perPage: number = 100,
  search: string = ""
): Promise<ApiResponse<DetailItem[]>> {
  const params = new URLSearchParams({
    item_id: itemId,
    page: String(page),
    limit: String(perPage),
    ...(search ? { search } : {}),
  });
  return await api(`/api/detail-items?${params.toString()}`, {
    method: "GET",
  });
}


export async function getDetailItemById(
  id: string
): Promise<ApiResponse<DetailItem>> {
  return await api(`/api/detail-items/${id}`, {
    method: 'GET',
  });
}

export async function deleteDetailItems(
  id: string
): Promise<ApiResponse<DetailItem>> {
  return await api(`/api/detail-items/${id}`, {
    method: 'DELETE',
  });
}

export async function getDeletedDetailItems(
  page: number = 1, perPage: number = 10
): Promise<ApiResponse<DetailItem[]>>{
  return await api(`/api/detail-items-deleted?page=${page}&limit=${perPage}`, {
    method: "GET",
  });
}

export async function hardDeleteDetailItem(
  id:string
):Promise<ApiResponse<DetailItem>>{
  return await api(`/api/detail-items-deleted/${id}`, {
    method:'DELETE'
  }
  )
}

export async function getDeletedDetailItemById(
  id: string
): Promise<ApiResponse<DetailItem>> {
  return await api(`/api/detail-items-deleted-show/${id}`, {
    method: "GET",
  });
}


//filter detail item di page master item
//--------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

/**
 * Ambil semua detail item dengan filter kondisi dan/atau periode.
 * Filter periode menggunakan updated_at (N bulan terakhir).
 * Fetch semua halaman sekaligus (untuk keperluan export).
 */
export async function getDetailItemsFiltered(params: {
  condition?: string;
  periodMonths?: number | null;
  subCategoryId: string
  page?: number;
  limit?: number;
}): Promise<ApiResponse<DetailItem[]>> {
  const { condition, periodMonths,subCategoryId, page = 1, limit = 10 } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (condition) query.set("condition", condition);
  if (subCategoryId) query.set("subcategory_id", subCategoryId);

  if (periodMonths) {
    const from = new Date();
    from.setMonth(from.getMonth() - periodMonths);
    query.set("updated_from", from.toISOString());
  }

  return await api(`/api/detail-items?${query.toString()}`, {
    method: "GET",
  });
}

/**
 * Fetch semua halaman sekaligus untuk export Excel.
 */
export async function getAllDetailItemsFiltered(params: {
  condition?: string;
  periodMonths?: number | null;
  subCategoryId?: string | null; 
}): Promise<DetailItem[]> {
  const { condition, periodMonths, subCategoryId } = params;

  let allItems: DetailItem[] = [];
  let page = 1;

  while (true) {
    const res = await getDetailItemsFiltered({
      condition,
      periodMonths,
      subCategoryId,
      page,
      limit: 100,
    });

    allItems = [...allItems, ...(res.data ?? [])];

    const totalPages = res.pagination?.totalPages ?? 1;
    if (page >= totalPages) break;
    page++;
  }

  return allItems;
}

/**
 * Mengembalikan map: item_id → jumlah detail item kondisi Poor.
 */
export async function getPoorStockByItemId(
  itemId: string
): Promise<number> {
  const query = new URLSearchParams({
    item_id: itemId,
    condition: "Poor",
    limit: "1",
    page: "1",
  });

  const res = await api<ApiResponse<DetailItem[]>>(
    `/api/detail-items?${query.toString()}`,
    { method: "GET" }
  );

  return res.pagination?.total ?? res.data?.length ?? 0;
}