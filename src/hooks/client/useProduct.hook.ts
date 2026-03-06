import { useQuery } from "@tanstack/react-query";
import * as productApi from "@/api/client/product.api";

/**
 * Hook to get all franchises
 */
export const useGetAllFranchise = () => {
  return useQuery({
    queryKey: ["franchises"],
    queryFn: () => productApi.getAllFranchise(),
  });
};

/**
 * Hook to get all categories by franchise
 */
export const useGetCategoriesByFranchise = (franchiseId: string) => {
  return useQuery({
    queryKey: ["categories", franchiseId],
    queryFn: () => productApi.getAllCategoriesByFranchise(franchiseId),
    enabled: !!franchiseId,
  });
};

/**
 * Hook to get menu by franchise and category
 */
export const useGetMenuByFranchiseAndCategory = (
  franchiseId: string,
  categoryId: string,
) => {
  return useQuery({
    queryKey: ["menu", franchiseId, categoryId],
    queryFn: () =>
      productApi.getMenuByFranchiseFilterByCategory(franchiseId, categoryId),
    enabled: !!franchiseId && !!categoryId,
  });
};

/**
 * Hook to get products (toppings) by franchise and category
 */
export const useGetProductsByFranchiseAndCategory = (
  franchiseId: string,
  categoryId: string,
) => {
  return useQuery({
    queryKey: ["products", franchiseId, categoryId],
    queryFn: () =>
      productApi.getProductByFranchiseFilterByCategory(franchiseId, categoryId),
    enabled: !!franchiseId && !!categoryId,
  });
};
