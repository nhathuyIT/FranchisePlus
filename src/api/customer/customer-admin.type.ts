import type { CustomerProfile } from "@/types/customer";

/**
 * Customer Admin API types
 *
 * NOTE: axios.config.ts auto-converts snake_case ↔ camelCase
 * so we define camelCase types for the app layer.
 */

// =============================================================================
// Search & Pagination Types
// =============================================================================

export interface CustomerSearchCondition {
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

export interface CustomerSearchRequest {
  searchCondition: CustomerSearchCondition;
  pageInfo: PageInfo;
}

export interface CustomerSearchResponse {
  pageData: CustomerProfile[];
  pageInfo: PageInfoResponse;
}

export interface CustomerKeywordLookupItem {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string | null;
}

export interface CustomerKeywordLookupApiItem {
  value: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  image: string | null;
}

// =============================================================================
// CRUD Request Types
// =============================================================================

export interface CustomerUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface CustomerStatusRequest {
  isActive: boolean;
}

// =============================================================================
// Response Types
// =============================================================================

export type CustomerListResponse = CustomerProfile[];
export type CustomerDetailResponse = CustomerProfile;
