import { api } from "./api";

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export interface Purging {
  id: string;
  serial_number: string;
  item_name: string;
  category: string;
  condition: string;
  letter_status: string;
  item_status: string;
  notes: string;
  charge_person?:string;
  tanggal_dokumen: Date;
  knowing?:string;
  submission?:string;
  created_by: string;
  createdBy?: {          
    id: string;
    username: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  details: purgingDetail[];
}

export interface purgingDetail {
  id: string;
  purging_id: string;
  detail_item_id?: string;
  item_name: string;
  category: string;
  subcategory: string;
  serial_number: string;
  warehouse_id: string;
  item_status: string;
  condition: string;
  created_by: string;
  deleted_at: string | null;
}

//create purging
export async function createPurging(data: Partial<Purging>): Promise<ApiResponse<Purging>> {
  return await api("/api/purging", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//get purging
export async function getPurgings(page: number = 1, perPage: number = 10): Promise<ApiResponse<Purging[]>> {
  return await api(`/api/purging?page=${page}&limit=${perPage}`, {
    method: "GET",
  });
}


export async function getPurgingById(id: string): Promise<ApiResponse<Purging>> {
  return await api(`/api/purging/${id}`, {
    method: "GET",
  });
}

//update purging
export async function updatePurging(id: string, data: Partial<Purging>): Promise<ApiResponse<Purging>> {
  return await api(`/api/purging/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

//soft delete purging
export async function deletePurging(id: string): Promise<ApiResponse<Purging>> {
  return await api(`/api/purging/${id}`, {
    method: "DELETE",
  });
}

//get deleted
export async function getDeletedPurgings(page: number = 1, perPage: number = 10): Promise<ApiResponse<Purging[]>> {
  return await api(`/api/purging-deleted?page=${page}&limit=${perPage}`, {
    method: "GET",
  });
}

//restore purging
export async function restorePurging(id: string): Promise<ApiResponse<Purging>> {
  return await api(`/api/purging-restore/${id}`, {
    method: "PUT",
  });
}

// Ubah signature fungsi
export async function generateSuratPemutihan(
  purgingId: string,
  signatories: {
    knowing?:       string;
    submission?:    string;
    charge_person?: string;
  } = {}
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token   = process.env.NEXT_PUBLIC_API_KEY;

  const res = await fetch(`${baseUrl}/api/letters/generate/${purgingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(signatories), // ← kirim ke backend
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal generate surat: ${text}`);
  }

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `berita-acara-${purgingId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}