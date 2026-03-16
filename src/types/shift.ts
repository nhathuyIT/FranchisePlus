export interface CreateShiftRequest {
  franchise_id: string;
  name: string;
  start_time: string;
  end_time: string;
}

export interface BaseMetadata {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shift extends BaseMetadata {
  name: string;
  franchiseId: string;
  startTime: string;
  endTime: string;
}

export interface CreateShiftResponse {
  success: boolean;
  data: Shift;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface PageInfoResponse {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ShiftSearchCondition {
  name?: string;
  franchiseId?: string;
  startTime?: string;
  endTime?: string;
  isActive?: string;
  isDeleted: boolean;
}

export interface ShiftSearchRequest {
  searchCondition: ShiftSearchCondition;
  pageInfo: PageInfo;
}

export interface ShiftSearchResponse {
  success: boolean;
  data: Shift[];
  pageInfo: PageInfoResponse;
}

export interface GetShiftResponse {
  success: boolean;
  data: Shift;
}

export interface ShiftUpdateRequest {
  name: string;
  start_time: string;
  end_time: string;
}

export interface ShiftUpdateResponse {
  success: boolean;
  data: Shift;
}

export interface ShiftDeleteResponse {
  success: boolean;
  data: unknown;
}

export interface ShiftRestoreResponse {
  success: boolean;
  data: unknown;
}

export interface ShiftChangeStatusRequest {
  isActive: boolean;
}

export interface ShiftChangeStatusResponse {
  success: boolean;
  data: unknown;
}

export interface ShiftGetByFranchise {
  value: string;
  name: string;
  franchiseId: string;
}

export interface ShiftGetByFranchiseResponse {
  success: boolean;
  data: ShiftGetByFranchise[];
}
