import type { Franchise } from "@/types/franchise";

/**
 * Franchise API types
 * - API layer talks to backend using snake_case DTOs
 * - App layer uses camelCase types
 */

// =============================================================================
// API DTOs (snake_case from backend)
// =============================================================================

export interface ApiFranchise {
  id: string;
  code: string;
  name: string;
  hotline?: string | null;
  logo_url: string | null;
  address: string;
  opened_at: string | null;
  closed_at: string | null;
  lat?: number;
  lng?: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiFranchiseSelect {
  value: string;
  code: string;
  name: string;
}

export interface ApiFranchiseSearchCondition {
  keyword?: string;
  opened_at?: string;
  closed_at?: string;
  is_active?: boolean;
  is_deleted?: boolean;
}

export interface ApiFranchiseSearchRequest {
  searchCondition: ApiFranchiseSearchCondition;
  pageInfo: PageInfo;
}

export interface ApiFranchiseCreateRequest {
  code: string;
  name: string;
  hotline?: string;
  logo_url?: string | null;
  address: string;
  opened_at?: string | null;
  closed_at?: string | null;
  lat?: number;
  lng?: number;
}

export interface ApiFranchiseUpdateRequest {
  code?: string;
  name?: string;
  hotline?: string;
  logo_url?: string | null;
  address?: string;
  opened_at?: string | null;
  closed_at?: string | null;
  lat?: number;
  lng?: number;
}

export interface ApiFranchiseStatusRequest {
  is_active: boolean;
}

// =============================================================================
// App-facing types (camelCase)
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

export type FranchiseSearchApiResponse = PaginatedApiResponse<ApiFranchise>;

// =============================================================================
// App-facing response types
// =============================================================================

export interface FranchiseSearchResponse {
  pageData: Franchise[];
  pageInfo: PageInfoResponse;
}

export type FranchiseListResponse = Franchise[];
export type FranchiseSelectResponse = ApiFranchiseSelect[];
export type FranchiseDetailResponse = Franchise;
