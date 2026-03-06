import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";
import type { User } from "./user.type";

export interface Customer extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  phone: string; // unique
  email: string | null;
  name: string;
  avatarUrl: string | null;
}

// Customer Profile from API (transformed to camelCase by axios interceptor)
export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  avatarUrl: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileData {
  email: string;
  name: string;
  phone: string;
  address: string;
  avatarUrl: string;
}

export interface EditProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type ProfileRequest = ProfileData;

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
