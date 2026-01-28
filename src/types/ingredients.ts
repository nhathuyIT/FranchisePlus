import type { ID, Timestamp } from "./common";

export interface Ingredient extends Timestamp {
  id: ID;
  name: string;
  quantity: number;
  unit: string;
}
