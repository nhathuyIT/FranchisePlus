import type { BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * Product entity - global product definition
 * Mapped from API snake_case to camelCase
 */
export interface Product extends BaseTimestamp, SoftDeletable, Activatable {
  id: string;
  sku: string; // unique
  name: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  imagesUrl: string[];
  minPrice: number;
  maxPrice: number;
  isHaveTopping: boolean;
}

/**
 * ProductFranchise - junction table linking products to franchises with pricing
 * UNIQUE (productId, franchiseId)
 */
export interface ProductFranchise
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  franchiseId: ID;
  productId: ID;
  priceBase: number; // product.minPrice ≤ priceBase ≤ product.maxPrice
}

/**
 * ProductCategoryFranchise - links products to categories at franchise level
 * UNIQUE (categoryFranchiseId, productFranchiseId)
 */
export interface ProductCategoryFranchise
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  categoryFranchiseId: ID;
  productFranchiseId: ID;
  displayOrder: number;
}
