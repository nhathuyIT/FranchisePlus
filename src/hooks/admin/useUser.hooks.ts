import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import * as userApi from "@/api/user/user.api";
import type {
  UserSearchRequest,
  UserSearchItem,
  CreateUserRequest,
} from "@/types/user.type";
import type { ApiPaginatedResponse } from "@/api/http.type";
import type { Customer } from "@/types/customer";
import { invalidateQueries } from "@/lib/tanstack-helpers";

/**
 * Map UserSearchItem (snake_case from API) → Customer (camelCase for UI)
 */
const mapUserToCustomer = (user: UserSearchItem): Customer => ({
  id: user.id as unknown as Customer["id"],
  name: user.name,
  phone: user.phone,
  email: user.email || null,
  avatarUrl: user.avatar_url || null,
  isActive: user.is_active,
  isDeleted: user.is_deleted,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});

/**
 * Hook to search users with pagination
 *
 * @example
 * const { data, isLoading, error } = useSearchUsers({
 *   searchCondition: { keyword: "", is_active: "", is_deleted: false },
 *   pageInfo: { pageNum: 1, pageSize: 10 },
 * });
 */
export const useSearchUsers = (params: UserSearchRequest) => {
  return useQuery({
    queryKey: [
      "users",
      "search",
      params.searchCondition.keyword,
      params.searchCondition.is_active,
      params.searchCondition.is_deleted,
      params.pageInfo.pageNum,
      params.pageInfo.pageSize,
    ],
    queryFn: async () => {
      const res = await userApi.searchUsers(params);
      return {
        users: res.data.map(mapUserToCustomer),
        pageInfo: res.pageInfo,
      };
    },
    placeholderData: keepPreviousData,
  });
};

export type UseSearchUsersResult = {
  users: Customer[];
  pageInfo: ApiPaginatedResponse<UserSearchItem>["pageInfo"];
};

/**
 * Hook to create a new user
 * Automatically invalidates the search query on success
 */
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
    onSuccess: () => {
      toast.success("User created successfully!");
      invalidateQueries(["users", "search"]);
    },
    onError: (error) => {
      toast.error("Failed to create user", {
        description:
          error.message || "Please check your information and try again",
      });
    },
  });
};
