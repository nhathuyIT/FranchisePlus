import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as categoryFranchiseApi from "@/api/category-franchise/CategoryFranchise.api";
import type {
  CategoryFranchiseRequest,
  SearchCategoryFranchiseRequest,
  ChangeStatusCategoryFranchiseRequest,
} from "@/types/categoryFranchise.type";

// ── Query Keys ──────────────────────────────────────────────────────────────

const CATEGORY_FRANCHISE_KEYS = {
  all: ["category-franchises"] as const,
  search: (params: SearchCategoryFranchiseRequest) =>
    ["category-franchises", "search", params] as const,
  detail: (id: string) => ["category-franchises", "detail", id] as const,
  byFranchise: (franchiseId: string) =>
    ["category-franchises", "franchise", franchiseId] as const,
};

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Search category franchises with conditions and pagination
 */
export const useCategoryFranchiseSearchQuery = (
  searchParams: SearchCategoryFranchiseRequest,
) => {
  return useQuery({
    queryKey: CATEGORY_FRANCHISE_KEYS.search(searchParams),
    queryFn: async () => {
      console.log(
        "[CategoryFranchise API] Searching category franchises...",
        searchParams,
      );
      const result =
        await categoryFranchiseApi.searchItemsByConditions(searchParams);
      console.log("[CategoryFranchise API] Search response:", result);
      return result;
    },
    placeholderData: keepPreviousData,
  });
};

/**
 * Get category franchise detail by ID
 */
export const useCategoryFranchiseDetailQuery = (
  categoryFranchiseId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: CATEGORY_FRANCHISE_KEYS.detail(categoryFranchiseId),
    queryFn: () => categoryFranchiseApi.getItem(categoryFranchiseId),
    enabled: !!categoryFranchiseId && enabled,
  });
};

/**
 * Get categories by franchise ID (only active)
 */
export const useCategoryByFranchiseIdQuery = (
  franchiseId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: CATEGORY_FRANCHISE_KEYS.byFranchise(franchiseId),
    queryFn: () => categoryFranchiseApi.getCategoryByFranchiseId(franchiseId),
    enabled: !!franchiseId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ── Mutations ───────────────────────────────────────────────────────────────

/**
 * Add category to franchise
 */
export const useAddCategoryToFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryFranchiseRequest) =>
      categoryFranchiseApi.addCategoryToFranchise(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_FRANCHISE_KEYS.all,
      });
      toast.success("Category added to franchise successfully!", {
        description: `Category has been added to the franchise`,
      });
      console.log("[CategoryFranchise API] Add success:", response);
    },
    onError: (error: Error) => {
      toast.error("Failed to add category to franchise", {
        description: error.message,
      });
      console.error("[CategoryFranchise API] Add error:", error);
    },
  });
};

/**
 * Change category franchise status
 */
export const useChangeCategoryFranchiseStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryFranchiseId,
      data,
    }: {
      categoryFranchiseId: string;
      data: ChangeStatusCategoryFranchiseRequest;
    }) => categoryFranchiseApi.changeStatusItem(categoryFranchiseId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_FRANCHISE_KEYS.all,
      });
      const status = variables.data.isActive ? "activated" : "deactivated";
      toast.success(`Category franchise ${status} successfully!`, {
        description: `The category franchise has been ${status}`,
      });
      console.log("[CategoryFranchise API] Status change success:", response);
    },
    onError: (error: Error) => {
      toast.error("Failed to change category franchise status", {
        description: error.message,
      });
      console.error("[CategoryFranchise API] Status change error:", error);
    },
  });
};

/**
 * Delete category franchise
 */
export const useDeleteCategoryFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryFranchiseId: string) =>
      categoryFranchiseApi.deleteItemByCategoryFranchiseId(categoryFranchiseId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_FRANCHISE_KEYS.all,
      });
      toast.success("Category franchise deleted successfully!", {
        description: "The category franchise has been removed",
      });
      console.log("[CategoryFranchise API] Delete success:", response);
    },
    onError: (error: Error) => {
      toast.error("Failed to delete category franchise", {
        description: error.message,
      });
      console.error("[CategoryFranchise API] Delete error:", error);
    },
  });
};

/**
 * Restore category franchise
 */
export const useRestoreCategoryFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryFranchiseId: string) =>
      categoryFranchiseApi.restoreItemByCategoryFranchiseId(
        categoryFranchiseId,
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_FRANCHISE_KEYS.all,
      });
      toast.success("Category franchise restored successfully!", {
        description: "The category franchise has been restored",
      });
      console.log("[CategoryFranchise API] Restore success:", response);
    },
    onError: (error: Error) => {
      toast.error("Failed to restore category franchise", {
        description: error.message,
      });
      console.error("[CategoryFranchise API] Restore error:", error);
    },
  });
};
