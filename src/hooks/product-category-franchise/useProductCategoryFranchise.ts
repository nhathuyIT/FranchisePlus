import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/api/product-category-franchise/product-category-franchise.api";
import type {
  AddProductToCategoryFranchiseRequest,
  ProductCategoryFranchiseSearchRequest,
} from "@/api/product-category-franchise/product-category-franchise.api";

// ── Query Keys ───────────────────────────────────────────────────────────────

export const PRODUCT_CATEGORY_FRANCHISE_KEYS = {
  all: ["product-category-franchises"] as const,
  search: (params: ProductCategoryFranchiseSearchRequest) =>
    ["product-category-franchises", "search", params] as const,
  byFranchise: (franchiseId: string) =>
    ["product-category-franchises", "franchise", franchiseId] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export const useProductCategoryFranchisesQuery = (
  params: ProductCategoryFranchiseSearchRequest,
  enabled = true,
) => {
  return useQuery({
    queryKey: PRODUCT_CATEGORY_FRANCHISE_KEYS.search(params),
    queryFn: () => api.searchProductCategoryFranchises(params),
    enabled,
  });
};

export const useProductsByFranchiseWithCategories = (
  franchiseId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: PRODUCT_CATEGORY_FRANCHISE_KEYS.byFranchise(franchiseId),
    queryFn: () => api.getProductsByFranchise(franchiseId),
    enabled,
  });
};

// ── Mutations ────────────────────────────────────────────────────────────────

export const useAddProductToCategoryFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddProductToCategoryFranchiseRequest) =>
      api.addProductToCategoryFranchise(data),
    onSuccess: (data) => {
      console.log("[ProductCategoryFranchise] Product assigned to category:", data);
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_FRANCHISE_KEYS.all,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to assign product to category", {
        description: error.message,
      });
    },
  });
};

export const useDeleteProductCategoryFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteProductCategoryFranchise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_CATEGORY_FRANCHISE_KEYS.all,
      });
      toast.success("Product removed from category");
    },
    onError: (error: Error) => {
      toast.error("Failed to remove product", { description: error.message });
    },
  });
};
