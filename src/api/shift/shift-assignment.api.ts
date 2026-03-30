import type {
  AssignShiftForUserRequest,
  AssignShiftForUserResponse,
  AssignShiftsForUserBulkRequest,
  AssignShiftsForUserBulkResponse,
  GetShiftAssignmentResponse,
  SearchShiftAssignmentsRequest,
  SearchShiftAssignmentsResponse,
  ShiftAssignmentByFranchiseResponse,
  ShiftAssignmentByShiftResponse,
  ShiftAssignmentListResponse,
  ShiftAssignmentResponse,
  ShiftAssignmentStatusRequest,
} from "@/types/shift-assignment.type";
import { httpClient } from "../httpClient.api";

export const assignShiftForUser = async (
  data: AssignShiftForUserRequest,
): Promise<AssignShiftForUserResponse> => {
  const response = await httpClient.post<
    AssignShiftForUserResponse,
    AssignShiftForUserRequest
  >({
    url: "/api/shift-assignments",
    data,
  });

  return response!;
};

export const assignShiftsForUser = async (
  data: AssignShiftsForUserBulkRequest,
): Promise<AssignShiftsForUserBulkResponse> => {
  const response = await httpClient.post<
    AssignShiftsForUserBulkResponse,
    AssignShiftsForUserBulkRequest
  >({
    url: "/api/shift-assignments/bulk",
    data,
  });

  return response!;
};

export const searchAssignedShiftForUser = async (
  data: SearchShiftAssignmentsRequest,
): Promise<SearchShiftAssignmentsResponse> => {
  const payload = {
    searchCondition: {
      shift_id: data.searchCondition.shift_id ?? "",
      user_id: data.searchCondition.user_id ?? "",
      work_date: data.searchCondition.work_date ?? "",
      assigned_by: data.searchCondition.assigned_by ?? "",
      status: data.searchCondition.status ?? "",
      is_deleted: data.searchCondition.is_deleted ?? false,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const response = await httpClient.postPaginatedRaw<
    SearchShiftAssignmentsResponse["data"][number],
    typeof payload
  >({
    url: "/api/shift-assignments/search",
    data: payload,
  });

  return response!;
};

export const getAssignedShiftForUser = async (
  ShiftAssignmentID: string,
): Promise<GetShiftAssignmentResponse> => {
  const response = await httpClient.get<GetShiftAssignmentResponse>({
    url: `/api/shift-assignments/${ShiftAssignmentID}`,
  });

  return response!;
};

export const changeAssinedShiftStatus = async (
  assignShiftID: string,
  data: ShiftAssignmentStatusRequest,
): Promise<ShiftAssignmentResponse> => {
  const response = await httpClient.patch<
    ShiftAssignmentResponse,
    ShiftAssignmentStatusRequest
  >({
    url: `/api/shift-assignments/${assignShiftID}/status`,
    data,
  });

  return response!;
};

export const getAllShiftsAssignByUser = async (
  userID: string,
  date: string,
): Promise<ShiftAssignmentListResponse> => {
  const response = await httpClient.get<ShiftAssignmentListResponse>({
    url: `/api/shift-assignments/user/${userID}?date=${date}`,
  });

  return response!;
};

export const getAllShiftAssignByFranchise = async (
  franchiseId: string,
): Promise<ShiftAssignmentByFranchiseResponse> => {
  const response = await httpClient.get<ShiftAssignmentByFranchiseResponse>({
    url: `/api/shift-assignments/franchise/${franchiseId}`,
  });

  return response!;
};

export const getAllShiftAssignByShiftID = async (
  shiftId: string,
): Promise<ShiftAssignmentByShiftResponse> => {
  const response = await httpClient.get<ShiftAssignmentByShiftResponse>({
    url: `/api/shift-assignments/shift/${shiftId}`,
  });

  return response!;
};

// export const getAllUserBy