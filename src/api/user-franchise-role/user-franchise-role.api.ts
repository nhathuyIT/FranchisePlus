import { httpClient } from "../httpClient.api";
import type {
  UserFranchiseRoleCreateRequest,
  UserFranchiseRoleSearchRequest,
  UserFranchiseRoleSearchResponse,
  UserFranchiseRoleItem,
  UserByFranchiseResponse,
  PageInfoResponse,
} from "./user-franchise-role.type";

const BASE_URL = "/api/user-franchise-roles";

const encodeId = (id: string | number) => encodeURIComponent(String(id));

const defaultPageInfo: PageInfoResponse = {
  pageNum: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

/**
 * Search user–franchise–role assignments with pagination
 *
 * Sends a raw JSON payload to bypass the camelCase→snake_case interceptor
 * since the backend requires mixed-case (searchCondition fields snake_case,
 * pageInfo fields camelCase). The response is still auto-converted by the
 * toCamel interceptor.
 */
export const search = async (
  data: UserFranchiseRoleSearchRequest,
): Promise<UserFranchiseRoleSearchResponse> => {
  const payload = {
    searchCondition: {
      keyword: data.searchCondition.keyword,
      user_id: data.searchCondition.userId,
      franchise_id: data.searchCondition.franchiseId,
      role_id: data.searchCondition.roleId,
      is_deleted: data.searchCondition.isDeleted,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const response = await httpClient.postPaginatedRaw<
    UserFranchiseRoleItem,
    typeof payload
  >({
    url: `${BASE_URL}/search`,
    data: payload,
  });

  if (!response?.success) {
    throw new Error("Failed to search user franchise roles");
  }

  return {
    pageData: response.data || [],
    pageInfo: response.pageInfo || defaultPageInfo,
  };
};

/**
 * Get user–franchise–role by ID
 */
export const getById = async (
  id: number,
): Promise<UserFranchiseRoleItem | null> => {
  return httpClient.get<UserFranchiseRoleItem, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Create a new user–franchise–role assignment
 */
export const create = async (
  data: UserFranchiseRoleCreateRequest,
): Promise<UserFranchiseRoleItem | null> => {
  return httpClient.post<UserFranchiseRoleItem, UserFranchiseRoleCreateRequest>(
    { url: BASE_URL, data },
  );
};

/**
 * Soft-delete a user–franchise–role assignment
 */
export const remove = async (id: number): Promise<void> => {
  await httpClient.delete<null, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Restore a soft-deleted user–franchise–role assignment
 */
export const restore = async (id: number): Promise<void> => {
  await httpClient.patch<null, never>({
    url: `${BASE_URL}/${encodeId(id)}/restore`,
  });
};

/**
 * Get all users that belong to a franchise
 */
export const getUsersByFranchiseId = async (
  franchiseId: string | number,
): Promise<UserByFranchiseResponse> => {
  const response = await httpClient.get<UserByFranchiseResponse, never>({
    url: `${BASE_URL}/franchise/${encodeId(franchiseId)}`,
  });

  return response ?? [];
};
