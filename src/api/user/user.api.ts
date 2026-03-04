import { httpClient } from "../httpClient.api";
<<<<<<< HEAD
=======
import { axiosClient } from "../axios.config";
>>>>>>> dev
import type {
  ApiUser,
  ApiUserCreateRequest,
  ApiUserStatusRequest,
  ApiUserUpdateRequest,
  UserCreateRequest,
  UserSearchRequest,
  UserSearchResponse,
  UserStatusRequest,
  UserUpdateRequest,
  UserListResponse,
} from "./user.type";
import type { User } from "@/types/user.type";

const BASE_URL = "/api/users";

const encodeId = (id: string) => encodeURIComponent(id);

const toUser = (raw: ApiUser): User => ({
  id: raw.id,
  email: raw.email,
  name: raw.name,
  phone: raw.phone,
<<<<<<< HEAD
  avatarUrl: raw.avatar_url || null,
  passwordHash: "",
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
=======
  avatarUrl: raw.avatarUrl || null,
  passwordHash: "",
  isActive: raw.isActive,
  isDeleted: raw.isDeleted,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
>>>>>>> dev
});

const toApiCreateRequest = (
  payload: UserCreateRequest,
): ApiUserCreateRequest => ({
  email: payload.email,
  password: payload.password,
  name: payload.name,
  phone: payload.phone,
  avatar_url: payload.avatarUrl,
});

const toApiUpdateRequest = (
  payload: UserUpdateRequest,
): ApiUserUpdateRequest => {
  const data: ApiUserUpdateRequest = {};

  if (payload.email !== undefined) data.email = payload.email;
  if (payload.password !== undefined) data.password = payload.password;
  if (payload.name !== undefined) data.name = payload.name;
  if (payload.phone !== undefined) data.phone = payload.phone;
  if (payload.avatarUrl !== undefined) data.avatar_url = payload.avatarUrl;

  return data;
};

const toApiStatusRequest = (
  payload: UserStatusRequest,
): ApiUserStatusRequest => ({
  is_active: payload.isActive,
});

/**
 * Get all users
 */
export const getAll = async (): Promise<UserListResponse> => {
  const response = await httpClient.get<ApiUser[], never>({
    url: BASE_URL,
  });

  return (response || []).map(toUser);
};

/**
 * Search users with pagination
 *
<<<<<<< HEAD
 * Uses postPaginatedRaw to bypass automatic snake_case conversion.
 * Backend search APIs expect camelCase keys (pageInfo, pageNum, etc.).
=======
 * NOTE: Payload is JSON.stringify-d before sending to bypass the automatic
 * camelCase → snake_case interceptor (the user search API expects camelCase
 * keys such as `pageInfo` / `pageNum`, not `page_info` / `page_num`).
>>>>>>> dev
 */
export const search = async (
  data: UserSearchRequest,
): Promise<UserSearchResponse> => {
  const payload = {
    searchCondition: {
      keyword: data.searchCondition.keyword,
<<<<<<< HEAD
      isActive: data.searchCondition.isActive,
      isDeleted: data.searchCondition.isDeleted,
=======
      is_active: data.searchCondition.isActive,
      is_deleted: data.searchCondition.isDeleted,
>>>>>>> dev
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

<<<<<<< HEAD
  const response = await httpClient.postPaginatedRaw<ApiUser, typeof payload>({
    url: `${BASE_URL}/search`,
    data: payload,
  });
=======
  const res = await axiosClient.post(
    `${BASE_URL}/search`,
    JSON.stringify(payload),
    { headers: { "Content-Type": "application/json" } },
  );
  const response = res.data;
>>>>>>> dev

  if (!response?.success) {
    throw new Error("Failed to search users");
  }

  return {
    pageData: (response.data || []).map(toUser),
    pageInfo: response.pageInfo || {
      pageNum: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
  };
};

/**
 * Get user by ID
 */
export const getById = async (id: string): Promise<User | null> => {
  const response = await httpClient.get<ApiUser, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });

  return response ? toUser(response) : null;
};

/**
 * Create new user
 */
export const create = async (data: UserCreateRequest): Promise<User | null> => {
  const response = await httpClient.post<ApiUser, ApiUserCreateRequest>({
    url: BASE_URL,
    data: toApiCreateRequest(data),
  });

  return response ? toUser(response) : null;
};

/**
 * Update user
 */
export const update = async (
  id: string,
  data: UserUpdateRequest,
): Promise<User | null> => {
  const response = await httpClient.put<ApiUser, ApiUserUpdateRequest>({
    url: `${BASE_URL}/${encodeId(id)}`,
    data: toApiUpdateRequest(data),
  });

  return response ? toUser(response) : null;
};

/**
 * Soft delete user
 */
export const remove = async (id: string): Promise<void> => {
  await httpClient.delete<null, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Restore deleted user
 */
export const restore = async (id: string): Promise<void> => {
  await httpClient.patch<null, never>({
    url: `${BASE_URL}/${encodeId(id)}/restore`,
  });
};

/**
 * Update user status (active/inactive)
 */
export const updateStatus = async (
  id: string,
  data: UserStatusRequest,
): Promise<void> => {
  await httpClient.patch<null, ApiUserStatusRequest>({
    url: `${BASE_URL}/${encodeId(id)}/status`,
    data: toApiStatusRequest(data),
  });
};
