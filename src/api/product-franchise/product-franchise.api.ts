import type { ProductFranchise } from "@/types/product.type";
import axios from "axios";
import { ENV } from "@/config/env.config";

// Create axios client for product-franchise API
const productFranchiseAxios = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Add response interceptor to handle errors properly
productFranchiseAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[Product Franchise API] Error response:", {
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

export interface ApiProductFranchise {
  id: string;
  franchise_id: string;
  franchise_name?: string;
  product_id: string;
  product_sku?: string;
  product_name?: string;
  product_description?: string;
  product_content?: string;
  product_image_url?: string;
  size?: string;
  price_base: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ── Request types ───────────────────────────────────────────────────────────

export interface ProductFranchiseSearchCondition {
  keyword: string;
  franchise_id: string | "";
  product_id: string | "";
  min_price: number | "";
  max_price: number | "";
  is_active: boolean | "";
  is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface ProductFranchiseSearchRequest {
  searchCondition: ProductFranchiseSearchCondition;
  pageInfo: PageInfo;
}

export interface CreateProductFranchiseRequest {
  franchise_id: string;
  product_id: string;
  size?: string;
  price_base: number;
  is_active?: boolean;
}

export interface UpdateProductFranchiseRequest {
  size?: string;
  price_base?: number;
  is_active?: boolean;
}

export interface ChangeStatusRequest {
  is_active: boolean;
}

// ── Mapper: snake_case API → camelCase ProductFranchise ─────────────────────

export const mapApiProductFranchise = (raw: ApiProductFranchise): ProductFranchise & {
  franchiseName?: string;
  productSku?: string;
  productName?: string;
  productDescription?: string;
  productContent?: string;
  productImageUrl?: string;
} => ({
  id: raw.id as any, // MongoDB ObjectId as string
  franchiseId: raw.franchise_id as any,
  productId: raw.product_id as any,
  size: raw.size,
  priceBase: raw.price_base,
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  // Additional fields from join
  franchiseName: raw.franchise_name,
  productSku: raw.product_sku,
  productName: raw.product_name,
  productDescription: raw.product_description,
  productContent: raw.product_content,
  productImageUrl: raw.product_image_url,
});

// ── API Functions ───────────────────────────────────────────────────────────

export const searchProductFranchises = async (
  payload: ProductFranchiseSearchRequest,
): Promise<Array<ProductFranchise & {
  franchiseName?: string;
  productSku?: string;
  productName?: string;
  productImageUrl?: string;
}>> => {
  try {
    const response = await productFranchiseAxios.post<{
      code: number;
      message: string;
      data: ApiProductFranchise[];
    }>("/api/product-franchises/search", payload);
    
    return (response.data.data ?? []).map(mapApiProductFranchise);
  } catch (error) {
    console.error("[Product Franchise API] Search error:", error);
    throw error;
  }
};

export const createProductFranchise = async (
  data: CreateProductFranchiseRequest,
): Promise<ProductFranchise> => {
  try {
    const response = await productFranchiseAxios.post<{
      code: number;
      message: string;
      data: ApiProductFranchise;
    }>("/api/product-franchises", data);
    return mapApiProductFranchise(response.data.data);
  } catch (error) {
    console.error("[Product Franchise API] Create error:", error);
    throw error;
  }
};

export const updateProductFranchise = async (
  id: number | string,
  data: UpdateProductFranchiseRequest,
): Promise<ProductFranchise> => {
  try {
    console.log("[Product Franchise API] Updating product franchise:", id, data);
    const response = await productFranchiseAxios.put<{
      code: number;
      message: string;
      data: ApiProductFranchise;
    }>(`/api/product-franchises/${String(id)}`, data);
    console.log("[Product Franchise API] Update response:", response.data);
    return mapApiProductFranchise(response.data.data);
  } catch (error) {
    console.error("[Product Franchise API] Update error:", error);
    throw error;
  }
};

export const getProductFranchise = async (id: number | string): Promise<ProductFranchise> => {
  try {
    const response = await productFranchiseAxios.get<{
      code: number;
      message: string;
      data: ApiProductFranchise;
    }>(`/api/product-franchises/${String(id)}`);
    return mapApiProductFranchise(response.data.data);
  } catch (error) {
    console.error("[Product Franchise API] Get error:", error);
    throw error;
  }
};

export const deleteProductFranchise = async (id: number | string): Promise<void> => {
  try {
    await productFranchiseAxios.delete(`/api/product-franchises/${String(id)}`);
  } catch (error) {
    console.error("[Product Franchise API] Delete error:", error);
    throw error;
  }
};

export const restoreProductFranchise = async (id: number | string): Promise<ProductFranchise> => {
  try {
    const response = await productFranchiseAxios.patch<{
      code: number;
      message: string;
      data: ApiProductFranchise;
    }>(`/api/product-franchises/${String(id)}/restore`, {});
    return mapApiProductFranchise(response.data.data);
  } catch (error) {
    console.error("[Product Franchise API] Restore error:", error);
    throw error;
  }
};

export const changeStatusProductFranchise = async (
  id: number | string,
  data: ChangeStatusRequest,
): Promise<ProductFranchise> => {
  try {
    const response = await productFranchiseAxios.patch<{
      code: number;
      message: string;
      data: ApiProductFranchise;
    }>(`/api/product-franchises/${String(id)}/status`, data);
    return mapApiProductFranchise(response.data.data);
  } catch (error) {
    console.error("[Product Franchise API] Change status error:", error);
    throw error;
  }
};

// ── Get Products by Franchise (for manager view) ────────────────────────────

export const getProductsByFranchise = async (
  franchiseId: string,
  onlyActive = true,
): Promise<Array<ProductFranchise & {
  franchiseName?: string;
  productSku?: string;
  productName?: string;
  productImageUrl?: string;
}>> => {
  try {
    const response = await productFranchiseAxios.get<{
      code: number;
      message: string;
      data: ApiProductFranchise[];
    }>(`/api/product-franchises/franchise/${franchiseId}`, {
      params: { onlyActive },
    });
    return (response.data.data ?? []).map(mapApiProductFranchise);
  } catch (error) {
    console.error("[Product Franchise API] Get products by franchise error:", error);
    throw error;
  }
};
