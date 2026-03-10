import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as productFranchiseApi from "@/api/product-franchise/product-franchise.api";
import type {
  ProductFranchiseSearchRequest,
  CreateProductFranchiseRequest,
  UpdateProductFranchiseRequest,
  ChangeStatusRequest,
} from "@/api/product-franchise/product-franchise.api";

// ── Query Keys ──────────────────────────────────────────────────────────────

const PRODUCT_FRANCHISE_KEYS = {
  all: ["product-franchises"] as const,
  search: (params: ProductFranchiseSearchRequest) => ["product-franchises", params] as const,
  detail: (id: number | string) => ["product-franchises", id] as const,
  byFranchise: (franchiseId: string, onlyActive: boolean) => 
    ["product-franchises", "franchise", franchiseId, onlyActive] as const,
};

// ── Queries ─────────────────────────────────────────────────────────────────

export const useProductFranchisesQuery = (searchParams: ProductFranchiseSearchRequest) => {
  return useQuery({
    queryKey: PRODUCT_FRANCHISE_KEYS.search(searchParams),
    queryFn: async () => {
      console.log("[Product Franchise API] Searching product franchises...", searchParams);
      const result = await productFranchiseApi.searchProductFranchises(searchParams);
      console.log("[Product Franchise API] Search response:", result);
      return result;
    },
    placeholderData: keepPreviousData,
  });
};

export const useProductFranchiseDetailQuery = (id: number | string, enabled = true) => {
  return useQuery({
    queryKey: PRODUCT_FRANCHISE_KEYS.detail(id),
    queryFn: () => productFranchiseApi.getProductFranchise(id),
    enabled,
  });
};

export const useProductsByFranchiseQuery = (franchiseId: string, onlyActive = true) => {
  return useQuery({
    queryKey: PRODUCT_FRANCHISE_KEYS.byFranchise(franchiseId, onlyActive),
    queryFn: () => productFranchiseApi.getProductsByFranchise(franchiseId, onlyActive),
    enabled: !!franchiseId,
  });
};

// ── Mutations ───────────────────────────────────────────────────────────────

export const useCreateProductFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductFranchiseRequest) =>
      productFranchiseApi.createProductFranchise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_FRANCHISE_KEYS.all });
      toast.success("Product added to franchise successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to add product to franchise", {
        description: error.message,
      });
    },
  });
};

export const useUpdateProductFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateProductFranchiseRequest;
    }) => productFranchiseApi.updateProductFranchise(id, data),
    onSuccess: (updatedProductFranchise) => {
      console.log("[Product Franchise API] Update success:", updatedProductFranchise);
      queryClient.invalidateQueries({ queryKey: PRODUCT_FRANCHISE_KEYS.all });
      toast.success("Product franchise updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update product franchise", {
        description: error.message,
      });
    },
  });
};

export const useDeleteProductFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => productFranchiseApi.deleteProductFranchise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_FRANCHISE_KEYS.all });
      toast.success("Product removed from franchise successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to remove product from franchise", {
        description: error.message,
      });
    },
  });
};

export const useRestoreProductFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => productFranchiseApi.restoreProductFranchise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_FRANCHISE_KEYS.all });
      toast.success("Product franchise restored successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to restore product franchise", {
        description: error.message,
      });
    },
  });
};

export const useChangeStatusProductFranchiseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: ChangeStatusRequest;
    }) => productFranchiseApi.changeStatusProductFranchise(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_FRANCHISE_KEYS.all });
      toast.success("Product franchise status updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update product franchise status", {
        description: error.message,
      });
    },
  });
};
