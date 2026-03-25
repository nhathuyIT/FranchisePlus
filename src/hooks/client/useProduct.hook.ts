import { useEffect, useMemo, useRef } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import * as productApi from "@/api/client/product.api";
import type { CategoryList } from "@/types/category";
import type { Franchise } from "@/types/franchise";
import type { MenuCategory } from "@/types/menu.type";
import type { ProductDetailItem, ProductListItem } from "@/types/product.type";

const PRODUCT_KEYS = {
  allFranchise: ["client", "franchise", "all"] as const,
  franchiseDetail: (franchiseId: string) =>
    ["client", "franchise", franchiseId, "detail"] as const,
  categoriesByFranchise: (franchiseId: string) =>
    ["client", "categories", franchiseId] as const,
  menuTabsByFranchise: (franchiseId: string) =>
    ["client", "menu", franchiseId, "tabs"] as const,
  menuByFranchise: (franchiseId: string) =>
    ["client", "menu", franchiseId, "all"] as const,
  menuByFranchiseAndCategory: (franchiseId: string, categoryId: string) =>
    ["client", "menu", franchiseId, categoryId] as const,
  productsByFranchise: (franchiseId: string) =>
    ["client", "products", franchiseId, "all"] as const,
  toppingByFranchise: (franchiseId: string) =>
    ["products", franchiseId, "all"] as const,
  productsByFranchiseAndCategory: (franchiseId: string, categoryId: string) =>
    ["client", "products", franchiseId, categoryId] as const,
  productDetail: (franchiseId: string, productId: string) =>
    ["client", "product", franchiseId, productId, "detail"] as const,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Please try again.";
};

type QueryOptions<TQueryFnData, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, unknown, TData>,
  "queryKey" | "queryFn"
>;

const useQueryErrorToast = (
  error: unknown,
  isError: boolean,
  title: string,
) => {
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (isError && !hasShownRef.current) {
      toast.error(title, {
        description: getErrorMessage(error),
      });
      hasShownRef.current = true;
    }

    if (!isError) {
      hasShownRef.current = false;
    }
  }, [error, isError, title]);
};

export const useGetAllFranchise = () => {
  const query = useQuery<Franchise[]>({
    queryKey: PRODUCT_KEYS.allFranchise,
    queryFn: productApi.getAllFranchise,
  });

  useQueryErrorToast(
    query.error,
    query.isError,
    "Failed to load franchise list",
  );

  return query;
};

export const useGetFranchiseDetail = (franchiseId: string) => {
  const query = useQuery<Franchise>({
    queryKey: PRODUCT_KEYS.franchiseDetail(franchiseId),
    queryFn: () => productApi.getFranchiseDetail(franchiseId),
    enabled: !!franchiseId,
  });

  useQueryErrorToast(
    query.error,
    query.isError,
    "Failed to load franchise detail",
  );

  return query;
};

export const useGetCategoriesByFranchise = <TData = CategoryList[]>(
  franchiseId: string,
  options?: QueryOptions<CategoryList[], TData>,
) => {
  const query = useQuery<CategoryList[], unknown, TData>({
    queryKey: PRODUCT_KEYS.categoriesByFranchise(franchiseId),
    queryFn: () => productApi.getAllCategoriesByFranchise(franchiseId),
    ...options,
    enabled: !!franchiseId && (options?.enabled ?? true),
  });

  useQueryErrorToast(query.error, query.isError, "Failed to load categories");

  return query;
};

export const useGetMenuByFranchise = <TData = MenuCategory[]>(
  franchiseId: string,
  options?: QueryOptions<MenuCategory[], TData>,
) => {
  const query = useQuery<MenuCategory[], unknown, TData>({
    queryKey: PRODUCT_KEYS.menuByFranchise(franchiseId),
    queryFn: () => productApi.getMenuByFranchise(franchiseId),
    ...options,
    enabled: !!franchiseId && (options?.enabled ?? true),
  });

  useQueryErrorToast(query.error, query.isError, "Failed to load menu");

  return query;
};

