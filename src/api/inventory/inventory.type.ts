import type { Inventory } from "@/types/inventory";

/**
 * Inventory API types
 *
 * NOTE: axios.config.ts auto-converts snake_case <-> camelCase
 * so only camelCase types are needed for app layer.
 *
 * Based on: OJT_2026_FRANCHISE_API_Mapping.pdf (INVENTORY-01 to INVENTORY-08)
 */

// =============================================================================
// Search & Pagination Types
// =============================================================================

export interface InventorySearchCondition {
  /** INVENTORY-02: product_franchise_id (string) */
  productFranchiseId?: string;
  /** INVENTORY-02: franchise_id (string) */
  franchiseId?: string;
  /** INVENTORY-02: product_id (string) */
  productId?: string;
  /** INVENTORY-02: quantity (string | number) */
  quantity?: string | number;
  /** INVENTORY-02: is_active (string | boolean, default "") */
  isActive?: boolean | string;
  /** INVENTORY-02: is_deleted (string | boolean, default false) */
  isDeleted?: boolean | string;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface PageInfoResponse extends PageInfo {
  totalItems: number;
  totalPages: number;
}

export interface InventorySearchRequest {
  searchCondition: InventorySearchCondition;
  pageInfo: PageInfo;
}

// =============================================================================
// Enriched inventory item from search API (INVENTORY-02 response)
// =============================================================================

/**
 * Search response item — backend returns enriched data with product_name, franchise_name
 * Fields from PDF response: id, is_active, is_deleted, created_at, updated_at,
 * product_franchise_id, product_id, product_name, franchise_id, franchise_name,
 * quantity, alert_threshold
 */
export interface InventorySearchItem extends Inventory {
  /** product_id from search response */
  productId: string;
  /** product_name from search response */
  productName: string;
  /** franchise_id from search response */
  franchiseId: string;
  /** franchise_name from search response */
  franchiseName: string;
}

// =============================================================================
// CRUD Request Types
// =============================================================================

/**
 * INVENTORY-01: Create Item
 * POST /api/inventories
 * { product_franchise_id: string, quantity: number, alert_threshold: number }
 */
export interface InventoryCreateRequest {
  productFranchiseId: string;
  quantity: number;
  alertThreshold: number;
}

/**
 * INVENTORY-06: Edit Quantity (Adjust)
 * POST /api/inventories/adjust
 * { product_franchise_id: string, change: number, alert_threshold: number, reason?: string }
 *
 * Backend auto-converts camelCase → snake_case via axios interceptor.
 */
export interface InventoryAdjustRequest {
  productFranchiseId: string;
  change: number;
  alertThreshold: number;
  reason?: string;
}

/**
 * Single item in a bulk adjust request.
 * Reuses the same fields as InventoryAdjustRequest.
 */
export interface InventoryBulkAdjustItem {
  productFranchiseId: string;
  change: number;
  alertThreshold: number;
  reason?: string;
}

/**
 * POST /api/inventories/adjust/bulk
 * Body: { items: [{ product_franchise_id, change, alert_threshold, reason }] }
 *
 * Axios interceptor auto-converts camelCase → snake_case on request.
 */
export interface InventoryBulkAdjustRequest {
  items: InventoryBulkAdjustItem[];
}

// =============================================================================
// Response Types
// =============================================================================

export interface InventorySearchResponse {
  pageData: InventorySearchItem[];
  pageInfo: PageInfoResponse;
}

export type InventoryDetailResponse = Inventory;

/**
 * INVENTORY-07: Low Stock item from GET /api/inventories/low-stock/franchise/:franchiseId
 * Includes nested product_franchise object
 */
export interface InventoryLowStockItem {
  _id: string;
  productFranchiseId: string;
  quantity: number;
  reservedQuantity: number;
  alertThreshold: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  productFranchise: {
    _id: string;
    productId: string;
    franchiseId: string;
    priceBase: number;
    size: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * INVENTORY-08: Inventory Log entry from GET /api/inventories/logs/:inventoryId
 */
export interface InventoryLogItem {
  _id: string;
  inventoryId: string;
  productFranchiseId: string;
  change: number;
  type: string;
  referenceType: string;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

// =============================================================================
// API Response Wrappers (for httpClient compatibility)
// =============================================================================

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pageInfo: PageInfoResponse;
  message?: string;
}
