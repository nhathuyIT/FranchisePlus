import { httpClient } from "../httpClient.api";
import { axiosClient } from "../axios.config";
import type {
  CategoryFranchiseResponse,
  CategoryFranchiseRequest,
  SearchCategoryFranchiseResponse,
  SearchCategoryFranchiseRequest,
  GetItemByCategoryFranchiseIdResponse,
  ChangeStatusCategoryFranchiseRequest,
  ChangeStatusCategoryFranchiseResponse,
  DeleteCategoryFranchiseResponse,
  RestoreCategoryFranchiseResponse,
  GetCategoryByFranchiseIdResponse,
} from "@/types/categoryFranchise.type";

export const addCategoryToFranchise = async (
  data: CategoryFranchiseRequest,
): Promise<CategoryFranchiseResponse> => {
  const response = await httpClient.post<
    CategoryFranchiseResponse,
    CategoryFranchiseRequest
  >({ url: "/api/category-franchises", data });

  return response!;
};

/**
 * Search category-franchises with pagination.
 *
 * NOTE: Payload is JSON.stringify-d before sending to bypass the automatic
 * camelCase → snake_case interceptor. The backend expects camelCase keys for
 * `pageInfo` / `pageNum` / `pageSize`, and snake_case keys inside
 * `searchCondition` (e.g. `franchise_id`, `category_id`, `is_deleted`).
 */
export const searchItemsByConditions = async (
  data: SearchCategoryFranchiseRequest,
): Promise<SearchCategoryFranchiseResponse> => {
  const payload = {
    searchCondition: {
      franchise_id: data.searchCondition.franchiseId,
      category_id: data.searchCondition.categoryId,
      is_active: data.searchCondition.isActive,
      is_deleted: data.searchCondition.isDeleted,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const res = await axiosClient.post(
    "/api/category-franchises/search",
    JSON.stringify(payload),
    { headers: { "Content-Type": "application/json" } },
  );

  return res.data as SearchCategoryFranchiseResponse;
};

export const getItem = async (
  categoryFranchiseId: string,
): Promise<GetItemByCategoryFranchiseIdResponse> => {
  const response = await httpClient.get<GetItemByCategoryFranchiseIdResponse>({
    url: `/api/category-franchises/${categoryFranchiseId}`,
  });

  return response!;
};

export const changeStatusItem = async (
  categoryFranchiseId: string,
  data: ChangeStatusCategoryFranchiseRequest,
): Promise<ChangeStatusCategoryFranchiseResponse> => {
  const response = await httpClient.patch<
    ChangeStatusCategoryFranchiseResponse,
    ChangeStatusCategoryFranchiseRequest
  >({
    url: `/api/category-franchises/${categoryFranchiseId}/status`,
    data,
  });

  return response!;
};

export const deleteItemByCategoryFranchiseId = async (
  categoryFranchiseId: string,
): Promise<DeleteCategoryFranchiseResponse> => {
  const response = await httpClient.delete<DeleteCategoryFranchiseResponse>({
    url: `/api/category-franchises/${categoryFranchiseId}`,
  });

  return response!;
};

export const restoreItemByCategoryFranchiseId = async (
  categoryFranchiseId: string,
): Promise<RestoreCategoryFranchiseResponse> => {
  const response = await httpClient.patch<RestoreCategoryFranchiseResponse>({
    url: `/api/category-franchises/${categoryFranchiseId}/restore`,
  });

  return response!;
};

export const getCategoryByFranchiseId = async (
  franchiseId: string,
): Promise<GetCategoryByFranchiseIdResponse> => {
  const response = await httpClient.get<GetCategoryByFranchiseIdResponse>({
    url: `/api/category-franchises/franchise/${franchiseId}?onlyActive=true`,
  });

  return response!;
};
