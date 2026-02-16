import { api } from "./api"

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
  PURCHASE = "Buy",
  GRANT = "Donation",
}

export enum ItemConditions {
  GOOD = "Good",
  DAMAGED = "Poor",
  SAFE = "Fair",
}

export enum ItemStatus {
  AVAILABLE = "available",
  USED = "borrowed",
  DAMAGED = "damaged"
}


export interface TransactionDetail {
  id: string
  transaction_id: string
  item_id: string
  room_id: string
  quantity: number
  price: number
  condition: ItemConditions
  procurement_month: number
  procurement_year: number
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export interface DetailItem {
  id: string
  item_id: string
  transaction_id: string
  room_id: string
  migration_id?: string | null
  serial_number: string
  condition: ItemConditions
  status: ItemStatus
  created_by: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export interface Transaction {
  id: string
  user_id: string
  supplier_id: string
  type: TransactionType
  in_type?: InType
  po_number: string
  transaction_date: Date
  status: TransactionStatus
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null

  transaction_details: TransactionDetail[]
  detail_items: DetailItem[]
}

interface BaseTransactionPayload {
  user_id: string
  supplier_id: string
  po_number: string
  transaction_date: Date
  status: TransactionStatus

  transaction_details: {
    item_id: string
    room_id: string
    quantity: number
    price: number
    condition: ItemConditions
    procurement_month: number
    procurement_year: number
  }[]

  detail_items: {
    item_id: string
    room_id: string
    serial_number: string
    condition: ItemConditions
    status: ItemStatus
  }[]
}

export interface TransactionInPayload extends BaseTransactionPayload {
  in_type: InType
}

export interface TransactionOutPayload extends BaseTransactionPayload {}

// CREATE IN
export async function createTransactionIn(
  data: TransactionInPayload
): Promise<Transaction> {
  return api("/api/transactions", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      type: TransactionType.IN,
    }),
  })
}


// CREATE OUT
export async function createTransactionOut(
  payload: TransactionOutPayload
): Promise<Transaction> {
  return api("/api/transactions", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      type: TransactionType.OUT,
    }),
  })
}

// READ ALL (tanpa pagination)
export async function getTransactions(): Promise<Transaction[]> {
  return api("/api/transactions")
}

// READ BY ID
export async function getTransactionById(
  id: string
): Promise<Transaction> {
  return api(`/api/transactions/${id}`)
}

// UPDATE
export async function updateTransaction(
  id: string,
  data: Partial<BaseTransactionPayload>
): Promise<Transaction> {
  return api(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// DELETE (soft delete)
export async function deleteTransaction(
  id: string
): Promise<void> {
  await api(`/api/transactions/${id}`, {
    method: "DELETE",
  })
}
