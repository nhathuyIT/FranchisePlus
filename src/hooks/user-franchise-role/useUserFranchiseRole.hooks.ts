import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as ufrApi from "@/api/user-franchise-role/user-franchise-role.api";
import * as roleApi from "@/api/role/role.api";
import type { UserFranchiseRoleSearchRequest } from "@/api/user-franchise-role/user-franchise-role.type";

// =============================================================================
// Query Keys
// =============================================================================

export const userFranchiseRoleKeys = {
  all: ["userFranchiseRole"] as const,
  lists: () => [...userFranchiseRoleKeys.all, "list"] as const,
  list: (filters: UserFranchiseRoleSearchRequest) =>
    [...userFranchiseRoleKeys.lists(), filters] as const,
  byFranchiseUsers: (franchiseId: string | number) =>
    [...userFranchiseRoleKeys.all, "byFranchiseUsers", franchiseId] as const,
  details: () => [...userFranchiseRoleKeys.all, "detail"] as const,
  detail: (id: number) => [...userFranchiseRoleKeys.details(), id] as const,
  roles: ["roles", "list"] as const,
};

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Search user franchise role assignments with pagination
 */
export const useUserFranchiseRoleSearch = (
  params: UserFranchiseRoleSearchRequest,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: userFranchiseRoleKeys.list(params),
    queryFn: () => ufrApi.search(params),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Fetch all roles for select dropdowns
 * Returns RoleSelectItem[] from /api/roles/select
 */
export const useRoles = () => {
  return useQuery({
    queryKey: userFranchiseRoleKeys.roles,
    queryFn: () => roleApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => data ?? [],
  });
};

/**
 * Get all users by franchise id
 */
export const useUsersByFranchiseId = (
  franchiseId: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: userFranchiseRoleKeys.byFranchiseUsers(franchiseId),
    queryFn: () => ufrApi.getUsersByFranchiseId(franchiseId),
    enabled: options?.enabled ?? true,
  });
};

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Create a new user–franchise–role assignment
 */
export const useCreateUserFranchiseRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ufrApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userFranchiseRoleKeys.lists(),
      });
      toast.success("Role assigned successfully");
    },
    onError: (error) => {
      toast.error("Failed to assign role", { description: error.message });
    },
  });
};

/**
 * Delete (soft-delete) a user–franchise–role assignment
 */
export const useDeleteUserFranchiseRole = (options?: {
  suppressToast?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ufrApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userFranchiseRoleKeys.lists(),
      });
      if (!options?.suppressToast) {
        toast.success("Assignment removed");
      }
    },
    onError: (error) => {
      if (!options?.suppressToast) {
        toast.error("Failed to remove assignment", {
          description: error.message,
        });
      }
    },
  });
};

/**
 * Restore a soft-deleted user–franchise–role assignment
 */
export const useRestoreUserFranchiseRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ufrApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userFranchiseRoleKeys.lists(),
      });
      toast.success("Assignment restored");
    },
    onError: (error) => {
      toast.error("Failed to restore assignment", {
        description: error.message,
      });
    },
  });
};
