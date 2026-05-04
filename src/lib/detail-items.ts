import { api } from "@/lib/api";

// ── Interfaces ─────────────────────────────────────────────────────────────
export interface DetailItemCategory {
  id: string;
  name: string;
}

export interface DetailItemSubcategory {
  id: string;
  name: string;
}

export interface DetailItemMaster {
  id: string;
  name: string;
  category?:    DetailItemCategory;
  subcategory?: DetailItemSubcategory;
}

export interface DetailItemRoom {
  id: string;
  name: string;
}

export interface DetailItem {
  id: string;
  item_id: string;
  serial_number: string;
  condition: "Baik" | "Sedang" | "Buruk";
  status: string;
  item: DetailItemMaster;
  room: DetailItemRoom;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface SubcategoryOption {
  id: string;
  name: string;
  category_id: string;
}

export interface CategoryWithSubcategories {
  id: string;
  name: string;
  subcategories: SubcategoryOption[];
}

export interface ItemOption {
  id: string;
  name: string;
  category_id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    total:       number;
    totalPages:  number;
    currentPage: number;
    perPage:     number;
  };
}

// ── Basic: available detail items by item + room ───────────────────────────
export function getAvailableDetailItems(
  itemId: string,
  roomId: string
): Promise<PaginatedResponse<DetailItem>> {
  return api(`/api/detail-items?item_id=${itemId}&room_id=${roomId}&status=Tersedia`);
}

// ── Basic: detail items by room dengan pagination + search ─────────────────
export function getDetailItemsByRoom(
  roomId: string,
  page:   number = 1,
  limit:  number = 100,
  search: string = ""
): Promise<PaginatedResponse<DetailItem>> {
  const params = new URLSearchParams({
    room_id:            roomId,
    status:             "Tersedia",
    page:               String(page),
    limit:              String(limit),
    transaction_status: "Diterima",
    ...(search ? { search } : {}),
  });
  return api(`/api/detail-items?${params.toString()}`);
}

// ── Filtered: semua kondisi dengan pagination (untuk pemutihan) ────────────
export function getDetailItemsByRoomFiltered(
  roomId: string,
  page:   number = 1,
  limit:  number = 10,
  options: {
    search?:        string;
    categoryId?:    string;
    subcategoryId?: string;
    itemId?:        string;
  } = {}
): Promise<PaginatedResponse<DetailItem>> {
  const { search, categoryId, subcategoryId, itemId } = options;

  const params = new URLSearchParams({
    room_id: roomId,
    status:  "Tersedia",
    page:    String(page),
    limit:   String(limit),
    ...(search        ? { search }                        : {}),
    ...(itemId        ? { item_id: itemId }               : {}),
    ...(categoryId    ? { category_id: categoryId }       : {}),
    ...(subcategoryId ? { subcategory_id: subcategoryId } : {}),
  });

  return api(`/api/detail-items?${params.toString()}`);
}

// ── Cascade: kategori flat (untuk pemutihan) ───────────────────────────────
export function getCategoriesByWarehouse(
  roomId: string
): Promise<{ data: CategoryOption[] }> {
  return api(`/api/detail-items/categories/by-warehouse/${roomId}`);
}

// ── Cascade: kategori flat (untuk transaction out) ─────────────────────────
export function getCategoriesByWarehouseAll(
  roomId: string
): Promise<{ data: CategoryOption[] }> {
  return api(`/api/detail-items/categories/by-warehouse-all/${roomId}`);
}

// ── Cascade: item by kategori (untuk pemutihan) ────────────────────────────
export function getItemsByWarehouseAndCategory(
  roomId: string,
  categoryId: string
): Promise<{ data: ItemOption[] }> {
  return api(`/api/detail-items/items/by-warehouse-category/${roomId}/${categoryId}`);
}

// ── Cascade: item by kategori (untuk transaction out) ─────────────────────
export function getItemsByWarehouseAndCategoryAll(
  roomId: string,
  categoryId: string
): Promise<{ data: ItemOption[] }> {
  return api(`/api/detail-items/items/by-warehouse-category-all/${roomId}/${categoryId}`);
}

// ── Cascade: kategori + subkategori grouped (untuk pemutihan) ──────────────
export function getCategoriesWithSubcategoriesByWarehouse(
  roomId: string
): Promise<{ data: CategoryWithSubcategories[] }> {
  return api(`/api/detail-items/categories-with-subcategories/by-warehouse/${roomId}`);
}

// ── Cascade: item by subkategori (untuk pemutihan) ─────────────────────────
export function getItemsByWarehouseAndSubcategory(
  roomId: string,
  subcategoryId: string
): Promise<{ data: ItemOption[] }> {
  return api(`/api/detail-items/items/by-warehouse-subcategory/${roomId}/${subcategoryId}`);
}

