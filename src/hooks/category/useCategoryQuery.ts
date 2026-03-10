import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as categoryApi from "@/api/category/category.api";
import type {
  CategorySearchRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api/category/category.api";

// ── Query Keys ──────────────────────────────────────────────────────────────

const CATEGORY_KEYS = {
  all: ["categories"] as const,
  search: (params: CategorySearchRequest) => ["categories", params] as const,
  detail: (id: number | string) => ["categories", id] as const,
  select: () => ["categories", "select"] as const,
};

// ── Queries ─────────────────────────────────────────────────────────────────

export const useCategoriesQuery = (searchParams: CategorySearchRequest) => {
  return useQuery({
    queryKey: CATEGORY_KEYS.search(searchParams),
    queryFn: async () => {
      console.log("[Category API] Searching categories...", searchParams);
      const result = await categoryApi.searchCategories(searchParams);
      console.log("[Category API] Search response:", result);
      return result;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCategoryDetailQuery = (id: number | string, enabled = true) => {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled,
  });
};

export const useCategorySelectItemsQuery = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.select(),
    queryFn: () => categoryApi.getCategorySelectItems(),
    staleTime: 5 * 60 * 1000, // 5 minutes - select items don't change often
  });
};

// ── Mutations ───────────────────────────────────────────────────────────────

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create category", {
        description: error.message,
      });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateCategoryRequest;
    }) => categoryApi.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      console.log("[Category API] Update success:", updatedCategory);
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update category", {
        description: error.message,
      });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete category", {
        description: error.message,
      });
    },
  });
};

export const useUpdateCategoryStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number | string; isActive: boolean }) =>
      categoryApi.updateCategory(id, { is_active: isActive } as UpdateCategoryRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category status updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update category status", {
        description: error.message,
      });
    },
  });
};

export const useRestoreCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => categoryApi.restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category restored successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to restore category", {
        description: error.message,
      });
    },
  });
};
