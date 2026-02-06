// lib/items.ts
import { api } from "./api";

export interface Item {
  id: string
  code: string;
  category: string;
  subCategory: string;
  price: number;
  unit: number;
  name: string;
  brand: string;
}

// CREATE - Menambah item baru
export async function createItem(data: Item) {
  return await api('api/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// READ - Mendapatkan semua items
export async function getItems() {
  return await api('api/items', {
    method: 'GET',
  });
}

// READ - Mendapatkan item by ID
export async function getItemById(id: string) {
  return await api(`api/items/${id}`, {
    method: 'GET',
  });
}

// UPDATE - Update item
export async function updateItem(id: string, data: Partial<Item>) {
  return await api(`api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE - Hapus item
export async function deleteItem(id: string) {
  return await api(`api/items/${id}`, {
    method: 'DELETE',
  });
}