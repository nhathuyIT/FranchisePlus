import type { Franchise } from "@/types/franchise";

/**
 * Franchise API types
 *
 * NOTE: axios.config.ts đã tự động convert snake_case ↔ camelCase
 * nên chỉ cần define camelCase types cho app layer.
 */

// =============================================================================
// Search & Pagination Types
// =============================================================================

export interface FranchiseSearchCondition {
  keyword?: string;
  openedAt?: string;
  closedAt?: string;
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

export interface FranchiseSearchRequest {
  searchCondition: FranchiseSearchCondition;
  pageInfo: PageInfo;
}

// =============================================================================
// CRUD Request Types
// =============================================================================

export interface FranchiseCreateRequest {
  code: string;
  name: string;
  hotline?: string;
  logoUrl?: string | null;
  address: string;
  openedAt?: string | null;
  closedAt?: string | null;
  lat?: number;
  lng?: number;
}

export interface FranchiseUpdateRequest {
  code?: string;
  name?: string;
  hotline?: string;
  logoUrl?: string | null;
  address?: string;
  openedAt?: string | null;
  closedAt?: string | null;
  lat?: number;
  lng?: number;
}

export interface FranchiseStatusRequest {
  isActive: boolean;
}

// =============================================================================
// Response Types
// =============================================================================

export interface FranchiseSearchResponse {
  pageData: Franchise[];
  pageInfo: PageInfoResponse;
}

export type FranchiseListResponse = Franchise[];

export interface FranchiseSelectItem {
  value: string;
  code: string;
  name: string;
}

export type FranchiseSelectResponse = FranchiseSelectItem[];

export type FranchiseDetailResponse = Franchise;

// =============================================================================
// API Response Wrappers (for httpClient compatibility)
// =============================================================================

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pageInfo: PageInfoResponse;
  message?: string;
}
