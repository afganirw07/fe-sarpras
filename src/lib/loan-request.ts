import { api } from "./api";

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum LoanStatus {
  PENDING  = "Pending",
  APPROVED = "Disetujui",
  RETURNED = "Dikembalikan",
}

// ─── Sub-types (sesuai controller include) ────────────────────────────────────

export interface LoanDetailItem {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  returned_by: string
  /** FK ke Room */
  room_id: string;
  item_id: string;
  item: {
    id: string;
    name: string;
    unit: string;
    category: { id: string; name: string };
    subcategory: { id: string; name: string };
  };
  room: { id: string; name: string };
}

// ─── Main interface ───────────────────────────────────────────────────────────

export interface LoanRequest {
  id: string;
  user_id: string;
  /** Legacy scalar FK di schema — tetap ada tapi bukan sumber data utama */
  item_id: string;
  borrow_date: string;
  return_date: string | null;
  status: LoanStatus;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  returned_by: string | null;

  /** Many-to-many: array DetailItem yang dipinjam */
  item: LoanDetailItem[];
  user?: { username: string };
}

// ─── Pagination ───────────────────────────────────────────────────────────────

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

// ─── Payload types ────────────────────────────────────────────────────────────

export interface CreateLoanRequestPayload {
  user_id: string;
  /** Array DetailItem ID — sesuai controller createLoanRequest */
  item_ids: string[];
  borrow_date: string;
  return_date?: string;
  description?: string;
  origin_warehouse_id: string;
  borrower_warehouse_id: string;
}

export interface UpdateLoanRequestPayload {
  user_id: string;
  item_ids: string[];
  borrow_date: string;
  return_date?: string | null;
  status: LoanStatus;
  description?: string;
  returned_by?: string; // ← tambah ini (Employee.id)
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getLoanRequests(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<LoanRequest>> {
  return api(`/api/loan-requests?page=${page}&limit=${limit}`);
}

export async function getLoanRequestById(id: string): Promise<LoanRequest> {
  const res = await api(`/api/loan-requests/${id}`);
  return res.data;
}

export async function createLoanRequest(
  payload: CreateLoanRequestPayload
): Promise<LoanRequest> {
  return api("/api/loan-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLoanRequest(
  id: string,
  payload: UpdateLoanRequestPayload
): Promise<LoanRequest> {
  return api(`/api/loan-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLoanRequest(id: string): Promise<void> {
  await api(`/api/loan-requests/${id}`, { method: "DELETE" });
}