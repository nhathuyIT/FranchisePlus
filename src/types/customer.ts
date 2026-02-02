import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export interface Customer extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  phone: string; // unique
  email: string | null;
  name: string;
  avatar_url: string | null;
}

export interface CustomerFranchise
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  customer_id: ID;
  franchise_id: ID;
  loyalty_point: number; // default 0
  loyalty_tier: "Silver" | "Gold" | "Platinum" | null;
  first_order_at: string | null;
  last_order_at: string | null;
}
