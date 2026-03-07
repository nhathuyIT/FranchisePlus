import type { FranchiseList } from "@/types/franchise";
import { httpClient } from "../httpClient.api";
import type { CategoryList } from "@/types/category";
import type { MenuCategory } from "@/types/menu.type";
import type { ProductListItem } from "@/types/product.type";

export const getAllFranchise = async (): Promise<FranchiseList[]> => {
  const response = await httpClient.get<FranchiseList[]>({
    url: "/api/clients/franchises",
  });
  return response!;
};

export const getAllCategoriesByFranchise = async (
  franchiseID: string,
): Promise<CategoryList[]> => {
  const response = await httpClient.get<CategoryList[]>({
    url: `/api/clients/franchises/${franchiseID}/categories`,
  });

  return response!;
};

export const getMenuByFranchiseFilterByCategory = async (
  franchiseID: string,
  categoryID: string,
): Promise<MenuCategory[]> => {
  const response = await httpClient.get<MenuCategory[]>({
    url: `/api/clients/menu?franchiseId=${franchiseID}&categoryId=${categoryID}`,
  });

  return response!;
};

// Get topping
export const getProductByFranchiseFilterByCategory = async (
  franchiseID: string,
  categoryID: string,
): Promise<ProductListItem[]> => {
  const response = await httpClient.get<ProductListItem[]>({
    url: `/api/clients/products?franchiseId=${franchiseID}&categoryId=${categoryID}`,
  });

  return response!;
};

// export const getProductDetail = async (productFranchiseID: string) => {
//   const response = await httpClient.get({
//     url: `/api/clients/products/${productFranchiseID}`,
//   });

//   return response!;
// };
