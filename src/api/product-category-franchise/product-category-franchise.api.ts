import { httpClient } from "../httpClient.api";
import { axiosClient } from "../axios.config";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProductCategoryFranchise {
  id: string;
  categoryFranchiseId: string;
  productFranchiseId: string;
  displayOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional joined fields returned by backend
  categoryName?: string;
  productName?: string;
  productImageUrl?: string;
  productSku?: string;
  franchiseId?: string;
}

export interface AddProductToCategoryFranchiseRequest {
  categoryFranchiseId: string;
  productFranchiseId: string;
  displayOrder: number;
}

export interface ProductCategoryFranchiseSearchCondition {
  franchiseId?: string;
  categoryFranchiseId?: string;
  productFranchiseId?: string;
  isActive?: boolean | "";
  isDeleted: boolean;
}

export interface ProductCategoryFranchiseSearchRequest {
  searchCondition: ProductCategoryFranchiseSearchCondition;
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

// ── API Functions ────────────────────────────────────────────────────────────

/**
 * Assign a product to a category within a franchise.
 * POST /api/product-category-franchises
 *
 * Uses httpClient.post — the request interceptor auto-converts camelCase → snake_case.
 */
export const addProductToCategoryFranchise = async (
  data: AddProductToCategoryFranchiseRequest,
): Promise<ProductCategoryFranchise> => {
  console.log("[ProductCategoryFranchise] Assigning product to category:", data);
  const response = await httpClient.post<
    ProductCategoryFranchise,
    AddProductToCategoryFranchiseRequest
  >({
    url: "/api/product-category-franchises",
    data,
  });
  console.log("[ProductCategoryFranchise] Assign response:", response);
  return response!;
};

/**
 * Search product-category-franchise assignments by conditions.
 * POST /api/product-category-franchises/search
 *
 * Payload is JSON.stringify-d to bypass the camelCase → snake_case interceptor.
 * Backend expects snake_case inside searchCondition.
 */
export const searchProductCategoryFranchises = async (
  data: ProductCategoryFranchiseSearchRequest,
): Promise<ProductCategoryFranchise[]> => {
  console.log("[ProductCategoryFranchise] Searching assignments:", data.searchCondition);
  const payload = {
    searchCondition: {
      franchise_id: data.searchCondition.franchiseId,
      category_franchise_id: data.searchCondition.categoryFranchiseId,
      product_franchise_id: data.searchCondition.productFranchiseId,
      is_active: data.searchCondition.isActive,
      is_deleted: data.searchCondition.isDeleted,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const res = await axiosClient.post(
    "/api/product-category-franchises/search",
    JSON.stringify(payload),
    { headers: { "Content-Type": "application/json" } },
  );

  const responseData = res.data?.data;
  if (Array.isArray(responseData)) {
    console.log("[ProductCategoryFranchise] Search response:", responseData);
    return responseData as ProductCategoryFranchise[];
  }
  if (Array.isArray(responseData?.pageData)) {
    console.log("[ProductCategoryFranchise] Search response:", responseData.pageData);
    return responseData.pageData as ProductCategoryFranchise[];
  }
  return [];
};

/**
 * Remove a product-category-franchise assignment.
 * DELETE /api/product-category-franchises/:id
 */
export const deleteProductCategoryFranchise = async (id: string): Promise<void> => {
  await httpClient.delete<unknown>({ url: `/api/product-category-franchises/${id}` });
};

// ── Types for GET /franchise/:franchiseId ────────────────────────────────────

export interface CategoryAssignment {
  categoryId: string;       // actual category id (after camelCase conversion)
  categoryName: string;
}

export interface ProductWithCategories {
  id: string;               // same as productFranchiseId
  productFranchiseId: string;
  productId: string;
  productName?: string;
  productSku?: string;
  size?: string;
  priceBase?: number;
  franchiseId?: string;
  franchiseName?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  categories: CategoryAssignment[];
}

/**
 * Get all products for a franchise, each with their category assignments.
 * Products not assigned to any category will have categories: [].
 * GET /api/product-category-franchises/franchise/:franchiseId
 */
export const getProductsByFranchise = async (
  franchiseId: string,
): Promise<ProductWithCategories[]> => {
  console.log("[ProductCategoryFranchise] Getting products with categories, franchiseId:", franchiseId);
  const res = await axiosClient.get(
    `/api/product-category-franchises/franchise/${franchiseId}`,
  );
  console.log("[ProductCategoryFranchise] Products with categories response:", res.data?.data);
  return res.data?.data ?? [];
};
