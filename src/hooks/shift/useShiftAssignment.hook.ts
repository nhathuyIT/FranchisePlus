import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as shiftAssignmentApi from "@/api/shift/shift-assignment.api";
import type {
  AssignShiftForUserRequest,
  AssignShiftsForUserBulkRequest,
  SearchShiftAssignmentsRequest,
  ShiftAssignmentStatusRequest,
} from "@/types/shift-assignment.type";

const SHIFT_ASSIGNMENT_KEYS = {
  all: ["shift-assignments"] as const,
  search: (params: SearchShiftAssignmentsRequest) =>
    ["shift-assignments", "search", params] as const,
  detail: (shiftAssignmentId: string) =>
    ["shift-assignments", "detail", shiftAssignmentId] as const,
  byUser: (userId: string, date: string) =>
    ["shift-assignments", "user", userId, date] as const,
  byShift: (shiftId: string) =>
    ["shift-assignments", "shift", shiftId] as const,
  byFranchise: (franchiseId: string) =>
    ["shift-assignments", "franchise", franchiseId] as const,
};

/**
 * Search shift assignments with condition and pagination
 */
export const useShiftAssignmentSearchQuery = (
  searchParams: SearchShiftAssignmentsRequest,
  enabled = true,
) => {
  return useQuery({
    queryKey: SHIFT_ASSIGNMENT_KEYS.search(searchParams),
    queryFn: () => shiftAssignmentApi.searchAssignedShiftForUser(searchParams),
    enabled,
    placeholderData: keepPreviousData,
  });
};

/**
 * Get shift assignment detail by id
 */
export const useShiftAssignmentDetailQuery = (
  shiftAssignmentId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: SHIFT_ASSIGNMENT_KEYS.detail(shiftAssignmentId),
    queryFn: () =>
      shiftAssignmentApi.getAssignedShiftForUser(shiftAssignmentId),
    enabled: !!shiftAssignmentId && enabled,
  });
};

/**
 * Get all shift assignments by user and work date
 */
export const useGetAllShiftsAssignByUserQuery = (
  userId: string,
  date: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: SHIFT_ASSIGNMENT_KEYS.byUser(userId, date),
    queryFn: () => shiftAssignmentApi.getAllShiftsAssignByUser(userId, date),
    enabled: !!userId && !!date && enabled,
  });
};

/**
 * Get all shift assignments by shift id
 */
export const useGetAllShiftAssignByShiftIDQuery = (
  shiftId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: SHIFT_ASSIGNMENT_KEYS.byShift(shiftId),
    queryFn: () => shiftAssignmentApi.getAllShiftAssignByShiftID(shiftId),
    enabled: !!shiftId && enabled,
  });
};

/**
 * Get all shift assignments by franchise
 */
export const useGetAllShiftAssignByFranchiseQuery = (
  franchiseId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: SHIFT_ASSIGNMENT_KEYS.byFranchise(franchiseId),
    queryFn: () =>
      shiftAssignmentApi.getAllShiftAssignByFranchise(franchiseId),
    enabled: !!franchiseId && enabled,
  });
};

export const useShiftAssignmentsByUserQuery =
  useGetAllShiftsAssignByUserQuery;

export const useShiftAssignmentsByFranchiseQuery =
  useGetAllShiftAssignByFranchiseQuery;

/**
 * Assign a shift for one user
 */
export const useAssignShiftForUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignShiftForUserRequest) =>
      shiftAssignmentApi.assignShiftForUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SHIFT_ASSIGNMENT_KEYS.all,
      });
      toast.success("Shift assigned successfully!", {
        description: "The shift has been assigned to the user",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to assign shift", {
        description: error.message,
      });
    },
  });
};

export const useAssignShiftForUser = useAssignShiftForUserMutation;

/**
 * Assign multiple shifts for users
 */
export const useAssignShiftsForUserBulkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignShiftsForUserBulkRequest) =>
      shiftAssignmentApi.assignShiftsForUser(data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: SHIFT_ASSIGNMENT_KEYS.all,
      });
      toast.success("Shifts assigned successfully!", {
        description: `${variables.items.length} shift assignment(s) created`,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to assign shifts", {
        description: error.message,
      });
    },
  });
};

/**
 * Change shift assignment status
 */
export const useChangeShiftAssignmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shiftAssignmentId,
      data,
    }: {
      shiftAssignmentId: string;
      data: ShiftAssignmentStatusRequest;
    }) =>
      shiftAssignmentApi.changeAssinedShiftStatus(shiftAssignmentId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: SHIFT_ASSIGNMENT_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: SHIFT_ASSIGNMENT_KEYS.detail(variables.shiftAssignmentId),
      });
      toast.success("Shift assignment status updated successfully!", {
        description: `Status changed to ${variables.data.status}`,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update shift assignment status", {
        description: error.message,
      });
    },
  });
};

export { SHIFT_ASSIGNMENT_KEYS };
