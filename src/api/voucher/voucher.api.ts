import type { Voucher, VoucherType } from "@/types/voucher";
import axios from "axios";
import { ENV } from "@/config/env.config";

const voucherAxios = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 30000,
});

voucherAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[Voucher API] Error response:", {
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

export interface ApiVoucher {
  id: string;
  code?: string;
  name: string;
  franchise_id: string;
  franchise_name?: string;
  product_franchise_id?: string | null;
  product_id?: string | null;
  product_name?: string;
  type: VoucherType;
  value: number;
  quota_total?: number;
  quota_used?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface VoucherSearchCondition {
  code: string;
  franchise_id?: string;
  product_franchise_id?: string;
  type?: VoucherType | "";
  value?: number | "";
  start_date?: string;
  end_date?: string;
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

export interface VoucherSearchResponse {
  data: Voucher[];
  pageInfo: PageInfoResponse;
}

export interface VoucherSearchRequest {
  searchCondition: VoucherSearchCondition;
  pageInfo: PageInfo;
}

export interface CreateVoucherRequest {
  name: string;
  franchise_id: string;
  product_franchise_id?: string | null;
  type: VoucherType;
  value: number;
  quota_total: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export interface UpdateVoucherRequest {
  name?: string;
  franchise_id?: string;
  product_franchise_id?: string | null;
  type?: VoucherType;
  value?: number;
  quota_total?: number;
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

export const mapApiVoucher = (raw: ApiVoucher): Voucher => ({
  id: raw.id as unknown as number,
  code: raw.code || "",
  name: raw.name,
  franchiseId: raw.franchise_id as unknown as number,
  franchiseName: raw.franchise_name || "",
  productFranchiseId: raw.product_franchise_id
    ? (raw.product_franchise_id as unknown as number)
    : null,
  productId: raw.product_id ? (raw.product_id as unknown as number) : null,
  productName: raw.product_name || "",
  type: raw.type,
  value: raw.value,
  quotaTotal: raw.quota_total ?? 0,
  quotaUsed: raw.quota_used ?? 0,
  startTime: raw.start_time || raw.start_date || "",
  endTime: raw.end_time || raw.end_date || "",
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

const normalizeSearchResponse = (raw: unknown): VoucherSearchResponse => {
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

  const rows = rowsRaw as ApiVoucher[];
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
    data: rows.map(mapApiVoucher),
    pageInfo,
  };
};

export const searchVouchers = async (
  payload: VoucherSearchRequest,
): Promise<VoucherSearchResponse> => {
  const response = await voucherAxios.post<{
    success?: boolean;
    code?: number;
    message?: string;
    data?: unknown;
    pageInfo?: Partial<PageInfoResponse>;
  }>("/api/vouchers/search", payload);

  return normalizeSearchResponse({
    data: response.data.data,
    pageInfo: response.data.pageInfo,
  });
};

export const createVoucher = async (
  data: CreateVoucherRequest,
): Promise<Voucher> => {
  const response = await voucherAxios.post<{
    code: number;
    message: string;
    data: ApiVoucher;
  }>("/api/vouchers", data);

  return mapApiVoucher(response.data.data);
};

export const updateVoucher = async (
  id: number | string,
  data: UpdateVoucherRequest,
): Promise<Voucher> => {
  const response = await voucherAxios.put<{
    code: number;
    message: string;
    data: ApiVoucher;
  }>(`/api/vouchers/${String(id)}`, data);

  return mapApiVoucher(response.data.data);
};

export const getVoucher = async (id: number | string): Promise<Voucher> => {
  const response = await voucherAxios.get<{
    code: number;
    message: string;
    data: ApiVoucher;
  }>(`/api/vouchers/${String(id)}`);

  return mapApiVoucher(response.data.data);
};

export const deleteVoucher = async (id: number | string): Promise<void> => {
  await voucherAxios.delete(`/api/vouchers/${String(id)}`);
};

export const restoreVoucher = async (id: number | string): Promise<Voucher> => {
  const response = await voucherAxios.patch<{
    code: number;
    message: string;
    data: ApiVoucher;
  }>(`/api/vouchers/${String(id)}/restore`);

  return mapApiVoucher(response.data.data);
};
