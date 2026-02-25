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
  customerFranchiseId: ID;
  orderId: ID;
  type: LoyaltyTransactionType;
  pointChange: number; // + / -
  reason: string | null;
  createdBy: ID; // Staff / Manager
}
