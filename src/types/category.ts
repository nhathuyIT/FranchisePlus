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
  category_id: ID;
  franchise_id: ID;
  display_order: number;
}
