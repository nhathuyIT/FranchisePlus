import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as productApi from "@/api/product/product.api";
import type {
  ProductSearchRequest,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/api/product/product.api";

// ── Query Keys ──────────────────────────────────────────────────────────────

const PRODUCT_KEYS = {
  all: ["products"] as const,
  search: (params: ProductSearchRequest) => ["products", params] as const,
  detail: (id: number) => ["products", id] as const,
};

// ── Queries ─────────────────────────────────────────────────────────────────

export const useProductsQuery = (searchParams: ProductSearchRequest) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.search(searchParams),
    queryFn: async () => {
      console.log("[Product API] Searching products...", searchParams);
      const result = await productApi.searchProducts(searchParams);
      console.log("[Product API] Search response:", result);
      return result;
    },
    placeholderData: keepPreviousData,
  });
};

export const useProductDetailQuery = (id: number, enabled = true) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled,
  });
};

// ── Mutations ───────────────────────────────────────────────────────────────

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create product", {
        description: error.message,
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productApi.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      console.log("[Product API] Update success:", updatedProduct);
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update product", {
        description: error.message,
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete product", {
        description: error.message,
      });
    },
  });
};

export const useUpdateProductStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      productApi.updateProduct(id, { is_active: isActive } as UpdateProductRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product status updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update product status", {
        description: error.message,
      });
    },
  });
};

export const useRestoreProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.restoreProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product restored successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to restore product", {
        description: error.message,
      });
    },
  });
};
