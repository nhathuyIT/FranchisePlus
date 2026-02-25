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
  franchiseId: ID; // Promotion theo store
  productFranchiseId: ID | null; // NULL = áp dụng toàn store
  type: PromotionType;
  value: number; // decimal - % or money
  startTime: string; // timestamp
  endTime: string; // timestamp
  createdBy: ID; // Admin / Manager
}
