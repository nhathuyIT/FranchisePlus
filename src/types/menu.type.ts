import type { ID } from "./common";

export interface ProductSize {
  productFranchiseId: ID;
  size: "DEFAULT" | "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  isAvailable: boolean;
}

export interface MenuProduct {
  productId: ID;
  name: string;
  description: string;
  imageUrl: string;
  isHaveTopping: boolean | null;
  sizes: ProductSize[];
}

export interface MenuCategory {
  categoryId: ID;
  categoryName: string;
  categoryDisplayOrder: number;
  products: MenuProduct[];
}

export interface MenuResponse {
  success: boolean;
  data: MenuCategory[];
}