export const useGetMenuByFranchiseAndCategory = <TData = MenuCategory[]>(
  franchiseId: string,
  categoryId: string,
  options?: QueryOptions<MenuCategory[], TData>,
) => {
  const query = useQuery<MenuCategory[], unknown, TData>({
    queryKey: PRODUCT_KEYS.menuByFranchiseAndCategory(franchiseId, categoryId),
    queryFn: () =>
      productApi.getMenuByFranchiseFilterByCategory(franchiseId, categoryId),
    ...options,
    enabled: !!franchiseId && !!categoryId && (options?.enabled ?? true),
  });

  useQueryErrorToast(
    query.error,
    query.isError,
    "Failed to load menu by category",
  );

  return query;
};

export const useGetProductsByFranchiseAndCategory = <TData = ProductListItem[]>(
  franchiseId: string,
  categoryId: string,
  options?: QueryOptions<ProductListItem[], TData>,
) => {
  const query = useQuery<ProductListItem[], unknown, TData>({
    queryKey: PRODUCT_KEYS.productsByFranchiseAndCategory(
      franchiseId,
      categoryId,
    ),
    queryFn: () =>
      productApi.getProductByFranchiseFilterByCategory(franchiseId, categoryId),
    ...options,
    enabled: !!franchiseId && !!categoryId && (options?.enabled ?? true),
  });

  useQueryErrorToast(
    query.error,
    query.isError,
    "Failed to load products by category",
  );

  return query;
};

export const useGetProductsByFranchise = <TData = ProductListItem[]>(
  franchiseId: string,
  options?: QueryOptions<ProductListItem[], TData>,
) => {
  const query = useQuery<ProductListItem[], unknown, TData>({
    queryKey: PRODUCT_KEYS.productsByFranchise(franchiseId),
    queryFn: () => productApi.getProductsByFranchise(franchiseId),
    ...options,
    enabled: !!franchiseId && (options?.enabled ?? true),
  });

  useQueryErrorToast(query.error, query.isError, "Failed to load products");

  return query;
};

export const useGetToppingByFranchise = (franchiseId: string) => {
  const query = useQuery<ProductListItem[]>({
    queryKey: PRODUCT_KEYS.toppingByFranchise(franchiseId),
    queryFn: () => productApi.getToppingByFranchise(franchiseId),
    enabled: !!franchiseId,
  });

  useQueryErrorToast(
    query.error,
    query.isError,
    "Failed to load topping products",
  );

  return query;
};

export const useGetProductDetail = (
  franchiseId: string,
  productId: string,
) => {
  const query = useQuery<ProductDetailItem>({
    queryKey: PRODUCT_KEYS.productDetail(franchiseId, productId),
    queryFn: () => productApi.getProductDetail(franchiseId, productId),
    enabled: !!franchiseId && !!productId,
  });

  useQueryErrorToast(
    query.error,
    query.isError,
    "Failed to load product detail",
  );

  return query;
};

export const useGetToppingProductsByFranchise = (
  franchiseId: string,
  categoryIds: string[],
) => {
  const normalizedCategoryIds = useMemo(
    () => Array.from(new Set(categoryIds.filter(Boolean))),
    [categoryIds],
  );

  const queries = useQueries({
    queries: normalizedCategoryIds.map((categoryId) => ({
      queryKey: PRODUCT_KEYS.productsByFranchiseAndCategory(
        franchiseId,
        categoryId,
      ),
      queryFn: () =>
        productApi.getProductByFranchiseFilterByCategory(
          franchiseId,
          categoryId,
        ),
      enabled: !!franchiseId && !!categoryId,
      staleTime: 60 * 1000,
    })),
  });

  const data = useMemo(() => {
    const productsById = new Map<string, ProductListItem>();

    queries.forEach((query) => {
      (query.data ?? []).forEach((product) => {
        const productId = String(product.productId);
        const existing = productsById.get(productId);

        if (!existing) {
          productsById.set(productId, product);
          return;
        }

        const sizesById = new Map(
          existing.sizes.map((size) => [String(size.productFranchiseId), size]),
        );

        product.sizes.forEach((size) => {
          sizesById.set(String(size.productFranchiseId), size);
        });

        productsById.set(productId, {
          ...existing,
          sizes: Array.from(sizesById.values()),
        });
      });
    });

    return Array.from(productsById.values());
  }, [queries]);

  const firstError = queries.find((query) => query.error)?.error ?? null;
  const isError = queries.some((query) => query.isError);

  useQueryErrorToast(firstError, isError, "Failed to load topping products");

  return {
    data,
    isLoading: queries.some((query) => query.isLoading),
    isFetching: queries.some((query) => query.isFetching),
    isError,
    error: firstError,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  };
};
