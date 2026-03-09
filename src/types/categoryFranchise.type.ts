export interface CategoryFranchiseRequest {
  franchiseId: string;
  categoryId: string;
  displayOrder: number;
}

export interface CategoryFranchiseResponse {
  success: boolean;
  data: CategoryFranchise;
}

export interface CategoryFranchise {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  franchiseId: string;
  displayOrder: number;
}

export interface SearchCategoryFranchise {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  categoryName: string;
  franchiseId: string;
  franchiseName: string;
  displayOrder: number;
}

export interface SearchCategoryFranchiseResponse {
  success: boolean;
  data: SearchCategoryFranchise[];
}

export interface SearchCategoryFranchiseRequest {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
}

interface SearchCondition {
  franchiseId?: string;
  categoryId?: string;
  isActive?: string | boolean;
  isDeleted: false;
}

export interface GetItemByCategoryFranchiseIdResponse {
  success: boolean;
  data: GetItemByCategoryFranchiseId;
}

interface GetItemByCategoryFranchiseId {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  franchiseId: string;
  displayOrder: number;
}

export interface ChangeStatusCategoryFranchiseRequest {
  isActive: boolean;
}

export interface ChangeStatusCategoryFranchiseResponse {
  success: boolean;
  data?: unknown;
}

export interface DeleteCategoryFranchiseResponse {
  success: boolean;
  data?: unknown;
}

export interface RestoreCategoryFranchiseResponse {
  success: boolean;
  data?: unknown;
}

export interface CategoryByFranchise {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  franchiseId: string;
  franchiseName: string;
  franchiseCode: string;
  displayOrder: number;
}

export interface GetCategoryByFranchiseIdResponse {
  success: boolean;
  data: CategoryByFranchise[];
}
