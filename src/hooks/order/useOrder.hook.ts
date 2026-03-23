import { useQuery } from "@tanstack/react-query";
import * as orderApi from "@/api/order/order.api";
import type { AdminOrderStatus } from "@/api/order/order.api";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  byFranchise: (params: { franchiseId: string; status?: AdminOrderStatus }) =>
    [...ORDER_KEYS.lists(), "franchise", params] as const,
  byCustomer: (customerId: string) =>
    [...ORDER_KEYS.lists(), "customer", customerId] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (orderId: string) => [...ORDER_KEYS.details(), orderId] as const,
  byCode: (code: string) => [...ORDER_KEYS.all, "code", code] as const,
};

export const useOrdersByFranchiseQuery = (
  params: { franchiseId: string; status?: AdminOrderStatus },
  enabled = true,
) => {
  return useQuery({
    queryKey: ORDER_KEYS.byFranchise(params),
    queryFn: () => orderApi.getOrdersByFranchise(params),
    enabled: !!params.franchiseId && enabled,
  });
};

export const useOrdersByCustomerQuery = (
  customerId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ORDER_KEYS.byCustomer(customerId),
    queryFn: () => orderApi.getOrdersByCustomer(customerId),
    enabled: !!customerId && enabled,
  });
};

export const useOrderByIdQuery = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId && enabled,
  });
};

export const useOrderByCodeQuery = (code: string, enabled = true) => {
  return useQuery({
    queryKey: ORDER_KEYS.byCode(code),
    queryFn: () => orderApi.getOrderByCode(code),
    enabled: !!code && enabled,
  });
};
