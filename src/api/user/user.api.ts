import { httpClient } from "../httpClient.api";
import { axiosClient } from "../axios.config";
import type {
  ApiUser,
  ApiUserCreateRequest,
  ApiUserSearchRequest,
  ApiUserStatusRequest,
  ApiUserUpdateRequest,
  UserCreateRequest,
  UserSearchCondition,
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
  avatarUrl: raw.avatar_url || null,
  passwordHash: "",
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

const toApiSearchCondition = (
  condition: UserSearchCondition,
): ApiUserSearchRequest["searchCondition"] => ({
  keyword: condition.keyword,
  is_active: condition.isActive,
  is_deleted: condition.isDeleted,
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
 */
export const search = async (
  data: UserSearchRequest,
): Promise<UserSearchResponse> => {
  const apiPayload: ApiUserSearchRequest = {
    searchCondition: toApiSearchCondition(data.searchCondition),
    pageInfo: data.pageInfo,
  };

  const res = await axiosClient.post(`${BASE_URL}/search`, apiPayload);
  const response = res.data;

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
