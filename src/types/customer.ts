import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export interface Customer extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  phone: string; // unique
  email: string | null;
  name: string;
  avatarUrl: string | null;
}

// Customer Profile from API (snake_case)
export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  avatar_url: string;
  is_active: boolean;
  is_deleted: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Customer Login Response is directly the profile
export type CustomerLoginResponse = CustomerProfile;

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
