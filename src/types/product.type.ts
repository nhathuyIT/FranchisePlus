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
  product_franchise_id: ID;
  size: "DEFAULT" | "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  is_available: boolean;
}

/**
 * Product list item for client menu
 */
export interface ProductListItem {
  product_id: ID;
  category_id: ID;
  category_name: string;
  category_display_order: number;
  product_display_order: number;
  SKU: string;
  name: string;
  description: string;
  image_url: string;
  is_have_topping: boolean | null;
  sizes: ProductSizeInfo[];
}

/**
 * Product list response
 */
export interface ProductListResponse {
  success: boolean;
  data: ProductListItem[];
}
