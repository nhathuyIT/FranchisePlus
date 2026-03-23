import type { Franchise } from "@/types/franchise";
import { httpClient } from "../httpClient.api";
import type { CategoryList } from "@/types/category";
import type { MenuCategory } from "@/types/menu.type";
import type { ProductListItem, ProductDetailItem } from "@/types/product.type";
import type { FranchiseListResponse } from "../franchise";

export const getAllFranchise = async (): Promise<FranchiseListResponse> => {
  const response = await httpClient.get<FranchiseListResponse>({
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

export const getMenuByFranchise = async (
  franchiseID: string,
): Promise<MenuCategory[]> => {
  const response = await httpClient.get<MenuCategory[]>({
    url: `/api/clients/menu?franchiseId=${franchiseID}&categoryId=`,
  });

  return response!;
};

export const getProductByFranchiseFilterByCategory = async (
  franchiseID: string,
  categoryID: string,
): Promise<ProductListItem[]> => {
  const response = await httpClient.get<ProductListItem[]>({
    url: `/api/clients/products?franchiseId=${franchiseID}&categoryId=${categoryID}`,
  });

  return response!;
};

export const getProductsByFranchise = async (
  franchiseID: string,
): Promise<ProductListItem[]> => {
  const response = await httpClient.get<ProductListItem[]>({
    url: `/api/clients/products?franchiseId=${franchiseID}&categoryId=`,
  });

  return response!;
};

export const getToppingByFranchise = async (
  franchiseID: string,
): Promise<ProductListItem[]> => {
  const response = await httpClient.get<ProductListItem[]>({
    url: `/api/clients/products?franchiseId=${franchiseID}&categoryId=Topping`,
  });

  return response!;
};

export const getProductDetail = async (
  franchiseID: string,
  productFranchiseID: string,
): Promise<ProductDetailItem> => {
  const response = await httpClient.get<ProductDetailItem>({
    url: `/api/clients/franchises/${franchiseID}/products/${productFranchiseID}`,
  });

  return response!;
};

export const getFranchiseDetail = async (
  franchiseId: string,
): Promise<Franchise> => {
  const response = await httpClient.get<Franchise>({
    url: `/api/clients/franchises/${franchiseId}`,
  });

  return response!;
};
