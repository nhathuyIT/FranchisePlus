import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * Promotion type - PERCENT or FIXED amount
 */
export type PromotionType = "PERCENT" | "FIXED";

/**
 * Promotion entity - discounts and promotions per franchise
 */
export interface Promotion extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  name: string;
  franchiseId: ID; // Promotion theo store
  franchiseName: string; // Tên franchise
  productFranchiseId: ID | null; // NULL = áp dụng toàn store
  productId: ID | null; // ID của product
  productName: string; // Tên product
  type: PromotionType;
  value: number; // decimal - % or money
  startTime: string; // timestamp
  endTime: string; // timestamp
  createdBy: ID; // Admin / Manager
}
