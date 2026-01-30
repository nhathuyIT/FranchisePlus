import type { ID, Timestamp } from "./common";

/**
 * Inventory entity based on ERD
 * Represents stock levels for a product at a franchise
 * UNIQUE (product_franchise_id, franchise_id)
 */
export interface Inventory extends Timestamp {
  id: ID;
  product_franchise_id: ID;
  quantity: number; // decimal in DB
  alert_threshold: number; // decimal in DB - lowStockThreshold
  is_active: boolean; // true = AVAILABLE, false = OUT_OF_STOCK
  is_deleted: boolean;
}

/**
 * ProductFranchise type for inventory view
 * Note: This is a simplified version for Inventory module only
 * The full ProductFranchise should be defined by Product Management team
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
 * View model for UI - combines Inventory with related data
 * This is specifically for Franchise & Inventory Management modules
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
