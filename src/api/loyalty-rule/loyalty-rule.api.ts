import { axiosClient } from "@/api/axios.config";
import { httpClient } from "@/api/httpClient.api";
import type {
  LoyaltyRule,
  LoyaltyTierCode,
  LoyaltyTierRule,
} from "@/types/loyalty-rule";

const BASE_URL = "/api/loyalty-rules";

interface ApiLoyaltyTierBenefit {
  orderDiscountPercent: number;
  earnMultiplier: number;
  freeShipping: boolean;
}

interface ApiLoyaltyTierRule {
  tier: LoyaltyTierCode;
  minPoints: number;
  maxPoints?: number;
  benefit: ApiLoyaltyTierBenefit;
}

interface ApiLoyaltyRule {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  franchiseId: string;
  franchiseName?: string;
  earnAmountPerPoint: number;
  redeemValuePerPoint: number;
  minRedeemPoints: number;
  maxRedeemPoints: number;
  tierRules: ApiLoyaltyTierRule[];
  description?: string;
}

interface ApiMutationResponse<T> {
  success: boolean;
  message?: string;
  errors?: unknown[];
  data?: T | null;
}

export interface LoyaltyRuleSearchCondition {
  franchise_id?: string;
  earn_amount_per_point?: number | "";
  redeem_value_per_point?: number | "";
  tier?: LoyaltyTierCode | "";
  is_active?: boolean | "";
  is_deleted: boolean;
}

export interface LoyaltyRulePageInfo {
  pageNum: number;
  pageSize: number;
}

export interface LoyaltyRulePageInfoResponse extends LoyaltyRulePageInfo {
  totalItems: number;
  totalPages: number;
}

export interface LoyaltyRuleSearchRequest {
  searchCondition: LoyaltyRuleSearchCondition;
  pageInfo: LoyaltyRulePageInfo;
}

export interface LoyaltyRuleSearchResponse {
  data: LoyaltyRule[];
  pageInfo: LoyaltyRulePageInfoResponse;
}

export interface CreateLoyaltyRuleRequest {
  franchise_id: string;
  earn_amount_per_point: number;
  redeem_value_per_point: number;
  min_redeem_points: number;
  max_redeem_points: number;
  tier_rules: LoyaltyTierRule[];
  description?: string;
  is_active?: boolean;
}

export interface UpdateLoyaltyRuleRequest {
  earn_amount_per_point?: number;
  redeem_value_per_point?: number;
  min_redeem_points?: number;
  max_redeem_points?: number;
  tier_rules?: LoyaltyTierRule[];
  description?: string;
  is_active?: boolean;
}

const defaultPageInfo: LoyaltyRulePageInfoResponse = {
  pageNum: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

const mapApiTierRules = (
  tierRules: ApiLoyaltyTierRule[],
): LoyaltyTierRule[] => {
  return tierRules.map((tier) => ({
    tier: tier.tier,
    minPoints: tier.minPoints,
    maxPoints: tier.maxPoints,
    benefit: {
      orderDiscountPercent: tier.benefit.orderDiscountPercent,
      earnMultiplier: tier.benefit.earnMultiplier,
      freeShipping: tier.benefit.freeShipping,
    },
  }));
};

const mapApiLoyaltyRule = (item: ApiLoyaltyRule): LoyaltyRule => {
  return {
    id: item.id as unknown as number,
    isActive: item.isActive,
    isDeleted: item.isDeleted,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    franchiseId: item.franchiseId as unknown as number,
    franchiseName: item.franchiseName || "",
    earnAmountPerPoint: item.earnAmountPerPoint,
    redeemValuePerPoint: item.redeemValuePerPoint,
    minRedeemPoints: item.minRedeemPoints,
    maxRedeemPoints: item.maxRedeemPoints,
    tierRules: mapApiTierRules(item.tierRules || []),
    description: item.description || "",
  };
};

const resolveMessage = (message?: string, fallback = "Request failed") => {
  return message?.trim() ? message : fallback;
};

const assertSuccess = <T>(
  response: ApiMutationResponse<T>,
  fallbackMessage: string,
): T => {
  if (!response.success || !response.data) {
    throw new Error(resolveMessage(response.message, fallbackMessage));
  }

  return response.data;
};

export const searchLoyaltyRules = async (
  payload: LoyaltyRuleSearchRequest,
): Promise<LoyaltyRuleSearchResponse> => {
  const response = await httpClient.postPaginatedRaw<
    ApiLoyaltyRule,
    LoyaltyRuleSearchRequest
  >({
    url: `${BASE_URL}/search`,
    data: payload,
  });

  if (!response?.success) {
    throw new Error("Failed to search loyalty rules");
  }

  return {
    data: (response.data || []).map(mapApiLoyaltyRule),
    pageInfo: response.pageInfo || defaultPageInfo,
  };
};

export const createLoyaltyRule = async (
  data: CreateLoyaltyRuleRequest,
): Promise<LoyaltyRule> => {
  const response = await axiosClient.post<ApiMutationResponse<ApiLoyaltyRule>>(
    BASE_URL,
    data,
  );

  const raw = assertSuccess(response.data, "Failed to create loyalty rule");
  return mapApiLoyaltyRule(raw);
};

export const getLoyaltyRule = async (
  id: number | string,
): Promise<LoyaltyRule> => {
  const response = await axiosClient.get<ApiMutationResponse<ApiLoyaltyRule>>(
    `${BASE_URL}/${String(id)}`,
  );

  const raw = assertSuccess(response.data, "Loyalty rule not found");
  return mapApiLoyaltyRule(raw);
};

export const updateLoyaltyRule = async (
  id: number | string,
  data: UpdateLoyaltyRuleRequest,
): Promise<LoyaltyRule> => {
  const response = await axiosClient.put<ApiMutationResponse<ApiLoyaltyRule>>(
    `${BASE_URL}/${String(id)}`,
    data,
  );

  const raw = assertSuccess(response.data, "Failed to update loyalty rule");
  return mapApiLoyaltyRule(raw);
};
