import { api } from "./api";


export type ConsumableRequestStatus = "Good" | "Fair" | "Poor";
export type ConsumableRequestLoanStatus = "pending" | "approved" | "returned";

export interface ConsumableRequest {
  id: string;
  // Item — many-to-many, tapi kita kirim item_id saat create
  item_id?: string;
  item?: {
    id: string;
    name: string;
    code: string;
    unit: string;
    stock: number;
    brand?: string;
    category?: { name: string };
    subcategory?: { name: string };
  }[];
  quantity: number;
  // kondisi barang (Good | Fair | Poor) → kolom "status" di Prisma
  status: ConsumableRequestStatus;
  // status alur request (pending | approved | returned) → kolom "request_status" di Prisma
  request_status: ConsumableRequestLoanStatus;
  // relasi ke User (yang login / buat request)
  created_by: string;
  createdBy?: {
    id: string;
    username: string;
  };
  // relasi ke Employee approver → kolom "employeeId" di Prisma (EmployeeOwner)
  approved_by?: string;
  employee?: {
    id: string;
    full_name: string;
  };
  // relasi ke Employee pemohon → kolom "request_by" di Prisma (RequestBy)
  request_by?: string;
  requestBy?: {
    id: string;
    full_name: string;
  };
  // relasi ke Room / Warehouse → kolom "room" di Prisma
  room_id: string;
  rooms_id?: {
    id: string;
    name: string;
    code: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

// Payload khusus CREATE — field yang wajib dikirim ke API
export type CreateConsumableRequestPayload = {
  item_id: string;
  quantity: number;
  status: ConsumableRequestStatus;       // kondisi barang
  approved_by: string;                   // employee approver (employeeId)
  request_by: string;                    // employee pemohon
  room_id: string;                       // warehouse tujuan
  created_by: string;                    // user yang login
};

// Payload khusus UPDATE — semua optional kecuali yang memang mau diubah
export type UpdateConsumableRequestPayload = Partial<{
  quantity: number;
  status: ConsumableRequestStatus;
  request_status: ConsumableRequestLoanStatus;  // ← ini yang dipakai untuk approve
  approved_by: string;
  request_by: string;
  room_id: string;
}>;


// CREATE
export async function createConsumableRequest(
  data: CreateConsumableRequestPayload
): Promise<ApiResponse<ConsumableRequest>> {
  return await api("/api/consumable-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// READ ALL
export async function getConsumableRequests(
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse<ConsumableRequest[]>> {
  return await api(
    `/api/consumable-requests?page=${page}&limit=${perPage}`,
    { method: "GET" }
  );
}

// READ BY ID
export async function getConsumableRequestById(
  id: string
): Promise<ApiResponse<ConsumableRequest>> {
  return await api(`/api/consumable-requests/${id}`, { method: "GET" });
}

// UPDATE — gunakan UpdateConsumableRequestPayload bukan Partial<ConsumableRequest>
// agar type-safe dan tidak bisa kirim field yang tidak relevan
export async function updateConsumableRequest(
  id: string,
  data: UpdateConsumableRequestPayload
): Promise<ApiResponse<ConsumableRequest>> {
  return await api(`/api/consumable-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE (soft)
export async function deleteConsumableRequest(
  id: string
): Promise<ApiResponse<ConsumableRequest>> {
  return await api(`/api/consumable-requests/${id}`, { method: "DELETE" });
}

// READ DELETED
export async function getDeletedConsumableRequests(
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse<ConsumableRequest[]>> {
  return await api(
    `/api/consumable-requests-deleted?page=${page}&limit=${perPage}`,
    { method: "GET" }
  );
}

// RESTORE
export async function restoreConsumableRequest(
  id: string
): Promise<ApiResponse<ConsumableRequest>> {
  return await api(`/api/consumable-requests-restore/${id}`, {
    method: "PUT",
  });
}