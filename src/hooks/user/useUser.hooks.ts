import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as userApi from "@/api/user/user.api";
import type {
  UserSearchRequest,
  UserCreateRequest,
  UserUpdateRequest,
} from "@/api/user/user.type";
import type { User } from "@/types/user.type";

export const userKeys = {
  all: ["user"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserSearchRequest) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string, scopeKey = "default") =>
    [...userKeys.details(), scopeKey, id] as const,
};

const transformCreateToApi = (
  data: Partial<User> & { password?: string },
): UserCreateRequest => ({
  email: data.email ?? "",
  password: data.password ?? "",
  name: data.name ?? "",
  phone: data.phone ?? "",
  avatarUrl: data.avatarUrl ?? undefined,
});

const transformUpdateToApi = (
  data: Partial<User> & { password?: string },
): UserUpdateRequest => {
  const payload: UserUpdateRequest = {};

  if (data.email !== undefined) payload.email = data.email;
  if (data.password !== undefined) payload.password = data.password;
  if (data.name !== undefined) payload.name = data.name;
  if (data.phone !== undefined) payload.phone = data.phone ?? undefined;
  if (data.avatarUrl !== undefined)
    payload.avatarUrl = data.avatarUrl ?? undefined;

  return payload;
};

export const useUsers = (enabled = true, scopeKey = "default") => {
  const defaultParams: UserSearchRequest = {
    searchCondition: {
      isDeleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100,
    },
  };

  return useQuery({
    queryKey: [...userKeys.lists(), scopeKey],
    queryFn: async () => {
      const response = await userApi.search(defaultParams);
      return response.pageData;
    },
    enabled,
  });
};

export const useUserSearch = (
  params: UserSearchRequest,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await userApi.search(params);
      return response;
    },
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
};

export const useUser = (
  id: string,
  options?: {
    enabled?: boolean;
    scopeKey?: string;
  },
) => {
  const isEnabled = options?.enabled ?? true;
  const scopeKey = options?.scopeKey ?? "default";

  return useQuery({
    queryKey: userKeys.detail(id, scopeKey),
    queryFn: async () => {
      const data = await userApi.getById(id);
      return data;
    },
    enabled: !!id && isEnabled,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User> & { password: string }) => {
      const apiData = transformCreateToApi(data);
      const response = await userApi.create(apiData);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User created", {
        description: `${data?.name} has been created successfully`,
      });
    },
    onError: (error) => {
      toast.error("Failed to create user", {
        description: error.message,
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<User> & { password?: string };
    }) => {
      const apiData = transformUpdateToApi(data);
      const response = await userApi.update(id, apiData);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.details() });
      toast.success("User updated", {
        description: `${data?.name} has been updated successfully`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update user", {
        description: error.message,
      });
    },
  });
};

export const useDeleteUser = (options?: { suppressToast?: boolean }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await userApi.remove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      if (!options?.suppressToast) {
        toast.success("User deleted", {
          description: "The user has been deleted",
        });
      }
    },
    onError: (error) => {
      if (!options?.suppressToast) {
        toast.error("Failed to delete user", {
          description: error.message,
        });
      }
    },
  });
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await userApi.restore(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User restored", {
        description: "The user has been restored",
      });
    },
    onError: (error) => {
      toast.error("Failed to restore user", {
        description: error.message,
      });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await userApi.updateStatus(id, { isActive });
      return { id, isActive };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.details() });
      toast.success("Status updated", {
        description: `User is now ${variables.isActive ? "active" : "inactive"}`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update status", {
        description: error.message,
      });
    },
  });
};
