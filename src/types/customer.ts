import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export interface Customer extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  phone: string; // unique
  email: string | null;
  name: string;
  avatarUrl: string | null;
}

export interface CustomerFranchise
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  customerId: ID;
  franchiseId: ID;
  loyaltyPoint: number; // default 0
  loyaltyTier: "Silver" | "Gold" | "Platinum" | null;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
}
