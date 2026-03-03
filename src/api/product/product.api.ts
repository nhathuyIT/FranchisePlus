import { httpClient } from "../httpClient.api";
import type { Product } from "@/types/product.type";

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
  id: raw.id,
  sku: raw.SKU,
  name: raw.name,
  description: raw.description,
  content: raw.content,
  imageUrl: raw.image_url,
  imagesUrl: raw.images_url ?? [],
  minPrice: raw.min_price,
  maxPrice: raw.max_price,
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  isHaveTopping: raw.is_have_topping,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

// ── API Functions ───────────────────────────────────────────────────────────

export const searchProducts = async (
  payload: ProductSearchRequest,
): Promise<Product[]> => {
  const response = await httpClient.post<ApiProduct[], ProductSearchRequest>({
    url: "/api/products/search",
    data: payload,
  });
  return (response ?? []).map(mapApiProduct);
};

export const createProduct = async (
  data: CreateProductRequest,
): Promise<Product> => {
  const response = await httpClient.post<ApiProduct, CreateProductRequest>({
    url: "/api/products",
    data,
  });
  return mapApiProduct(response!);
};

export const updateProduct = async (
  id: string,
  data: UpdateProductRequest,
): Promise<Product> => {
  const response = await httpClient.put<ApiProduct, UpdateProductRequest>({
    url: `/api/products/${id}`,
    data,
  });
  return mapApiProduct(response!);
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await httpClient.get<ApiProduct>({
    url: `/api/products/${id}`,
  });
  return mapApiProduct(response!);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await httpClient.delete<void>({
    url: `/api/products/${id}`,
  });
};

export const restoreProduct = async (id: string): Promise<Product> => {
  const response = await httpClient.put<ApiProduct, Record<string, never>>({
    url: `/api/products/${id}/restore`,
    data: {},
  });
  return mapApiProduct(response!);
};
