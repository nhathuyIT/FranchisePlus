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
  },
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

export interface PageInfoResponse extends PageInfo {
  totalItems: number;
  totalPages: number;
}

export interface ProductSearchResponse {
  data: Product[];
  pageInfo: PageInfoResponse;
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
  is_have_topping?: boolean;
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
  is_have_topping?: boolean;
  is_active?: boolean;
}

// ── Mapper: snake_case API → camelCase Product ──────────────────────────────

export const mapApiProduct = (raw: ApiProduct): Product => ({
  id: raw.id as unknown as Product["id"],
  sku: raw.SKU,
  name: raw.name,
  description: raw.description,
  content: raw.content,
  imageUrl: raw.image_url,
  minPrice: raw.min_price,
  maxPrice: raw.max_price,
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  isHaveTopping: raw.is_have_topping,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

// ── API Functions ───────────────────────────────────────────────────────────

const defaultPageInfo: PageInfoResponse = {
  pageNum: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

const normalizeSearchResponse = (raw: unknown): ProductSearchResponse => {
  if (!raw || typeof raw !== "object") {
    return { data: [], pageInfo: defaultPageInfo };
  }

  const obj = raw as {
    data?: unknown;
    pageData?: unknown;
    pageInfo?: Partial<PageInfoResponse>;
  };

  // Backend responses in this project vary; support:
  // - { data: ApiProduct[], pageInfo }
  // - { data: { pageData: ApiProduct[], pageInfo } }
  // - { pageData: ApiProduct[], pageInfo }
  const container =
    obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)
      ? (obj.data as { pageData?: unknown; pageInfo?: Partial<PageInfoResponse>; data?: unknown })
      : undefined;

  const rowsRaw = Array.isArray(obj.data)
    ? obj.data
    : Array.isArray(obj.pageData)
      ? obj.pageData
      : Array.isArray(container?.pageData)
        ? container?.pageData
        : Array.isArray(container?.data)
          ? container?.data
          : [];

  const rows = rowsRaw as ApiProduct[];
  const pageInfoRaw = container?.pageInfo ?? obj.pageInfo;
  const pageSize = pageInfoRaw?.pageSize ?? defaultPageInfo.pageSize;
  const totalItems = pageInfoRaw?.totalItems ?? rows.length;

  const pageInfo: PageInfoResponse = {
    pageNum: pageInfoRaw?.pageNum ?? defaultPageInfo.pageNum,
    pageSize,
    totalItems,
    totalPages:
      pageInfoRaw?.totalPages ??
      Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize))),
  };

  return {
    data: rows.map(mapApiProduct),
    pageInfo,
  };
};

export const searchProductsPaged = async (
  payload: ProductSearchRequest,
): Promise<ProductSearchResponse> => {
  try {
    const response = await productAxios.post<{
      code?: number;
      message?: string;
      data?: unknown;
      pageInfo?: Partial<PageInfoResponse>;
    }>("/api/products/search", payload);

    return normalizeSearchResponse({
      data: response.data.data,
      pageInfo: response.data.pageInfo,
    });
  } catch (error) {
    console.error("[Product API] Search error:", error);
    throw error;
  }
};

export const searchProducts = async (
  payload: ProductSearchRequest,
): Promise<Product[]> => {
  const res = await searchProductsPaged(payload);
  return res.data;
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
