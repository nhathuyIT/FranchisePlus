import type { User } from "@/types/user.type";

/**
 * User API types
 * - API layer talks to backend using snake_case DTOs
 * - App layer uses camelCase types
 */

// =============================================================================
// API DTOs (snake_case from backend)
// =============================================================================

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUserCreateRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  avatar_url?: string;
}

export interface ApiUserUpdateRequest {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface ApiUserStatusRequest {
  is_active: boolean;
}

export interface ApiUserSearchCondition {
  keyword?: string;
  is_active?: boolean;
  is_deleted?: boolean;
}

export interface ApiUserSearchRequest {
  searchCondition: ApiUserSearchCondition;
  pageInfo: PageInfo;
}

// =============================================================================
// App-facing types (camelCase)
// =============================================================================

export interface UserSearchCondition {
  keyword?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface PageInfoResponse extends PageInfo {
  totalItems: number;
  totalPages: number;
}

export interface UserSearchRequest {
  searchCondition: UserSearchCondition;
  pageInfo: PageInfo;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  avatarUrl?: string;
}

export interface UserUpdateRequest {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserStatusRequest {
  isActive: boolean;
}

// =============================================================================
// API envelopes
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pageInfo: PageInfoResponse;
  message?: string;
}

export type UserSearchApiResponse = PaginatedApiResponse<ApiUser>;

// =============================================================================
// App-facing response types
// =============================================================================

export interface UserSearchResponse {
  pageData: User[];
  pageInfo: PageInfoResponse;
}

export type UserListResponse = User[];
export type UserDetailResponse = User;
