import type { ID, Timestamp } from "./common";

/**
 * Inventory entity - tracks stock levels per product per franchise
 * Based on ERD with UNIQUE constraint (product_franchise_id, franchise_id)
 */
export interface Inventory extends Timestamp {
  id: ID;
  product_franchise_id: ID;
  quantity: number; // Stock quantity (decimal in DB)
  alert_threshold: number; // Low stock warning level (decimal in DB)
  is_active: boolean; // AVAILABLE (true) / OUT_OF_STOCK (false)
  is_deleted: boolean;
}

/**
 * ProductFranchise junction table - links products to franchises with pricing
 * Note: Simplified for Inventory module. Full definition owned by Product team.
 */
export interface ProductFranchise extends Timestamp {
  id: ID;
  franchise_id: ID;
  product_id: ID;
  price_base: number;
  is_active: boolean;
  is_deleted: boolean;
}

/**
 * InventoryItemView - denormalized view model for UI rendering
 * Combines inventory, product, franchise data for display
 */
export interface InventoryItemView {
  inventory: Inventory;
  product: {
    id: ID;
    name: string;
    SKU: string;
    description?: string;
  };
  productFranchise: ProductFranchise;
  franchiseName: string;
  franchiseCode: string;
}
