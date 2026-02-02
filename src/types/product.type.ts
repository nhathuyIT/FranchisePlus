import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * Product entity - global product definition
 */
export interface Product extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  SKU: string; // unique
  name: string;
  description: string | null;
  content: string | null;
  min_price: number;
  max_price: number;
}

/**
 * ProductFranchise - junction table linking products to franchises with pricing
 * UNIQUE (product_id, franchise_id)
 */
export interface ProductFranchise
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  franchise_id: ID;
  product_id: ID;
  price_base: number; // product.min_price ≤ price_base ≤ product.max_price
}

/**
 * ProductCategoryFranchise - links products to categories at franchise level
 * UNIQUE (category_franchise_id, product_franchise_id)
 */
export interface ProductCategoryFranchise
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  category_franchise_id: ID;
  product_franchise_id: ID;
  display_order: number;
}
