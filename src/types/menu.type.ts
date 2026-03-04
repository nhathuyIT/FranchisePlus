import type { ID } from "./common";

export interface ProductSize {
  product_franchise_id: ID;
  size: "DEFAULT" | "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  is_available: boolean;
}

export interface MenuProduct {
  product_id: ID;
  name: string;
  description: string;
  image_url: string;
  is_have_topping: boolean | null;
  sizes: ProductSize[];
}

export interface MenuCategory {
  category_id: ID;
  category_name: string;
  category_display_order: number;
  products: MenuProduct[];
}

export interface MenuResponse {
  success: boolean;
  data: MenuCategory[];
}
