import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * Product entity - global product definition
 */
export interface Product extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  sku: string; // unique
  name: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  minPrice: number;
  maxPrice: number;
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

/**
 * Product size info for client menu
 */
export interface ProductSizeInfo {
  productFranchiseId: ID;
  size: "DEFAULT" | "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  isAvailable: boolean;
}

/**
 * Product list item for client menu
 */
export interface ProductListItem {
  productId: ID;
  categoryId: ID;
  categoryName: string;
  categoryDisplayOrder: number;
  productDisplayOrder: number;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  isHaveTopping: boolean | null;
  sizes: ProductSizeInfo[];
}

/**
 * Product list response
 */
export interface ProductListResponse {
  success: boolean;
  data: ProductListItem[];
}
