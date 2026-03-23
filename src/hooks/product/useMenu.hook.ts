import { useQuery } from "@tanstack/react-query";
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
