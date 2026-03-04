import type { Category } from "@/types/category";
import axios from "axios";
import { ENV } from "@/config/env.config";

// Create axios client for category API
const categoryAxios = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Add response interceptor to handle errors properly
categoryAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[Category API] Error response:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data,
      });
    }
    
    return Promise.reject(error);
  }
);

// ── Raw API types (snake_case – matches backend) ────────────────────────────

export interface ApiCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ── Request types ───────────────────────────────────────────────────────────

export interface CategorySearchCondition {
  keyword: string;
  is_active: boolean | "";
  is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface CategorySearchRequest {
  searchCondition: CategorySearchCondition;
  pageInfo: PageInfo;
}

export interface CreateCategoryRequest {
  code: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  code?: string;
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

// ── Mapper: snake_case API → camelCase Category ─────────────────────────────

export const mapApiCategory = (raw: ApiCategory): Category => ({
  id: raw.id as any, // MongoDB ObjectId as string, cast to ID type
  code: raw.code,
  name: raw.name,
  description: raw.description,
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

// ── API Functions ───────────────────────────────────────────────────────────

export const searchCategories = async (
  payload: CategorySearchRequest,
): Promise<Category[]> => {
  try {
    const response = await categoryAxios.post<{
      code: number;
      message: string;
      data: ApiCategory[];
    }>("/api/categories/search", payload);
    
    return (response.data.data ?? []).map(mapApiCategory);
  } catch (error) {
    console.error("[Category API] Search error:", error);
    throw error;
  }
};

export const createCategory = async (
  data: CreateCategoryRequest,
): Promise<Category> => {
  try {
    const response = await categoryAxios.post<{
      code: number;
      message: string;
      data: ApiCategory;
    }>("/api/categories", data);
    return mapApiCategory(response.data.data);
  } catch (error) {
    console.error("[Category API] Create error:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: number | string,
  data: UpdateCategoryRequest,
): Promise<Category> => {
  try {
    console.log("[Category API] Updating category:", id, data);
    const response = await categoryAxios.put<{
      code: number;
      message: string;
      data: ApiCategory;
    }>(`/api/categories/${String(id)}`, data);
    console.log("[Category API] Update response:", response.data);
    return mapApiCategory(response.data.data);
  } catch (error) {
    console.error("[Category API] Update error:", error);
    throw error;
  }
};

export const getCategory = async (id: number | string): Promise<Category> => {
  try {
    const response = await categoryAxios.get<{
      code: number;
      message: string;
      data: ApiCategory;
    }>(`/api/categories/${String(id)}`);
    return mapApiCategory(response.data.data);
  } catch (error) {
    console.error("[Category API] Get error:", error);
    throw error;
  }
};

export const deleteCategory = async (id: number | string): Promise<void> => {
  try {
    await categoryAxios.delete(`/api/categories/${String(id)}`);
  } catch (error) {
    console.error("[Category API] Delete error:", error);
    throw error;
  }
};

export const restoreCategory = async (id: number | string): Promise<Category> => {
  try {
    const response = await categoryAxios.put<{
      code: number;
      message: string;
      data: ApiCategory;
    }>(`/api/categories/${String(id)}/restore`, {});
    return mapApiCategory(response.data.data);
  } catch (error) {
    console.error("[Category API] Restore error:", error);
    throw error;
  }
};

// ── Get Select Items (for dropdowns) ────────────────────────────────────────

export interface CategorySelectItem {
  id: string;
  code: string;
  name: string;
}

export const getCategorySelectItems = async (): Promise<CategorySelectItem[]> => {
  try {
    const response = await categoryAxios.get<{
      code: number;
      message: string;
      data: CategorySelectItem[];
    }>("/api/categories/select");
    return response.data.data ?? [];
  } catch (error) {
    console.error("[Category API] Get select items error:", error);
    throw error;
  }
};
