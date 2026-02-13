// lib/items.ts
import { api } from "./api";

export interface Item {
  id: string;
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

// CREATE - Menambah item baru
export async function createItem(data: Item) {
  return await api('/api/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// READ - Mendapatkan semua items
export async function getItems() {
  return await api('/api/items', {
    method: 'GET',
  });
}

// READ - Mendapatkan item by ID
export async function getItemById(id: string) {
  return await api(`/api/items/${id}`, {
    method: 'GET',
  });
}

// UPDATE - Update item
export async function updateItem(id: string, data: Partial<Item>) {
  return await api(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE - Hapus item
export async function deleteItem(id: string) {
  return await api(`/api/items/${id}`, {
    method: 'DELETE',
  });
}

export async function restoreDeleteItems(id:string ):Promise<Item>{
  return await api(`/api/items-restore/${id}`, {
    method: 'PUT',
  });
}
export async function getDeletedItems(): Promise<Item> {
  const json = await api("/api/items-deleted");
  return json.data;
}