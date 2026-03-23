import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import * as productApi from "@/api/client/product.api";
import type { CategoryList } from "@/types/category";
import type { MenuCategory } from "@/types/menu.type";
import type { ProductListItem } from "@/types/product.type";

export const MENU_KEYS = {
  all: ["menu"] as const,
  categories: (franchiseId: string) => ["categories", franchiseId] as const,
  byFranchise: (franchiseId: string) => ["menu", franchiseId, "all"] as const,
  byCategory: (franchiseId: string, categoryId: string) =>
    ["menu", franchiseId, categoryId] as const,
  productsByCategory: (franchiseId: string, categoryId: string) =>
    ["products", franchiseId, categoryId] as const,
};

export const useGetMenuByFranchise = (franchiseId: string) => {
  return useQuery<MenuCategory[]>({
    queryKey: MENU_KEYS.byFranchise(franchiseId),
    queryFn: () => productApi.getMenuByFranchise(franchiseId),
    enabled: !!franchiseId,
  });
};

export const useGetCategoriesByFranchise = (franchiseId: string) => {
  return useQuery<CategoryList[]>({
    queryKey: MENU_KEYS.categories(franchiseId),
    queryFn: () => productApi.getAllCategoriesByFranchise(franchiseId),
    enabled: !!franchiseId,
  });
};

export const useGetProductsByFranchiseAndCategory = (
  franchiseId: string,
  categoryId: string,
) => {
  return useQuery<ProductListItem[]>({
    queryKey: MENU_KEYS.productsByCategory(franchiseId, categoryId),
    queryFn: () =>
      productApi.getProductByFranchiseFilterByCategory(franchiseId, categoryId),
    enabled: !!franchiseId && !!categoryId,
  });
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
      queryKey: MENU_KEYS.productsByCategory(franchiseId, categoryId),
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

  return {
    data,
    isLoading: queries.some((query) => query.isLoading),
    isFetching: queries.some((query) => query.isFetching),
    error: queries.find((query) => query.error)?.error ?? null,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  };
};
