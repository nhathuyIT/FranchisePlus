import type { ID, Timestamp } from "./common";

export interface Category extends Timestamp {
  id: ID;
  name: string;
  description?: string;
  status: "active" | "inactive";
}
