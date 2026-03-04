import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export interface Category extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  code: string; // unique
  name: string;
  description: string | null;
}

export interface CategoryFranchise
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  categoryId: ID;
  franchiseId: ID;
  displayOrder: number;
}

export interface CategoryList {
  category_id: ID;
  category_name: string;
  category_code: string;
  franchise_id: ID;
  franchise_name: string;
  franchise_code: string;
  display_order: number;
}

export interface CategoryListResponse {
  success: boolean;
  data: CategoryList[];
}
