import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import * as orderApi from "@/api/order/order.api";

export type OrderStatus = orderApi.ApiOrderStatus;

export interface GetOrdersByCustomerParams {
  customerId: string;
  status?: OrderStatus;
}

export interface GetOrdersByFranchiseParams {
  franchiseId: string;
  status?: OrderStatus;
}

// =============================================================================
// Query Keys
// =============================================================================

export const orderKeys = {
  all: ["order"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  listByFranchise: (params: GetOrdersByFranchiseParams, scopeKey: string) =>
    [...orderKeys.lists(), "franchise", scopeKey, params] as const,
  listByCustomer: (params: GetOrdersByCustomerParams, scopeKey: string) =>
    [...orderKeys.lists(), "customer", scopeKey, params] as const,
  aggregateAllFranchises: (params: { status?: OrderStatus }, scopeKey: string) =>
    [...orderKeys.lists(), "all-franchises", scopeKey, params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string, scopeKey: string) =>
    [...orderKeys.details(), scopeKey, id] as const,
  byCode: (code: string, scopeKey: string) =>
    [...orderKeys.all, "code", scopeKey, code] as const,
  byCart: (cartId: string, scopeKey: string) =>
    [...orderKeys.all, "cart", scopeKey, cartId] as const,
};

// =============================================================================
// Internal Helpers
// =============================================================================

const useOrderScopeKey = () => {
  const authUser = useAuthStore((state) => state.authUser);

  if (!authUser) {
    return "anonymous";
  }

  return `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`;
};

// =============================================================================
// Query Hooks
// =============================================================================

export const useOrderById = (orderId: string, enabled = true) => {
  const scopeKey = useOrderScopeKey();

  return useQuery({
    queryKey: orderKeys.detail(orderId, scopeKey),
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId && enabled,
  });
};

/**
 * Fetch multiple order details by ids (useful to enrich list endpoints
 * that may not return full nested info like franchise/customer names).
 */
export const useOrderDetailQueries = (orderIds: string[], enabled = true) => {
  const scopeKey = useOrderScopeKey();

  return useQueries({
    queries: orderIds.map((orderId) => ({
      queryKey: orderKeys.detail(orderId, scopeKey),
      queryFn: () => orderApi.getOrderById(orderId),
      enabled: !!orderId && enabled,
      staleTime: 60 * 1000,
    })),
  });
};

export const useOrderByCode = (code: string, enabled = true) => {
  const scopeKey = useOrderScopeKey();

  return useQuery({
    queryKey: orderKeys.byCode(code, scopeKey),
    queryFn: () => orderApi.getOrderByCode(code),
    enabled: !!code && enabled,
  });
};

export const useOrderByCartId = (cartId: string, enabled = true) => {
  const scopeKey = useOrderScopeKey();

  return useQuery({
    queryKey: orderKeys.byCart(cartId, scopeKey),
    queryFn: () => orderApi.getOrderByCartId(cartId),
    enabled: !!cartId && enabled,
  });
};

export const useOrdersByCustomerId = (
  params: GetOrdersByCustomerParams,
  enabled = true,
) => {
  const scopeKey = useOrderScopeKey();

  return useQuery({
    queryKey: orderKeys.listByCustomer(params, scopeKey),
    queryFn: () =>
      orderApi.getOrdersByCustomerId(params.customerId, params.status),
    enabled: !!params.customerId && enabled,
  });
};

export const useOrdersByFranchiseId = (
  params: GetOrdersByFranchiseParams,
  enabled = true,
) => {
  const scopeKey = useOrderScopeKey();

  return useQuery({
    queryKey: orderKeys.listByFranchise(params, scopeKey),
    queryFn: () => orderApi.getOrdersForStaffByFranchiseId(params),
    enabled: !!params.franchiseId && enabled,
  });
};

/**
 * Admin helper: fetch orders of ALL franchises by aggregating per-franchise calls.
 * Uses the existing `/api/orders/franchise/:franchiseId` endpoint internally.
 */
export const useOrdersAllFranchises = (params: {
  franchiseIds: string[];
  status?: OrderStatus;
  enabled?: boolean;
}) => {
  const scopeKey = useOrderScopeKey();

  const franchiseKey = params.franchiseIds.join(",");
  const enabled = (params.enabled ?? true) && params.franchiseIds.length > 0;

  return useQuery({
    queryKey: [
      ...orderKeys.aggregateAllFranchises({ status: params.status }, scopeKey),
      franchiseKey,
    ] as const,
    queryFn: async () => {
      const results = await Promise.all(
        params.franchiseIds.map((franchiseId) =>
          orderApi.getOrdersForStaffByFranchiseId({
            franchiseId,
            status: params.status,
          }),
        ),
      );

      return results.flat();
    },
    enabled,
    staleTime: 15 * 1000,
  });
};

// =============================================================================
// Mutation Hooks
// =============================================================================

const invalidateOrderQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  await queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
  await queryClient.invalidateQueries({ queryKey: orderKeys.details() });
};

export const useChangeOrderStatusPreparing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.changeOrderStatusPreparing(orderId),
    onSuccess: async (data) => {
      await invalidateOrderQueries(queryClient);
      toast.success("Order status updated", {
        description: `Order ${data?.code || data?.id || ""} is now PREPARING`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update order status", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
};

export const useChangeOrderStatusReadyForPickup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      orderApi.changeOrderStatusReadyForPickup(orderId),
    onSuccess: async (data) => {
      await invalidateOrderQueries(queryClient);
      toast.success("Order status updated", {
        description: `Order ${data?.code || data?.id || ""} is ready for pickup`,
      });
    },
    onError: (error) => {
      toast.error("Failed to update order status", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
};
