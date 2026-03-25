import type { Franchise } from "@/types/franchise";
import { httpClient } from "../httpClient.api";
import type { CategoryList } from "@/types/category";
import type { MenuCategory } from "@/types/menu.type";
import type { ProductListItem, ProductDetailItem } from "@/types/product.type";
import type { FranchiseListResponse } from "../franchise";

type ProductSizeLike = {
  productFranchiseId: string | number;
  size: string | null;
  price: number;
  isAvailable: boolean;
};

const dedupeSizes = <T extends ProductSizeLike>(sizes: T[] = []) => {
  const sizesById = new Map<string, T>();

  for (const size of sizes) {
    sizesById.set(String(size.productFranchiseId), size);
  }

  return Array.from(sizesById.values());
};

const normalizeProductListItem = (product: ProductListItem): ProductListItem => ({
  ...product,
  sizes: dedupeSizes(product.sizes),
});

const normalizeMenuCategory = (category: MenuCategory): MenuCategory => ({
  ...category,
  products: category.products.map((product) => ({
    ...product,
    sizes: dedupeSizes(product.sizes),
  })),
});

const normalizeProductDetail = (
  product: ProductDetailItem,
): ProductDetailItem => ({
  ...product,
  sizes: dedupeSizes(product.sizes),
});

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

  return (response ?? []).map(normalizeMenuCategory);
};

export const getMenuByFranchise = async (
  franchiseID: string,
): Promise<MenuCategory[]> => {
  const response = await httpClient.get<MenuCategory[]>({
    url: `/api/clients/menu?franchiseId=${franchiseID}&categoryId=`,
  });

  return (response ?? []).map(normalizeMenuCategory);
};

export const getProductByFranchiseFilterByCategory = async (
  franchiseID: string,
  categoryID: string,
): Promise<ProductListItem[]> => {
  const response = await httpClient.get<ProductListItem[]>({
    url: `/api/clients/products?franchiseId=${franchiseID}&categoryId=${categoryID}`,
  });

  return (response ?? []).map(normalizeProductListItem);
};

export const getProductsByFranchise = async (
  franchiseID: string,
): Promise<ProductListItem[]> => {
  const response = await httpClient.get<ProductListItem[]>({
    url: `/api/clients/products?franchiseId=${franchiseID}&categoryId=`,
  });

  return (response ?? []).map(normalizeProductListItem);
};

export const getToppingByFranchise = async (
  franchiseID: string,
): Promise<ProductListItem[]> => {
  const response = await httpClient.get<ProductListItem[]>({
    url: `/api/clients/products?franchiseId=${franchiseID}&categoryId=Topping`,
  });

  return (response ?? []).map(normalizeProductListItem);
};

export const getProductDetail = async (
  franchiseID: string,
  productID: string,
): Promise<ProductDetailItem> => {
  const response = await httpClient.get<ProductDetailItem>({
    url: `/api/clients/franchises/${franchiseID}/products/${productID}`,
  });

  return normalizeProductDetail(response!);
};

export const getFranchiseDetail = async (
  franchiseId: string,
): Promise<Franchise> => {
  const response = await httpClient.get<Franchise>({
    url: `/api/clients/franchises/${franchiseId}`,
  });

  return response!;
};
