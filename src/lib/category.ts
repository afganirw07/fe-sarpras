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

export async function getCategories(): Promise<Category[]> {
  const json = await api("/api/categories");
  return json.data;
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const json = await api("/api/subcategory");
  return json.data;
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

  const categories = await getCategories();
  return categories.find((c) => c.id === categoryId) ?? null;
}

export async function getSubcategoriesByCategoryId(
  categoryId: string
): Promise<Subcategory[]> {
  if (!categoryId) return [];

  const subcategories = await getSubcategories();
  return subcategories.filter(
    (sc) => sc.category_id === categoryId
  );
}
