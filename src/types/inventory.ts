import type { ID, Timestamp } from "./common";

export interface InventoryItem extends Timestamp {
  id: ID;
  franchiseId: ID;
  productId: ID;
  quantity: number;
  lowStockThreshold: number; // cảnh báo
}
