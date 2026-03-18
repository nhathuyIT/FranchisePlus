import type { Activatable, BaseTimestamp, ID, SoftDeletable } from "./common";

export type LoyaltyTierCode = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface LoyaltyTierBenefit {
  orderDiscountPercent: number;
  earnMultiplier: number;
  freeShipping: boolean;
}

export interface LoyaltyTierRule {
  tier: LoyaltyTierCode;
  minPoints: number;
  maxPoints?: number;
  benefit: LoyaltyTierBenefit;
}

export interface LoyaltyRule extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  franchiseId: ID;
  franchiseName: string;
  earnAmountPerPoint: number;
  redeemValuePerPoint: number;
  minRedeemPoints: number;
  maxRedeemPoints: number;
  tierRules: LoyaltyTierRule[];
  description: string;
}
