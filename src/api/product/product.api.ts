import type { Product } from "@/types/product.type";
import axios from "axios";
import { ENV } from "@/config/env.config";

// Tạo axios client riêng cho product API để tránh transform snake_case
const productAxios = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Thêm response interceptor để handle errors properly
productAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[Product API] Error response:", {
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

export interface ApiProduct {
  id: string;
  SKU: string;
  name: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  images_url: string[];
  min_price: number;
  max_price: number;
  is_active: boolean;
  is_deleted: boolean;
  is_have_topping: boolean;
  created_at: string;
  updated_at: string;
}

// ── Request types ───────────────────────────────────────────────────────────

export interface ProductSearchCondition {
  keyword: string;
  min_price: number | "";
  max_price: number | "";
  is_active: boolean | "";
  is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface ProductSearchRequest {
  searchCondition: ProductSearchCondition;
  pageInfo: PageInfo;
}

export interface CreateProductRequest {
  SKU: string;
  name: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  images_url?: string[];
  min_price: number;
  max_price: number;
  is_active?: boolean;
}

export interface UpdateProductRequest {
  SKU?: string;
  name?: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  images_url?: string[];
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
}

// ── Mapper: snake_case API → camelCase Product ──────────────────────────────

export const mapApiProduct = (raw: ApiProduct): Product => ({
  id: raw.id as any, // MongoDB ObjectId as string, cast to ID type
  sku: raw.SKU,
  name: raw.name,
  description: raw.description,
  content: raw.content,
  imageUrl: raw.image_url,
  minPrice: raw.min_price,
  maxPrice: raw.max_price,
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

// ── API Functions ───────────────────────────────────────────────────────────

export const searchProducts = async (
  payload: ProductSearchRequest,
): Promise<Product[]> => {
  try {
    const response = await productAxios.post<{
      code: number;
      message: string;
      data: ApiProduct[];
    }>("/api/products/search", payload);
    
    return (response.data.data ?? []).map(mapApiProduct);
  } catch (error) {
    console.error("[Product API] Search error:", error);
    throw error;
  }
};

export const createProduct = async (
  data: CreateProductRequest,
): Promise<Product> => {
  try {
    const response = await productAxios.post<{
      code: number;
      message: string;
      data: ApiProduct;
    }>("/api/products", data);
    return mapApiProduct(response.data.data);
  } catch (error) {
    console.error("[Product API] Create error:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: number | string,
  data: UpdateProductRequest,
): Promise<Product> => {
  try {
    console.log("[Product API] Updating product:", id, data);
    const response = await productAxios.put<{
      code: number;
      message: string;
      data: ApiProduct;
    }>(`/api/products/${String(id)}`, data);
    console.log("[Product API] Update response:", response.data);
    return mapApiProduct(response.data.data);
  } catch (error) {
    console.error("[Product API] Update error:", error);
    throw error;
  }
};

export const getProduct = async (id: number | string): Promise<Product> => {
  try {
    const response = await productAxios.get<{
      code: number;
      message: string;
      data: ApiProduct;
    }>(`/api/products/${String(id)}`);
    return mapApiProduct(response.data.data);
  } catch (error) {
    console.error("[Product API] Get error:", error);
    throw error;
  }
};

export const deleteProduct = async (id: number | string): Promise<void> => {
  try {
    await productAxios.delete(`/api/products/${String(id)}`);
  } catch (error) {
    console.error("[Product API] Delete error:", error);
    throw error;
  }
};

export const restoreProduct = async (id: number | string): Promise<Product> => {
  try {
    const response = await productAxios.put<{
      code: number;
      message: string;
      data: ApiProduct;
    }>(`/api/products/${String(id)}/restore`, {});
    return mapApiProduct(response.data.data);
  } catch (error) {
    console.error("[Product API] Restore error:", error);
    throw error;
  }
};
