import type {
  CreateShiftRequest,
  CreateShiftResponse,
  GetShiftResponse,
  ShiftChangeStatusRequest,
  ShiftChangeStatusResponse,
  ShiftDeleteResponse,
  ShiftGetByFranchiseResponse,
  ShiftRestoreResponse,
  ShiftSearchRequest,
  ShiftSearchResponse,
  ShiftUpdateRequest,
  ShiftUpdateResponse,
} from "@/types/shift";
import { httpClient } from "../httpClient.api";

export const createShift = async (
  data: CreateShiftRequest,
): Promise<CreateShiftResponse> => {
  const response = await httpClient.post<
    CreateShiftResponse,
    CreateShiftRequest
  >({
    url: "/api/shifts",
    data,
  });

  return response!;
};

export const searchShift = async (
  data: ShiftSearchRequest,
): Promise<ShiftSearchResponse> => {
  const response = await httpClient.post<
    ShiftSearchResponse,
    ShiftSearchRequest
  >({
    url: "/api/shifts/search",
    data,
  });

  return response!;
};

export const getShift = async (shiftID: string): Promise<GetShiftResponse> => {
  const response = await httpClient.get<GetShiftResponse>({
    url: `/api/shifts/${shiftID}`,
  });

  return response!;
};

export const updateShift = async (
  shiftID: string,
  data: ShiftUpdateRequest,
): Promise<ShiftUpdateResponse> => {
  const response = await httpClient.put<
    ShiftUpdateResponse,
    ShiftUpdateRequest
  >({
    url: `/api/shifts/${shiftID}`,
    data,
  });

  return response!;
};

export const deleteShift = async (
  shiftID: string,
): Promise<ShiftDeleteResponse> => {
  const response = await httpClient.delete<ShiftDeleteResponse>({
    url: `/api/shifts/${shiftID}`,
  });

  return response!;
};

export const restoreShift = async (
  shiftID: string,
): Promise<ShiftRestoreResponse> => {
  const response = await httpClient.patch<ShiftRestoreResponse>({
    url: `/api/shifts/${shiftID}/restore`,
  });

  return response!;
};

export const changeStatusShift = async (
  shiftID: string,
  data: ShiftChangeStatusRequest,
): Promise<ShiftChangeStatusResponse> => {
  const response = await httpClient.patch<ShiftChangeStatusResponse>({
    url: `/api/shifts/${shiftID}/status`,
    data,
  });

  return response!;
};

export const getShiftByFranchise = async (
  franchiseID: string,
): Promise<ShiftGetByFranchiseResponse> => {
  const response = await httpClient.get<ShiftGetByFranchiseResponse>({
    url: `/api/shifts/select?franchise_id=${franchiseID}`,
  });

  return response!;
};
