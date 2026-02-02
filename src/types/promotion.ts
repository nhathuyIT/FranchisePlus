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
  franchise_id: ID; // Promotion theo store
  product_franchise_id: ID | null; // NULL = áp dụng toàn store
  type: PromotionType;
  value: number; // decimal - % or money
  start_time: string; // timestamp
  end_time: string; // timestamp
  created_by: ID; // Admin / Manager
}
