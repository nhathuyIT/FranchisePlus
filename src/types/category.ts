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
  categoryId: ID;
  categoryName: string;
  categoryCode: string;
  franchiseId: ID;
  franchiseName: string;
  franchiseCode: string;
  displayOrder: number;
}

export interface CategoryListResponse {
  success: boolean;
  data: CategoryList[];
}
