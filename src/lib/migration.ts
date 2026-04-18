import { api } from "./api";

// ─── Enums (sesuai Prisma schema) ─────────────────────────────────────────────

export type ItemConditions = "Good" | "Fair" | "Poor";
export type ItemStatus = "available" | "borrowed" | "damaged";

export interface DetailItem {
  id: string;
  serial_number: string;
  condition: ItemConditions;
  status: ItemStatus;
  /** FK ke Room — tidak di-include sebagai object di controller */
  room_id: string;
  migration_id: string | null;
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

export interface ItemMigration {
  id: string;
  from_room_id: string;
  to_room_id: string;
  migrated_by: string;
  letter_status: string;
  notes: string | null;
  migrated_at: string;
  created_at: string;
  detail_items?: DetailItem[];
  knowing: string;
  submission: string;
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

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message: string;
}


export interface CreateMigrationPayload {
  from_room_id: string;
  to_room_id: string;
  migrated_by: string;
  detail_item_ids: string[];
  /** Wajib — sesuai controller & schema */
  letter_status: string;
  notes?: string;
  knowing: string;  // ← tambah ini
  submission: string
}

export interface UpdateMigrationPayload {
  from_room_id: string;
  to_room_id: string;
  migrated_by: string;
  /** Wajib — sesuai controller & schema */
  letter_status: string;
  notes?: string;
  detail_item_ids: string[];  // ← tambah ini
  knowing: string;  // ← tambah ini
  submission: string;
}


export async function getMigrations(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<ItemMigration>> {
  return api(`/api/item-migrations?page=${page}&limit=${limit}`);
}

export async function getMigrationById(
  id: string
): Promise<SingleResponse<ItemMigration>> {
  return api(`/api/item-migrations/${id}`);
}

export async function createMigration(
  payload: CreateMigrationPayload
): Promise<SingleResponse<ItemMigration>> {
  return api("/api/item-migrations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMigration(
  id: string,
  payload: UpdateMigrationPayload
): Promise<SingleResponse<ItemMigration>> {
  return api(`/api/item-migrations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteMigration(
  id: string
): Promise<SingleResponse<ItemMigration>> {
  return api(`/api/item-migrations/${id}`, {
    method: "DELETE",
  });
}

export async function generateSuratMutasi(migrationId: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = process.env.NEXT_PUBLIC_API_KEY;

  const res = await fetch(
    `${baseUrl}/api/letters/mutasi/generate/${migrationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || json.error || text);
    } catch {
      throw new Error(text);
    }
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `surat-mutasi-${migrationId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}