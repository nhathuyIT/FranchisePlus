import type { ID, BaseTimestamp, SoftDeletable } from "./common";

/**
 * Loyalty transaction type
 */
export type LoyaltyTransactionType = "EARN" | "REDEEM" | "ADJUST";

/**
 * LoyaltyTransaction - tracks loyalty point changes
 */
export interface LoyaltyTransaction extends BaseTimestamp, SoftDeletable {
  id: ID;
  customer_franchise_id: ID;
  order_id: ID;
  type: LoyaltyTransactionType;
  point_change: number; // + / -
  reason: string | null;
  created_by: ID; // Staff / Manager
}
