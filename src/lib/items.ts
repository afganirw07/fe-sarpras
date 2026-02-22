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
  brand?: string;
  stock: number;
  unit: string;
  category: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
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
  serial_number: string;
  condition: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  room?: { name: string };
  transaction?: { po_number: string };
  item?: {
    name: string;
    category?: { name: string };
    subcategory?: { name: string };
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
  perPage: number = 10
): Promise<ApiResponse<DetailItem[]>> {
  return await api(`/api/detail-items?item_id=${itemId}&page=${page}&perPage=${perPage}`, {
    method: 'GET',
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