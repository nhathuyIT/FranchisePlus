import type {
  AssignShiftForUserRequest,
  AssignShiftForUserResponse,
  GetShiftAssignmentResponse,
  SearchShiftAssignmentsRequest,
  SearchShiftAssignmentsResponse,
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

// export const assignShiftsForUser = async () => {
//     const response = await httpClient.post({
//         url: ''
//     })
// }

export const searchAssignedShiftForUser = async (
  data: SearchShiftAssignmentsRequest,
): Promise<SearchShiftAssignmentsResponse> => {
  const response = await httpClient.post<
    SearchShiftAssignmentsResponse,
    SearchShiftAssignmentsRequest
  >({
    url: "/api/shift-assignments/search",
    data,
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

export const getAllShiftAssignByFranchise = async (franchiseId: string) => {
  const response = await httpClient.get({
    url: `/api/shift-assignments/franchise/${franchiseId}`,
  });

  return response!;
};
