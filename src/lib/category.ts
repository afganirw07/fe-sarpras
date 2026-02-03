import { api } from "./api";

export interface Category {
  id: string;
  code: string;
  name: string;
  instansi?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  code: string;
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

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
  message: string;
}

export interface CategoryPayload {
  name: string;
  code: string;
}

export interface CreateSubcategoryPayload {
  category_id: string;
  name: string;
  code: string;
}

export interface UpdateSubcategoryPayload {
  category_id: string;
  name: string;
  code: string;
}

export async function getCategories(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Category>> {
  return api(`/api/categories?page=${page}&limit=${limit}`);
}

export async function getSubcategories(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Subcategory>> {
  return api(`/api/subcategory?page=${page}&limit=${limit}`);
}

export async function createCategory(payload: CategoryPayload) {
  return api("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createSubcategory(payload: CreateSubcategoryPayload) {
  return api("/api/subcategory", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  categoryId: string,
  payload: CategoryPayload
) {
  if (!categoryId) throw new Error("Category ID is required");

  return api(`/api/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateSubcategory(
  subcategoryId: string,
  payload: UpdateSubcategoryPayload
) {
  if (!subcategoryId) throw new Error("Subcategory ID is required");

  return api(`/api/subcategory/${subcategoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(categoryId: string) {
  if (!categoryId) throw new Error("Category ID is required");

  return api(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });
}

export async function deleteSubcategory(subcategoryId: string) {
  if (!subcategoryId) throw new Error("Subcategory ID is required");

  return api(`/api/subcategory/${subcategoryId}`, {
    method: "DELETE",
  });
}

export async function getCategoryById(
  categoryId: string
): Promise<Category | null> {
  if (!categoryId) return null;

  const json = await getCategories();
  return json.data.find((c) => c.id === categoryId) ?? null;
}

export async function getSubcategoriesByCategoryId(
  categoryId: string
): Promise<Subcategory[]> {
  if (!categoryId) return [];

  const json = await getSubcategories(1, 1000);
  return json.data.filter((sc) => sc.category_id === categoryId);
}

export async function getDeletedSubcategoriesFiltered(): Promise<Subcategory[]> {
  const json = await api("/api/subcategory");

  const deleted = Array.isArray(json.data)
    ? json.data.filter(
        (sc: Subcategory) => sc.deleted_at !== null
      )
    : [];

  return deleted;
}

export async function restoreDeletedSubcategory(
  subcategoryId: string
): Promise<Subcategory> {
  if (!subcategoryId) throw new Error("Subcategory ID is required");

  const response = await api(`/api/categories-restore/${subcategoryId}`, {
    method: "PUT",
  });

  return response.data;
}

export async function getDeletedCategories(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Category>> {
  return api(`/api/categories-deleted?page=${page}&limit=${limit}`);
}

export async function restoreDeletedCategory(
  categoryId: string
): Promise<Category> {
  if (!categoryId) throw new Error("Category ID is required");

  const response = await api(`/api/categories-restore/${categoryId}`, {
    method: "PUT",
  });

  return response.data;
}


