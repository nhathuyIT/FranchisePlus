import { httpClient } from "../httpClient.api";
import { axiosClient } from "../axios.config";
import type { CustomerProfile } from "@/types/customer";
import type {
  CustomerSearchRequest,
  CustomerSearchResponse,
  CustomerUpdateRequest,
  CustomerStatusRequest,
  PageInfoResponse,
} from "./customer-admin.type";

const BASE_URL = "/api/customers";

const encodeId = (id: string) => encodeURIComponent(id);

const defaultPageInfo: PageInfoResponse = {
  pageNum: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

/**
 * Search customers with pagination
 *
 * Sends raw JSON to bypass camelCase→snake_case interceptor for searchCondition keys.
 * Response is auto-converted by the toCamel interceptor.
 */
export const search = async (
  data: CustomerSearchRequest,
): Promise<CustomerSearchResponse> => {
  const payload = {
    searchCondition: {
      keyword: data.searchCondition.keyword,
      is_active: data.searchCondition.isActive,
      is_deleted: data.searchCondition.isDeleted,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const res = await axiosClient.post(
    `${BASE_URL}/search`,
    JSON.stringify(payload),
    { headers: { "Content-Type": "application/json" } },
  );
  const response = res.data;

  if (!response?.success) {
    throw new Error("Failed to search customers");
  }

  return {
    pageData: response.data || [],
    pageInfo: response.pageInfo || defaultPageInfo,
  };
};

/**
 * Get customer by ID
 */
export const getById = async (id: string): Promise<CustomerProfile | null> => {
  return httpClient.get<CustomerProfile, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Update customer info
 */
export const update = async (
  id: string,
  data: CustomerUpdateRequest,
): Promise<CustomerProfile | null> => {
  return httpClient.put<CustomerProfile, CustomerUpdateRequest>({
    url: `${BASE_URL}/${encodeId(id)}`,
    data,
  });
};

/**
 * Soft-delete customer
 */
export const remove = async (id: string): Promise<void> => {
  await httpClient.delete<null, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Restore soft-deleted customer
 */
export const restore = async (id: string): Promise<void> => {
  await httpClient.patch<null, never>({
    url: `${BASE_URL}/${encodeId(id)}/restore`,
  });
};

/**
 * Update customer active status
 */
export const updateStatus = async (
  id: string,
  data: CustomerStatusRequest,
): Promise<void> => {
  await httpClient.patch<null, CustomerStatusRequest>({
    url: `${BASE_URL}/${encodeId(id)}/status`,
    data,
  });
};
