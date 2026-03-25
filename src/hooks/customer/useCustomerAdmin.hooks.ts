import { useMemo } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as customerAdminApi from "@/api/customer/customer-admin.api";
import type { CustomerSearchRequest } from "@/api/customer/customer-admin.type";

// =============================================================================
// Query Keys
// =============================================================================

export const customerAdminKeys = {
  all: ["customerAdmin"] as const,
  lists: () => [...customerAdminKeys.all, "list"] as const,
  list: (filters: CustomerSearchRequest) =>
    [...customerAdminKeys.lists(), filters] as const,
  finds: () => [...customerAdminKeys.all, "find"] as const,
  find: (keyword: string) => [...customerAdminKeys.finds(), keyword] as const,
  details: () => [...customerAdminKeys.all, "detail"] as const,
  detail: (id: string) => [...customerAdminKeys.details(), id] as const,
};

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Search customers with pagination
 */
export const useCustomerAdminSearch = (params: CustomerSearchRequest) => {
  return useQuery({
    queryKey: customerAdminKeys.list(params),
    queryFn: () => customerAdminApi.search(params),
  });
};

export const useCustomerSearch = (
  params: CustomerSearchRequest,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: customerAdminKeys.list(params),
    queryFn: async () => {
      const response = await customerAdminApi.search(params);
      return response;
    },
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
};

export const useCustomerByKeyword = (
  keyword: string,
  options?: { enabled?: boolean },
) => {
  const normalizedKeyword = keyword.trim();

  return useQuery({
    queryKey: customerAdminKeys.find(normalizedKeyword),
    queryFn: () => customerAdminApi.getCustomerByKeyword(normalizedKeyword),
    enabled: !!normalizedKeyword && (options?.enabled ?? true),
    placeholderData: keepPreviousData,
  });
};

/**
 * Fetch single customer by ID
 */
export const useCustomerAdmin = (id: string, enabled = true) => {
  return useQuery({
    queryKey: customerAdminKeys.detail(id),
    queryFn: () => customerAdminApi.getById(id),
    enabled: !!id && enabled,
  });
};

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Update customer info
 */
export const useUpdateCustomerAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof customerAdminApi.update>[1];
    }) => customerAdminApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerAdminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerAdminKeys.details() });
      toast.success("Customer updated", {
        description: `${data?.name} has been updated successfully`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update customer", {
        description: error.message,
      });
    },
  });
};

/**
 * Soft-delete customer
 */
export const useDeleteCustomerAdmin = (options?: {
  suppressToast?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerAdminApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerAdminKeys.lists() });
      if (!options?.suppressToast) {
        toast.success("Customer deleted");
      }
    },
    onError: (error) => {
      if (!options?.suppressToast) {
        toast.error("Failed to delete customer", {
          description: error.message,
        });
      }
    },
  });
};

/**
 * Restore soft-deleted customer
 */
export const useRestoreCustomerAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerAdminApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerAdminKeys.lists() });
      toast.success("Customer restored");
    },
    onError: (error) => {
      toast.error("Failed to restore customer", {
        description: error.message,
      });
    },
  });
};

/**
 * Update customer active/inactive status
 */
export const useUpdateCustomerAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      customerAdminApi.updateStatus(id, { isActive }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerAdminKeys.lists() });
      toast.success("Status updated", {
        description: `Customer is now ${variables.isActive ? "active" : "inactive"}`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update status", {
        description: error.message,
      });
    },
  });
};

/**
 * Fetch multiple customer details by IDs.
 * Useful for enriching list rows with customer names.
 */
export const useCustomerAdminDetailQueries = (
  ids: string[],
  enabled = true,
) => {
  const uniqueIds = useMemo(
    () => Array.from(new Set(ids.filter((id) => Boolean(id)))),
    [ids],
  );

  return useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: customerAdminKeys.detail(id),
      queryFn: () => customerAdminApi.getById(id),
      enabled: enabled && Boolean(id),
    })),
  });
};
