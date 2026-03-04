import { httpClient } from "../httpClient.api";
import { axiosClient } from "../axios.config";
import type {
  FranchiseCreateRequest,
  FranchiseSearchRequest,
  FranchiseSearchResponse,
  FranchiseSelectResponse,
  FranchiseStatusRequest,
  FranchiseUpdateRequest,
  FranchiseListResponse,
  PageInfoResponse,
} from "./franchise.type";
import type { Franchise } from "@/types/franchise";

const BASE_URL = "/api/franchises";

const encodeId = (id: string) => encodeURIComponent(id);

/**
 * Get franchise list for dropdown/select
 */
export const getSelect = async (): Promise<FranchiseSelectResponse> => {
  const response = await httpClient.get<FranchiseSelectResponse, never>({
    url: `${BASE_URL}/select`,
  });
  return response || [];
};

/**
 * Get all franchises (không có pagination)
 */
export const getAll = async (): Promise<FranchiseListResponse> => {
  const response = await httpClient.get<Franchise[], never>({
    url: BASE_URL,
  });
  return response || [];
};

/**
 * Search franchises with pagination
 *
 * NOTE: Sử dụng axiosClient trực tiếp vì response structure khác
 * (có pageInfo ngoài data wrapper).
 *
 * IMPORTANT: Backend expect camelCase keys (pageInfo, pageNum, etc.)
 * nên phải JSON.stringify để bypass snake_case interceptor.
 */
export const search = async (
  data: FranchiseSearchRequest
): Promise<FranchiseSearchResponse> => {
  const payload = {
    searchCondition: {
      keyword: data.searchCondition.keyword,
      openedAt: data.searchCondition.openedAt,
      closedAt: data.searchCondition.closedAt,
      isActive: data.searchCondition.isActive,
      isDeleted: data.searchCondition.isDeleted,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const res = await axiosClient.post(
    `${BASE_URL}/search`,
    JSON.stringify(payload),
    { headers: { "Content-Type": "application/json" } }
  );
  const response = res.data;

  if (!response?.success) {
    throw new Error("Failed to search franchises");
  }

  const defaultPageInfo: PageInfoResponse = {
    pageNum: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };

  return {
    pageData: response.data || [],
    pageInfo: response.pageInfo || defaultPageInfo,
  };
};

/**
 * Get franchise by ID
 */
export const getById = async (id: string): Promise<Franchise | null> => {
  return httpClient.get<Franchise, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Create new franchise
 */
export const create = async (
  data: FranchiseCreateRequest
): Promise<Franchise | null> => {
  return httpClient.post<Franchise, FranchiseCreateRequest>({
    url: BASE_URL,
    data,
  });
};

/**
 * Update franchise
 */
export const update = async (
  id: string,
  data: FranchiseUpdateRequest
): Promise<Franchise | null> => {
  return httpClient.put<Franchise, FranchiseUpdateRequest>({
    url: `${BASE_URL}/${encodeId(id)}`,
    data,
  });
};

/**
 * Soft delete franchise
 */
export const remove = async (id: string): Promise<void> => {
  await httpClient.delete<null, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Restore deleted franchise
 */
export const restore = async (id: string): Promise<void> => {
  await httpClient.patch<null, never>({
    url: `${BASE_URL}/${encodeId(id)}/restore`,
  });
};

/**
 * Update franchise status (active/inactive)
 */
export const updateStatus = async (
  id: string,
  data: FranchiseStatusRequest
): Promise<void> => {
  await httpClient.patch<null, FranchiseStatusRequest>({
    url: `${BASE_URL}/${encodeId(id)}/status`,
    data,
  });
};
