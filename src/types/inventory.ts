import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";
import type { Product, ProductFranchise } from "./product.type";

/**
 * Inventory entity - tracks product stock at franchise level
 * UNIQUE (product_franchise_id, franchise_id)
 */
export interface Inventory extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  productFranchiseId: ID;
  quantity: number; 
  alertThreshold: number; 
}

/**
 * View model for displaying inventory with related product and franchise info
 * Used in UI components to avoid multiple lookups
 */
export interface InventoryItemView {
  inventory: Inventory;
  product: Pick<Product, "id" | "name" | "sku" | "description">; 
  productFranchise: ProductFranchise; 
  franchiseName: string; 
  franchiseCode: string;
}

/**
 * Inventory status helper type
 */
export type InventoryStatus = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";

/**
 * Helper function to determine inventory status
 */
export function getInventoryStatus(inventory: Inventory): InventoryStatus {
  if (inventory.quantity === 0 || !inventory.isActive) {
    return "OUT_OF_STOCK";
  }
  if (inventory.quantity <= inventory.alertThreshold) {
    return "LOW_STOCK";
  }
  return "AVAILABLE";
}
