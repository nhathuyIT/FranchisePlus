import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import * as userApi from "@/api/user/user.api";
import type {
  UserSearchRequest,
  UserCreateRequest,
  PageInfoResponse,
} from "@/api/user/user.type";
import type { Customer } from "@/types/customer";
import type { User } from "@/types/user.type";
import { invalidateQueries } from "@/lib/tanstack-helpers";

/**
 * Map User (camelCase from API) → Customer (UI type)
 */
const mapUserToCustomer = (user: User): Customer => ({
  id: user.id as unknown as Customer["id"],
  name: user.name,
  phone: user.phone ?? "",
  email: user.email || null,
  avatarUrl: user.avatarUrl || null,
  isActive: user.isActive,
  isDeleted: user.isDeleted,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
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
      params.searchCondition.isActive,
      params.searchCondition.isDeleted,
      params.pageInfo.pageNum,
      params.pageInfo.pageSize,
    ],
    queryFn: async () => {
      const res = await userApi.search(params);
      return {
        users: res.pageData.map(mapUserToCustomer),
        pageInfo: res.pageInfo,
      };
    },
    placeholderData: keepPreviousData,
  });
};

export type UseSearchUsersResult = {
  users: Customer[];
  pageInfo: PageInfoResponse;
};

/**
 * Hook to create a new user
 * Automatically invalidates the search query on success
 */
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: UserCreateRequest) => userApi.create(data),
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
