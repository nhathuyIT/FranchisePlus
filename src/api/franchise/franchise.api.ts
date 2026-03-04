import { httpClient } from "../httpClient.api";
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
 *
 * Uses httpClient → interceptor auto-converts snake_case ↔ camelCase
 */
export const getSelect = async (): Promise<FranchiseSelectResponse> => {
  const response = await httpClient.get<FranchiseSelectResponse, never>({
    url: `${BASE_URL}/select`,
  });
  return response || [];
};

/**
 * Get all franchises (không có pagination)
 *
 * Uses httpClient → interceptor auto-converts snake_case ↔ camelCase
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
 * Uses postPaginatedRaw to bypass automatic snake_case conversion.
 * Backend expects:
 * - searchCondition fields: snake_case (is_deleted, is_active, opened_at, closed_at)
 * - pageInfo: camelCase (pageNum, pageSize)
 * Response is auto-converted by interceptor (snake_case → camelCase).
 */
export const search = async (
  data: FranchiseSearchRequest
): Promise<FranchiseSearchResponse> => {
  const payload = {
    searchCondition: {
      keyword: data.searchCondition.keyword,
      opened_at: data.searchCondition.openedAt,
      closed_at: data.searchCondition.closedAt,
      is_active: data.searchCondition.isActive,
      is_deleted: data.searchCondition.isDeleted,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const response = await httpClient.postPaginatedRaw<Franchise, typeof payload>({
    url: `${BASE_URL}/search`,
    data: payload,
  });

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
 *
 * Uses httpClient → interceptor auto-converts snake_case ↔ camelCase
 */
export const getById = async (id: string): Promise<Franchise | null> => {
  return httpClient.get<Franchise, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Create new franchise
 *
 * Uses httpClient → interceptor auto-converts:
 * - Request: camelCase → snake_case
 * - Response: snake_case → camelCase
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
 *
 * Uses httpClient → interceptor auto-converts snake_case ↔ camelCase
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
 *
 * Uses httpClient → interceptor handles response
 */
export const remove = async (id: string): Promise<void> => {
  if (!id || id === "undefined") {
    console.error("[Franchise API] Invalid ID for delete:", id);
    throw new Error("Invalid franchise ID");
  }

  await httpClient.delete<null, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Restore deleted franchise
 *
 * Uses httpClient → interceptor handles response
 */
export const restore = async (id: string): Promise<void> => {
  await httpClient.patch<null, never>({
    url: `${BASE_URL}/${encodeId(id)}/restore`,
  });
};

/**
 * Update franchise status (active/inactive)
 *
 * Uses httpClient → interceptor auto-converts:
 * - Request: { isActive } → { is_active }
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
