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

export const franchiseKeys = {
  all: ["franchise"] as const,
  lists: () => [...franchiseKeys.all, "list"] as const,
  list: (filters: FranchiseSearchRequest) => [...franchiseKeys.lists(), filters] as const,
  details: () => [...franchiseKeys.all, "detail"] as const,
  detail: (id: string, scopeKey = "default") =>
    [...franchiseKeys.details(), scopeKey, id] as const,
  select: () => [...franchiseKeys.all, "select"] as const,
};

const transformCreateToApi = (data: Partial<Franchise>): FranchiseCreateRequest => ({
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

const useFranchiseScopeKey = () => {
  const authUser = useAuthStore((state) => state.authUser);

  if (!authUser) {
    return "anonymous";
  }

  return `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`;
};

const transformUpdateToApi = (data: Partial<Franchise>): FranchiseUpdateRequest => {
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

export const useFranchiseSelect = () => {
  const scopeKey = useFranchiseScopeKey();

  return useQuery({
    queryKey: [...franchiseKeys.select(), scopeKey],
    queryFn: async () => {
      const data = await franchiseApi.getSelect();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useFranchises = (enabled = true, scopeKey = "default") => {
  const defaultParams: FranchiseSearchRequest = {
    searchCondition: {
      isDeleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100,
    },
  };

  return useQuery({
    queryKey: [...franchiseKeys.lists(), scopeKey],
    queryFn: async () => {
      const response = await franchiseApi.search(defaultParams);
      return response.pageData;
    },
    enabled,
  });
};

export const useFranchiseSearch = (params: FranchiseSearchRequest) => {
  return useQuery({
    queryKey: franchiseKeys.list(params),
    queryFn: async () => {
      const response = await franchiseApi.search(params);
      return response;
    },
  });
};

export const useFranchise = (
  id: string,
  options?: {
    enabled?: boolean;
    scopeKey?: string;
  }
) => {
  const isEnabled = options?.enabled ?? true;
  const scopeKey = options?.scopeKey ?? "default";

  return useQuery({
    queryKey: franchiseKeys.detail(id, scopeKey),
    queryFn: async () => {
      const data = await franchiseApi.getById(id);
      return data;
    },
    enabled: !!id && isEnabled,
  });
};

export const useCreateFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Franchise>) => {
      const apiData = transformCreateToApi(data);
      const response = await franchiseApi.create(apiData);
      return response;
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

export const useUpdateFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Franchise> }) => {
      const apiData = transformUpdateToApi(data);
      const response = await franchiseApi.update(id, apiData);
      return response;
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
