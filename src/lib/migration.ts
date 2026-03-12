import { api } from "./api";

export interface ItemMigration {
  id: string;
  from_room_id: string;
  to_room_id: string;
  migrated_by: string;
  notes?: string | null;
  migrated_at: string;

  detail_items?: DetailItem[];
}

export interface DetailItem {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  room_id: string;

  item: {
    id: string;
    name: string;
    code: string;
    brand: string | null;
    unit: string;
    type: string;

    category?: {
      id: string;
      name: string;
      code: string;
    };

    subcategory?: {
      id: string;
      name: string;
      code: string;
    };
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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
  message: string;
}

export interface CreateMigrationPayload {
  from_room_id: string;
  to_room_id: string;
  migrated_by: string;
  detail_item_ids: string[];
  notes?: string;
}

export interface UpdateMigrationPayload {
  from_room_id: string;
  to_room_id: string;
  migrated_by: string;
  detail_item_ids: string[];
  notes?: string;
}

export async function getMigrations(
  page: number = 1,
  limit: number = 100
): Promise<PaginatedResponse<ItemMigration>> {
  return api(`/api/item-migrations?page=${page}&limit=${limit}`);
}

export async function getMigrationById(id: string): Promise<ItemMigration> {
  return api(`/api/item-migrations/${id}`);
}

export async function createMigration(
  payload: CreateMigrationPayload
): Promise<ItemMigration> {
  return api("/api/item-migrations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMigration(
  id: string,
  payload: UpdateMigrationPayload
): Promise<ItemMigration> {
  return api(`/api/item-migrations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteMigration(id: string): Promise<ItemMigration> {
  return api(`/api/item-migrations/${id}`, {
    method: "DELETE",
  });
}