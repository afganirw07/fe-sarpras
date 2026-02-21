import { api } from "./api";

export enum TransactionStatus {
  DRAFT = "draft",
  APPROVED = "approved",
  RECEIVED = "received",
}

export enum TransactionType {
  IN = "In",
  OUT = "Out",
}

export enum InType {
  BUY = "Buy",
  DONATION = "Donation",
}

export enum ItemConditions {
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor",
}

export enum ItemStatus {
  AVAILABLE = "available",
  USED = "borrowed",
  DAMAGED = "damaged",
}

export interface TransactionDetail {
  id: string;
  transaction_id: string;
  item_id: string;
  room_id: string;
  quantity: number;
  price: number | null;
  condition: ItemConditions;
  procurement_month: number;
  procurement_year: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface DetailItem {
  id: string;
  item_id: string;
  transaction_id: string;
  room_id: string;
  migration_id?: string | null;
  serial_number: string;
  condition: ItemConditions;
  status: ItemStatus;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  supplier_id: string;
  type: TransactionType;
  in_type?: InType;
  po_number: string;
  transaction_date: Date;
  status: TransactionStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;

  transaction_details: TransactionDetail[];
  detail_items: DetailItem[];
}

export interface TransactionPaginationResponse {
  data: Transaction[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface BaseTransactionPayload {
  user_id: string;
  supplier_id: string;
  po_number: string;
  transaction_date: Date;
  status: TransactionStatus;
}

export interface TransactionDetailPayload {
  item_id: string;
  room_id: string;
  quantity: number;
  price: number | null;
  condition: ItemConditions;
  procurement_month: number;
  procurement_year: number;
}

export interface DetailItemPayload {
  item_id: string;
  room_id: string;
  serial_number: string;
  condition: ItemConditions;
  status: ItemStatus;
  created_by: string;
}

export interface TransactionInPayload extends BaseTransactionPayload {
  in_type: InType;
  transaction_details: TransactionDetailPayload[];
  detail_items: DetailItemPayload[];
}

export interface TransactionOutPayload extends BaseTransactionPayload {
  transaction_details: TransactionDetailPayload[];
}

export async function createTransactionIn(
  payload: TransactionInPayload
): Promise<Transaction> {
  return api("/api/transactions", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      type: TransactionType.IN,
      transaction_details: payload.transaction_details.map((d) => ({
        ...d,
        price:
          payload.in_type === InType.DONATION || d.price === 0
            ? null
            : d.price,
      })),
    }),
  });
}

export async function createTransactionOut(
  payload: TransactionOutPayload
): Promise<Transaction> {
  return api("/api/transactions", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      type: TransactionType.OUT,
    }),
  });
}

export async function getTransactions(
  page = 1,
  limit = 10,
  search?: string
): Promise<TransactionPaginationResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);

  return api(`/api/transactions?${params.toString()}`);
}

export async function getTransactionById(
  id: string
): Promise<Transaction> {
  return api(`/api/transactions/${id}`);
}

export async function updateTransaction(
  id: string,
  payload: Partial<BaseTransactionPayload>
): Promise<Transaction> {
  return api(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTransaction(
  id: string
): Promise<void> {
  await api(`/api/transactions/${id}`, {
    method: "DELETE",
  });
}
