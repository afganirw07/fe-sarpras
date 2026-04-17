import { api } from "./api";

export interface GetDeletedFundingSourcesResponse {
  status: boolean;
  data: FundingSource[];       // array langsung, bukan nested object
  page: number;
  limit: number;
  totalFundingSource: number;
  totalPages: number;
}

export interface FundingSource {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetFundingSourcesResponse {
  success: boolean;
  data: {
    fundingSource: FundingSource[];
    totalFundingSource: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface FundingSourceResponse {
  success: boolean;
  data: FundingSource;
  message: string;
}

export interface FundingSourcePayload {
  name: string;
  email: string;
  phone_number: string;
  description?: string;
  created_by: string;
}

// ─── GET ALL ─────────────────────────────────────────────
export async function getFundingSources(
  page: number = 1,
  limit: number = 10
): Promise<GetFundingSourcesResponse> {
  return api(`/api/funding-source?page=${page}&limit=${limit}`);
}

// ─── GET BY ID ──────────────────────────────────────────
export async function getFundingSourceById(
  id: string
): Promise<FundingSource> {
  const json = await api(`/api/funding-source/${id}`);
  return json.data;
}

// ─── CREATE ─────────────────────────────────────────────
export async function createFundingSource(
  payload: FundingSourcePayload
): Promise<FundingSourceResponse> {
  return api("/api/funding-source", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── UPDATE ─────────────────────────────────────────────
export async function updateFundingSource(
  id: string,
  payload: FundingSourcePayload
): Promise<FundingSourceResponse> {
  if (!id) throw new Error("Funding Source ID is required");

  return api(`/api/funding-source/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── DELETE (SOFT DELETE) ───────────────────────────────
export async function deleteFundingSource(
  id: string
): Promise<FundingSourceResponse> {
  if (!id) throw new Error("Funding Source ID is required");

  return api(`/api/funding-source/${id}`, {
    method: "DELETE",
  });
}

// ─── GET DELETED ────────────────────────────────────────
export async function getDeletedFundingSources(
  page: number = 1,
  limit: number = 10
): Promise<GetDeletedFundingSourcesResponse> {
  return api(`/api/funding-source/deleted?page=${page}&limit=${limit}`);
}

export async function restoreDeletedFundingSource(id: string) {
  if (!id) throw new Error("ID is required");

  return api(`/api/funding-source/restore/${id}`, {
    method: "PATCH",
  });
}