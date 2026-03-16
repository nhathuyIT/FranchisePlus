import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as shiftApi from "@/api/shift/shift.api";
import type {
  CreateShiftRequest,
  ShiftChangeStatusRequest,
  ShiftSearchRequest,
  ShiftUpdateRequest,
} from "@/types/shift";

const SHIFT_KEYS = {
  all: ["shifts"] as const,
  search: (params: ShiftSearchRequest) => ["shifts", "search", params] as const,
  detail: (shiftId: string) => ["shifts", "detail", shiftId] as const,
  byFranchise: (franchiseId: string) =>
    ["shifts", "franchise", franchiseId] as const,
};

/**
 * Search shifts with condition and pagination
 */
export const useShiftSearchQuery = (
  searchParams: ShiftSearchRequest,
  enabled = true,
) => {
  return useQuery({
    queryKey: SHIFT_KEYS.search(searchParams),
    queryFn: () => shiftApi.searchShift(searchParams),
    enabled,
    placeholderData: keepPreviousData,
  });
};

/**
 * Get shift detail by id
 */
export const useShiftDetailQuery = (shiftId: string, enabled = true) => {
  return useQuery({
    queryKey: SHIFT_KEYS.detail(shiftId),
    queryFn: () => shiftApi.getShift(shiftId),
    enabled: !!shiftId && enabled,
  });
};

/**
 * Get multiple shift details by ids
 */
export const useShiftDetailQueries = (
  shiftIds: string[],
  enabled = true,
) => {
  return useQueries({
    queries: shiftIds.map((shiftId) => ({
      queryKey: SHIFT_KEYS.detail(shiftId),
      queryFn: () => shiftApi.getShift(shiftId),
      enabled: !!shiftId && enabled,
      staleTime: 5 * 60 * 1000,
    })),
  });
};

/**
 * Get active shifts by franchise id for select options
 */
export const useShiftByFranchiseQuery = (
  franchiseId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: SHIFT_KEYS.byFranchise(franchiseId),
    queryFn: () => shiftApi.getShiftByFranchise(franchiseId),
    enabled: !!franchiseId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create new shift
 */
export const useCreateShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShiftRequest) => shiftApi.createShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIFT_KEYS.all });
      toast.success("Shift created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create shift", {
        description: error.message,
      });
    },
  });
};

/**
 * Update shift by id
 */
export const useUpdateShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shiftId,
      data,
    }: {
      shiftId: string;
      data: ShiftUpdateRequest;
    }) => shiftApi.updateShift(shiftId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: SHIFT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: SHIFT_KEYS.detail(variables.shiftId),
      });
      toast.success("Shift updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update shift", {
        description: error.message,
      });
    },
  });
};

/**
 * Delete shift by id
 */
export const useDeleteShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shiftId: string) => shiftApi.deleteShift(shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIFT_KEYS.all });
      toast.success("Shift deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete shift", {
        description: error.message,
      });
    },
  });
};

/**
 * Restore shift by id
 */
export const useRestoreShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shiftId: string) => shiftApi.restoreShift(shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIFT_KEYS.all });
      toast.success("Shift restored successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to restore shift", {
        description: error.message,
      });
    },
  });
};

/**
 * Change shift status by id
 */
export const useChangeShiftStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shiftId,
      data,
    }: {
      shiftId: string;
      data: ShiftChangeStatusRequest;
    }) => shiftApi.changeStatusShift(shiftId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: SHIFT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: SHIFT_KEYS.detail(variables.shiftId),
      });

      const status = variables.data.isActive ? "activated" : "deactivated";
      toast.success(`Shift ${status} successfully!`);
    },
    onError: (error: Error) => {
      toast.error("Failed to change shift status", {
        description: error.message,
      });
    },
  });
};

export { SHIFT_KEYS };
