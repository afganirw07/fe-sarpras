import { api } from "@/lib/api";

export interface DetailItemCategory {
  id: string;
  name: string;
}

export interface DetailItemMaster {
  id: string;
  name: string;
  category?: DetailItemCategory;
}

export interface DetailItemRoom {
  id: string;
  name: string;
}

export interface DetailItem {
  id: string;
  item_id: string;
  serial_number: string;
  condition: string;
  status: string;
  item: DetailItemMaster;
  room: DetailItemRoom;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface ItemOption {
  id: string;
  name: string;
  category_id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

// ── Basic: available detail items by item + room ───────────────────────────
export function getAvailableDetailItems(
  itemId: string,
  roomId: string
): Promise<PaginatedResponse<DetailItem>> {
  return api(`/api/detail-items?item_id=${itemId}&room_id=${roomId}&status=available`);
}

// ── Basic: detail items by room dengan pagination + search ─────────────────
export function getDetailItemsByRoom(
  roomId: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  
  
): Promise<PaginatedResponse<DetailItem>> {
  const params = new URLSearchParams({
    room_id: roomId,
    status:  "available",
    page:    String(page),
    limit:   String(limit),
    ...(search ? { search } : {}),
    transaction_status: "received",
  });
  return api(`/api/detail-items?${params.toString()}`);
}

// ── Filtered: detail items condition=Poor dengan pagination (untuk pemutihan) ──
export function getDetailItemsByRoomFiltered(
  roomId: string,
  page: number = 1,
  limit: number = 10,
  options: {
    search?:     string;
    categoryId?: string;
    itemId?:     string;
  } = {}
): Promise<PaginatedResponse<DetailItem>> {
  const { search, categoryId, itemId } = options;

  const params = new URLSearchParams({
    room_id:   roomId,
    status:    "available",
    condition: "Poor",
    page:      String(page),
    limit:     String(limit),
    ...(search     ? { search }                  : {}),
    ...(itemId     ? { item_id: itemId }          : {}),
    ...(categoryId ? { category_id: categoryId }  : {}),
  });

  return api(`/api/detail-items?${params.toString()}`);
}

// ── Cascade: kategori unik condition=Poor (untuk pemutihan) ───────────────
export function getCategoriesByWarehouse(
  roomId: string
): Promise<{ data: CategoryOption[] }> {
  return api(`/api/detail-items/categories/by-warehouse/${roomId}`);
}

// ── Cascade: item unik condition=Poor by warehouse + kategori (untuk pemutihan) ──
export function getItemsByWarehouseAndCategory(
  roomId: string,
  categoryId: string
): Promise<{ data: ItemOption[] }> {
  return api(`/api/detail-items/items/by-warehouse-category/${roomId}/${categoryId}`);
}

// ── Cascade: kategori unik TANPA filter condition (untuk transaction out) ──
export function getCategoriesByWarehouseAll(
  roomId: string
): Promise<{ data: CategoryOption[] }> {
  return api(`/api/detail-items/categories/by-warehouse-all/${roomId}`);
}

// ── Cascade: item unik TANPA filter condition (untuk transaction out) ──────
export function getItemsByWarehouseAndCategoryAll(
  roomId: string,
  categoryId: string
): Promise<{ data: ItemOption[] }> {
  return api(`/api/detail-items/items/by-warehouse-category-all/${roomId}/${categoryId}`);
}