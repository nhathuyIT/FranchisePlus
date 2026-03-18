import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as loyaltyRuleApi from "@/api/loyalty-rule/loyalty-rule.api";
import type {
  CreateLoyaltyRuleRequest,
  LoyaltyRuleSearchRequest,
  LoyaltyRuleSearchResponse,
  UpdateLoyaltyRuleRequest,
} from "@/api/loyalty-rule/loyalty-rule.api";

const LOYALTY_RULE_KEYS = {
  all: ["loyalty-rules"] as const,
  search: (params: LoyaltyRuleSearchRequest, requestKey: number) =>
    ["loyalty-rules", params, requestKey] as const,
  detail: (id: number | string) => ["loyalty-rules", id] as const,
};

export const useLoyaltyRulesQuery = (
  searchParams: LoyaltyRuleSearchRequest,
  requestKey: number,
): ReturnType<typeof useQuery<LoyaltyRuleSearchResponse>> => {
  return useQuery({
    queryKey: LOYALTY_RULE_KEYS.search(searchParams, requestKey),
    queryFn: () => loyaltyRuleApi.searchLoyaltyRules(searchParams),
    placeholderData: keepPreviousData,
  });
};

export const useLoyaltyRuleDetailQuery = (
  id: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: LOYALTY_RULE_KEYS.detail(id),
    queryFn: () => loyaltyRuleApi.getLoyaltyRule(id),
    enabled,
  });
};

export const useCreateLoyaltyRuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLoyaltyRuleRequest) =>
      loyaltyRuleApi.createLoyaltyRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOYALTY_RULE_KEYS.all });
      toast.success("Loyalty rule created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create loyalty rule", {
        description: error.message,
      });
    },
  });
};

export const useUpdateLoyaltyRuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateLoyaltyRuleRequest;
    }) => loyaltyRuleApi.updateLoyaltyRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOYALTY_RULE_KEYS.all });
      toast.success("Loyalty rule updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update loyalty rule", {
        description: error.message,
      });
    },
  });
};
