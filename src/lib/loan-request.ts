import { api } from "./api";

export enum LoanStatus {
  PENDING  = "pending",
  APPROVED = "approved",
  RETURNED = "returned",
}

export interface LoanRequest {
  id: string;
  user_id: string;
  item_id: string; // DetailItem ID
  borrow_date: string;
  return_date?: string | null;
  status: LoanStatus;
  description?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateLoanRequestPayload {
  user_id: string;
  item_id: string; // DetailItem ID
  borrow_date: string;
  return_date?: string;
  description?: string;
  qty: number;
  origin_warehouse_id: string;
  borrower_warehouse_id: string;
}

export interface UpdateLoanRequestPayload {
  user_id: string;
  item_id: string;
  borrow_date: string;
  return_date?: string;
  description?: string;
  status: LoanStatus;
}

export async function getLoanRequests(page = 1, limit = 10) {
  return api(`/api/loan-requests?page=${page}&limit=${limit}`);
}

export async function getLoanRequestById(id: string): Promise<LoanRequest> {
  return api(`/api/loan-requests/${id}`);
}

export async function createLoanRequest(
  payload: CreateLoanRequestPayload
): Promise<LoanRequest> {
  return api("/api/loan-requests", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      status: LoanStatus.PENDING,
    }),
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

export async function deleteLoanRequest(id: string): Promise<LoanRequest> {
  return api(`/api/loan-requests/${id}`, {
    method: "DELETE",
  });
}