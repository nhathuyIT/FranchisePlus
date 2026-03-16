import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as promotionApi from "@/api/promotion/promotion.api";
import type {
  CreatePromotionRequest,
  PromotionSearchResponse,
  PromotionSearchRequest,
  UpdatePromotionRequest,
} from "@/api/promotion/promotion.api";

const PROMOTION_KEYS = {
  all: ["promotions"] as const,
  search: (params: PromotionSearchRequest) => ["promotions", params] as const,
  detail: (id: number | string) => ["promotions", id] as const,
};

export const usePromotionsQuery = (
  searchParams: PromotionSearchRequest,
): ReturnType<typeof useQuery<PromotionSearchResponse>> => {
  return useQuery({
    queryKey: PROMOTION_KEYS.search(searchParams),
    queryFn: () => promotionApi.searchPromotions(searchParams),
    placeholderData: keepPreviousData,
  });
};

export const usePromotionDetailQuery = (
  id: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: PROMOTION_KEYS.detail(id),
    queryFn: () => promotionApi.getPromotion(id),
    enabled,
  });
};

export const useCreatePromotionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromotionRequest) =>
      promotionApi.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.all });
      toast.success("Promotion created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create promotion", {
        description: error.message,
      });
    },
  });
};

export const useUpdatePromotionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdatePromotionRequest;
    }) => promotionApi.updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.all });
      toast.success("Promotion updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update promotion", {
        description: error.message,
      });
    },
  });
};

export const useDeletePromotionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => promotionApi.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.all });
      toast.success("Promotion deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete promotion", {
        description: error.message,
      });
    },
  });
};

export const useRestorePromotionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => promotionApi.restorePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.all });
      toast.success("Promotion restored successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to restore promotion", {
        description: error.message,
      });
    },
  });
};
