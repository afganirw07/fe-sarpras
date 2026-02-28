// src/lib/transaction-details.ts

import { api } from "./api";
import { ItemConditions } from "./transaction";

export interface TransactionDetail {
  id: string;
  transaction_id: string;
  item_id: string;
  room_id: string;
  quantity: number;
  price: string | number | null;
  condition: ItemConditions;
  procurement_month: number;
  procurement_year: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TransactionDetailResponse {
  data: TransactionDetail[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

// Get all details by transaction ID
export function getTransactionDetails(transactionId: string) {
  return api(`/api/transaction-details?transaction_id=${transactionId}&limit=1000`) as Promise<TransactionDetailResponse>;
}

// Get single detail by ID
export function getTransactionDetailById(id: string) {
  return api(`/api/transaction-details/${id}`) as Promise<{ data: TransactionDetail }>;
}

// Create transaction detail
export function createTransactionDetail(payload: Omit<TransactionDetail, "id" | "created_at" | "updated_at" | "deleted_at">) {
  return api("/api/transaction-details", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Update transaction detail
export function updateTransactionDetail(id: string, payload: Partial<TransactionDetail>) {
  return api(`/api/transaction-details/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Delete transaction detail
export function deleteTransactionDetail(id: string) {
  return api(`/api/transaction-details/${id}`, {
    method: "DELETE",
  });
}