import type { UserFranchiseRole } from "@/types/user.type";

/**
 * UserFranchiseRole API types
 *
 * NOTE: axios.config.ts auto-converts snake_case ↔ camelCase
 * so we define camelCase types for the app layer.
 */

// =============================================================================
// Search & Pagination Types
// =============================================================================

export interface UserFranchiseRoleSearchCondition {
  keyword?: string;
  userId?: string;
  franchiseId?: string;
  roleId?: string; // MongoDB ObjectId
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

export interface UserFranchiseRoleSearchRequest {
  searchCondition: UserFranchiseRoleSearchCondition;
  pageInfo: PageInfo;
}

// =============================================================================
// API Response item (enriched with related entity names)
// =============================================================================

export interface UserFranchiseRoleItem {
  id: number;
  userId: string;
  franchiseId: string | null;
  roleId: string; // MongoDB ObjectId
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Populated fields from backend joins
  userName?: string | null;
  userEmail?: string | null;
  franchiseName?: string | null;
  roleName?: string | null;
  roleCode?: string | null;
}

// =============================================================================
// CRUD Request Types
// =============================================================================

export interface UserFranchiseRoleCreateRequest {
  userId: string;
  franchiseId: string | null;
  roleId: string; // MongoDB ObjectId
}

export interface UserFranchiseRoleUpdateRequest {
  userId?: string;
  franchiseId?: string | null;
  roleId?: string; // MongoDB ObjectId
}

// =============================================================================
// Response Types
// =============================================================================

export interface UserFranchiseRoleSearchResponse {
  pageData: UserFranchiseRoleItem[];
  pageInfo: PageInfoResponse;
}

export type UserFranchiseRoleListResponse = UserFranchiseRole[];

export type UserFranchiseRoleDetailResponse = UserFranchiseRoleItem;
