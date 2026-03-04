import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as franchiseApi from "@/api/franchise/franchise.api";
import { useAuthStore } from "@/stores/auth-store";
import type {
  FranchiseSearchRequest,
  FranchiseCreateRequest,
  FranchiseUpdateRequest,
} from "@/api/franchise/franchise.type";
import type { Franchise } from "@/types/franchise";

// =============================================================================
// Query Keys
// =============================================================================

export const franchiseKeys = {
  all: ["franchise"] as const,
  lists: () => [...franchiseKeys.all, "list"] as const,
  list: (filters: FranchiseSearchRequest) =>
    [...franchiseKeys.lists(), filters] as const,
  details: () => [...franchiseKeys.all, "detail"] as const,
  detail: (id: string, scopeKey = "default") =>
    [...franchiseKeys.details(), scopeKey, id] as const,
  select: () => [...franchiseKeys.all, "select"] as const,
};

// =============================================================================
// Internal Helpers
// =============================================================================

/**
 * Generate scope key based on current auth context
 * Ensures cache isolation between different user/role/franchise contexts
 */
const useFranchiseScopeKey = () => {
  const authUser = useAuthStore((state) => state.authUser);

  if (!authUser) {
    return "anonymous";
  }

  return `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`;
};

/**
 * Transform Partial<Franchise> to FranchiseCreateRequest
 */
const toCreateRequest = (data: Partial<Franchise>): FranchiseCreateRequest => ({
  code: data.code ?? "",
  name: data.name ?? "",
  hotline: data.hotline,
  logoUrl: data.logoUrl,
  address: data.address ?? "",
  openedAt: data.openedAt,
  closedAt: data.closedAt,
  lat: data.lat,
  lng: data.lng,
});

/**
 * Transform Partial<Franchise> to FranchiseUpdateRequest
 * Only includes defined fields
 */
const toUpdateRequest = (data: Partial<Franchise>): FranchiseUpdateRequest => {
  const payload: FranchiseUpdateRequest = {};

  if (data.code !== undefined) payload.code = data.code;
  if (data.name !== undefined) payload.name = data.name;
  if (data.hotline !== undefined) payload.hotline = data.hotline;
  if (data.logoUrl !== undefined) payload.logoUrl = data.logoUrl;
  if (data.address !== undefined) payload.address = data.address;
  if (data.openedAt !== undefined) payload.openedAt = data.openedAt;
  if (data.closedAt !== undefined) payload.closedAt = data.closedAt;
  if (data.lat !== undefined) payload.lat = data.lat;
  if (data.lng !== undefined) payload.lng = data.lng;

  return payload;
};

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Fetch franchise options for select/dropdown
 */
export const useFranchiseSelect = () => {
  const scopeKey = useFranchiseScopeKey();

  return useQuery({
    queryKey: [...franchiseKeys.select(), scopeKey],
    queryFn: () => franchiseApi.getSelect(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Search franchises with pagination
 *
 * @param params - Search parameters (optional, defaults to non-deleted with pagination)
 * @param options - Query options
 */
export const useFranchiseSearch = (
  params?: Partial<FranchiseSearchRequest>,
  options?: { enabled?: boolean; scopeKey?: string }
) => {
  const defaultScopeKey = useFranchiseScopeKey();
  const scopeKey = options?.scopeKey ?? defaultScopeKey;

  const searchParams: FranchiseSearchRequest = {
    searchCondition: {
      isDeleted: false,
      ...params?.searchCondition,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100,
      ...params?.pageInfo,
    },
  };

  return useQuery({
    queryKey: [...franchiseKeys.list(searchParams), scopeKey],
    queryFn: () => franchiseApi.search(searchParams),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Fetch all franchises (convenience wrapper for useFranchiseSearch)
 *
 * Returns flattened `data: Franchise[]` for simple use cases.
 * Use `useFranchiseSearch` directly when you need pagination info.
 *
 * @param enabled - Whether to enable the query (default: true)
 * @param scopeKey - Cache scope key for isolation (default: "default")
 */
export const useFranchises = (enabled = true, scopeKey = "default") => {
  const searchResult = useFranchiseSearch(
    {
      searchCondition: { isDeleted: false },
      pageInfo: { pageNum: 1, pageSize: 100 },
    },
    { enabled, scopeKey }
  );

  return {
    ...searchResult,
    data: searchResult.data?.pageData ?? [],
  };
};

/**
 * Fetch single franchise by ID
 */
export const useFranchise = (
  id: string,
  options?: {
    enabled?: boolean;
    scopeKey?: string;
  }
) => {
  const defaultScopeKey = useFranchiseScopeKey();
  const isEnabled = options?.enabled ?? true;
  const scopeKey = options?.scopeKey ?? defaultScopeKey;

  return useQuery({
    queryKey: franchiseKeys.detail(id, scopeKey),
    queryFn: () => franchiseApi.getById(id),
    enabled: !!id && isEnabled,
  });
};

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Create new franchise
 */
export const useCreateFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Franchise>) => {
      const apiData = toCreateRequest(data);
      return franchiseApi.create(apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.select() });
      toast.success("Franchise created", {
        description: `${data?.name} has been created successfully`,
      });
    },
    onError: (error) => {
      toast.error("Failed to create franchise", {
        description: error.message,
      });
    },
  });
};

/**
 * Update existing franchise
 */
export const useUpdateFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Franchise> }) => {
      const apiData = toUpdateRequest(data);
      return franchiseApi.update(id, apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.details() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.select() });
      toast.success("Franchise updated", {
        description: `${data?.name} has been updated successfully`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update franchise", {
        description: error.message,
      });
    },
  });
};

/**
 * Delete franchise (soft delete)
 */
export const useDeleteFranchise = (options?: { suppressToast?: boolean }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await franchiseApi.remove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.select() });
      if (!options?.suppressToast) {
        toast.success("Franchise deleted", {
          description: "The franchise has been deleted",
        });
      }
    },
    onError: (error) => {
      if (!options?.suppressToast) {
        toast.error("Failed to delete franchise", {
          description: error.message,
        });
      }
    },
  });
};

/**
 * Restore deleted franchise
 */
export const useRestoreFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await franchiseApi.restore(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.select() });
      toast.success("Franchise restored", {
        description: "The franchise has been restored",
      });
    },
    onError: (error) => {
      toast.error("Failed to restore franchise", {
        description: error.message,
      });
    },
  });
};

/**
 * Update franchise active status
 */
export const useUpdateFranchiseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await franchiseApi.updateStatus(id, { isActive });
      return { id, isActive };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.details() });
      toast.success("Status updated", {
        description: `Franchise is now ${variables.isActive ? "active" : "inactive"}`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update status", {
        description: error.message,
      });
    },
  });
};
