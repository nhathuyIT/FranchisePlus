import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export type ProductSizeCode =
  | "DEFAULT"
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "S"
  | "M"
  | "L";

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
  isHaveTopping?: boolean | null;
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
  size?: string;
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
  size: ProductSizeCode;
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

/**
 * Product detail size info (client detail endpoint)
 */
export interface ProductDetailSizeInfo {
  productFranchiseId: ID;
  size: ProductSizeCode;
  price: number;
  isAvailable: boolean;
}

/**
 * Product detail item (client detail endpoint)
 */
export interface ProductDetailItem {
  productId: ID;
  categoryId: ID;
  categoryName: string;
  sku: string;
  name: string;
  description: string;
  content: string;
  imageUrl: string;
  imagesUrl: string[];
  isHaveTopping: boolean | null;
  sizes: ProductDetailSizeInfo[];
}

/**
 * Product detail response (client detail endpoint)
 */
export interface ProductDetailResponse {
  success: boolean;
  data: ProductDetailItem;
}


