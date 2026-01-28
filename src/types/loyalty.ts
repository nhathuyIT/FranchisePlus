import type { ID, Timestamp } from "./common";

export interface LoyaltyHistory extends Timestamp {
  id: ID;
  customerId: ID;
  points: number;
  type: "earn" | "redeem";
  description?: string;
}
