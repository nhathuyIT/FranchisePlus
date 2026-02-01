import type { ID, Timestamp } from "./common";

export interface Product extends Timestamp {
  id: ID;
  categoryId: ID;
  name: string;
  description?: string;
  price: number;
  images: string[];
  status: "active" | "inactive" | "out_of_stock";
}
