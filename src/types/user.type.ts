import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * User entity - internal users (admin, manager, staff)
 */
export interface User extends BaseTimestamp, SoftDeletable, Activatable {
  id: string; // MongoDB ObjectId
  email: string; // unique
  passwordHash: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  address?: string | null;
}

/**
 * Role entity - defines user roles
 */
export interface Role extends BaseTimestamp, SoftDeletable {
  id: ID;
  code: string; // unique
  name: string;
  description: string | null;
  scope: "GLOBAL" | "FRANCHISE";
}

/**
 * UserFranchiseRole - junction table for user-franchise-role assignment
 * UNIQUE (user_id, franchise_id, role_id)
 */
export interface UserFranchiseRole extends BaseTimestamp, SoftDeletable {
  id: ID;
  franchiseId: string | null; // MongoDB ObjectId string, null if role is GLOBAL
  roleId: ID;
  userId: string; // MongoDB ObjectId string
  franchiseName?: string | null; // optional franchise name from API
}

// ── User Search API Types ────────────────────────────────────────────────────

/** User item from /api/users/search (snake_case from API) */
export interface UserSearchItem {
  id: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  email: string;
  name: string;
  phone: string;
  avatar_url: string;
  is_verified: boolean;
}

export interface UserSearchCondition {
  keyword: string;
  is_active: boolean | string;
  is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

/** POST /api/users/search - Request body */
export interface UserSearchRequest {
  searchCondition: UserSearchCondition;
  pageInfo: PageInfo;
}

// ── User Create API Types ────────────────────────────────────────────────────

/** POST /api/users - Create user request body */
export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
}
