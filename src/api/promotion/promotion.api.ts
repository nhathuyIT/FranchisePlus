import type { Promotion, PromotionType } from "@/types/promotion";
import axios from "axios";
import { ENV } from "@/config/env.config";

const promotionAxios = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 30000,
});

promotionAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[Promotion API] Error response:", {
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

export interface ApiPromotion {
  id: string;
  name?: string;
  franchise_id: string;
  product_franchise_id?: string | null;
  product_id?: string | null;
  franchise_name?: string;
  product_name?: string;
  type: PromotionType;
  value: number;
  start_time?: string;
  end_time?: string;
  start_date?: string;
  end_date?: string;
  created_by?: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionSearchCondition {
  keyword: string;
  franchise_id?: string;
  //   product_franchise_id?: string;
  type?: PromotionType | "";
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

export interface PromotionSearchResponse {
  data: Promotion[];
  pageInfo: PageInfoResponse;
}

export interface PromotionSearchRequest {
  searchCondition: PromotionSearchCondition;
  pageInfo: PageInfo;
}

export interface CreatePromotionRequest {
  name: string;
  franchise_id: string;
  product_franchise_id?: string | null;
  type: PromotionType;
  value: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export interface UpdatePromotionRequest {
  name?: string;
  franchise_id?: string;
  product_franchise_id?: string | null;
  type?: PromotionType;
  value?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

const defaultPageInfo: PageInfoResponse = {
  pageNum: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

export const mapApiPromotion = (raw: ApiPromotion): Promotion => ({
  id: raw.id as unknown as number,
  name: raw.name || "",
  franchiseId: raw.franchise_id as unknown as number,
  franchiseName: raw.franchise_name || "",
  productFranchiseId: raw.product_franchise_id
    ? (raw.product_franchise_id as unknown as number)
    : null,
  productId: raw.product_id ? (raw.product_id as unknown as number) : null,
  productName: raw.product_name || "",
  type: raw.type,
  value: raw.value,
  startTime: raw.start_time || raw.start_date || "",
  endTime: raw.end_time || raw.end_date || "",
  createdBy: (raw.created_by || "") as unknown as number,
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

const normalizeSearchResponse = (raw: unknown): PromotionSearchResponse => {
  if (!raw || typeof raw !== "object") {
    return { data: [], pageInfo: defaultPageInfo };
  }

  const obj = raw as {
    data?: unknown;
    pageData?: unknown;
    pageInfo?: Partial<PageInfoResponse>;
  };

  const rowsRaw = Array.isArray(obj.data)
    ? obj.data
    : Array.isArray(obj.pageData)
      ? obj.pageData
      : [];

  const rows = rowsRaw as ApiPromotion[];
  const pageInfo: PageInfoResponse = {
    pageNum: obj.pageInfo?.pageNum ?? defaultPageInfo.pageNum,
    pageSize: obj.pageInfo?.pageSize ?? defaultPageInfo.pageSize,
    totalItems: obj.pageInfo?.totalItems ?? rows.length,
    totalPages:
      obj.pageInfo?.totalPages ??
      Math.max(
        1,
        Math.ceil(
          (obj.pageInfo?.totalItems ?? rows.length) /
            (obj.pageInfo?.pageSize ?? defaultPageInfo.pageSize),
        ),
      ),
  };

  return {
    data: rows.map(mapApiPromotion),
    pageInfo,
  };
};

export const searchPromotions = async (
  payload: PromotionSearchRequest,
): Promise<PromotionSearchResponse> => {
  const response = await promotionAxios.post<{
    success?: boolean;
    code?: number;
    message?: string;
    data?: unknown;
    pageInfo?: Partial<PageInfoResponse>;
  }>("/api/promotions/search", payload);

  return normalizeSearchResponse({
    data: response.data.data,
    pageInfo: response.data.pageInfo,
  });
};

export const createPromotion = async (
  data: CreatePromotionRequest,
): Promise<Promotion> => {
  const response = await promotionAxios.post<{
    code: number;
    message: string;
    data: ApiPromotion;
  }>("/api/promotions", data);

  return mapApiPromotion(response.data.data);
};

export const updatePromotion = async (
  id: number | string,
  data: UpdatePromotionRequest,
): Promise<Promotion> => {
  const response = await promotionAxios.put<{
    code: number;
    message: string;
    data: ApiPromotion;
  }>(`/api/promotions/${String(id)}`, data);

  return mapApiPromotion(response.data.data);
};

export const getPromotion = async (id: number | string): Promise<Promotion> => {
  const response = await promotionAxios.get<{
    code: number;
    message: string;
    data: ApiPromotion;
  }>(`/api/promotions/${String(id)}`);

  return mapApiPromotion(response.data.data);
};

export const deletePromotion = async (id: number | string): Promise<void> => {
  await promotionAxios.delete(`/api/promotions/${String(id)}`);
};

export const restorePromotion = async (
  id: number | string,
): Promise<Promotion> => {
  const response = await promotionAxios.patch<{
    code: number;
    message: string;
    data: ApiPromotion;
  }>(`/api/promotions/${String(id)}/restore`);

  return mapApiPromotion(response.data.data);
};
