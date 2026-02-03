import { api } from "./api";

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetSuppliersResponse {
  success: boolean;
  data: Supplier[];
  pagination: Pagination;
  message: string;
}

export interface SupplierResponse {
  status: boolean;
  data: Supplier;
  message: string;
}

export interface SupplierPayload {
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

export async function getSuppliers(
  page: number = 1,
  limit: number = 10
): Promise<GetSuppliersResponse> {
  return api(`/api/suppliers?page=${page}&limit=${limit}`);
}

export async function getSupplierById(
  id: string
): Promise<Supplier[]> {
  if (!id) throw new Error("Supplier ID is required");
  const json = await api(`/api/suppliers/${id}`);
  return json.data;
}

export async function createSupplier(
  payload: SupplierPayload
): Promise<SupplierResponse> {
  return api("/api/suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateSupplier(
  supplierId: string,
  payload: SupplierPayload
): Promise<SupplierResponse> {
  if (!supplierId) throw new Error("Supplier ID is required");
  return api(`/api/suppliers/${supplierId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteSupplier(
  supplierId: string
): Promise<SupplierResponse> {
  if (!supplierId) throw new Error("Supplier ID is required");
  return api(`/api/suppliers/${supplierId}`, {
    method: "DELETE",
  });
}
