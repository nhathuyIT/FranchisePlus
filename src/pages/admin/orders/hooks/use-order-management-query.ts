import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ConfirmPaymentPayload,
  DeliverySearchItem,
  FranchiseOrderListItem,
  ReadyForPickupPayload,
  RefundPaymentPayload,
  SearchDeliveriesParams,
  SearchFranchiseOrdersParams,
} from "../models/order-management.type";
import {
  completeDelivery,
  getDeliveryByOrderId,
  pickupDelivery,
  searchDeliveries,
} from "../services/delivery.service";
import {
  confirmPayment,
  getPaymentByOrderId,
  refundPayment,
} from "../services/payment.service";
import {
  getAssignableStaffByFranchise,
  getFranchiseOrders,
  getOrderByCartId,
  getOrderByCode,
  getOrderDetail,
  setOrderPreparing,
  setOrderReadyForPickup,
} from "../services/order.service";
import { normalizeOrderStatus } from "../utils/order-management.utils";

export const orderManagementKeys = {
  all: ["admin-order-management"] as const,
  lists: () => [...orderManagementKeys.all, "list"] as const,
  list: (params: SearchFranchiseOrdersParams) =>
    [...orderManagementKeys.lists(), params.franchiseId, params.status || "all"] as const,
  staffList: (params: SearchDeliveriesParams) =>
    [
      ...orderManagementKeys.lists(),
      "staff",
      params.franchiseId || "all-franchises",
      params.staffId || "all-staff",
      params.status || "all",
    ] as const,
  details: () => [...orderManagementKeys.all, "detail"] as const,
  detail: (orderId: string) => [...orderManagementKeys.details(), orderId] as const,
  byCart: (cartId: string) => [...orderManagementKeys.all, "cart", cartId] as const,
  byCode: (code: string) => [...orderManagementKeys.all, "code", code] as const,
  deliveries: () => [...orderManagementKeys.all, "delivery"] as const,
  deliveryByOrder: (orderId: string) =>
    [...orderManagementKeys.deliveries(), orderId] as const,
  payments: () => [...orderManagementKeys.all, "payment"] as const,
  paymentByOrder: (orderId: string) =>
    [...orderManagementKeys.payments(), orderId] as const,
  staff: () => [...orderManagementKeys.all, "staff"] as const,
  staffByFranchise: (franchiseId: string) =>
    [...orderManagementKeys.staff(), franchiseId] as const,
};

const invalidateOrderManagement = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  await queryClient.invalidateQueries({
    queryKey: orderManagementKeys.all,
  });
};

const mapDeliverySearchItemToOrderListItem = (
  delivery: DeliverySearchItem,
  order: Awaited<ReturnType<typeof getOrderDetail>>,
): FranchiseOrderListItem => {
  if (order) {
    return {
      id: order.id,
      customerId: order.customerId || delivery.customerId || undefined,
      customerName: order.customerName || delivery.customerName || undefined,
      code: order.code,
      status: order.status,
      phone: order.customerPhone || order.phone || delivery.customerPhone || "",
      subtotalAmount: order.subtotalAmount,
      finalAmount: order.finalAmount,
      createdAt: order.createdAt || delivery.createdAt || "",
    };
  }

  return {
    id: delivery.orderId,
    customerId: delivery.customerId || undefined,
    customerName: delivery.customerName || undefined,
    code: delivery.orderCode || delivery.orderId,
    status: normalizeOrderStatus(delivery.status),
    phone: delivery.customerPhone || "",
    subtotalAmount: 0,
    finalAmount: 0,
    createdAt: delivery.createdAt || "",
  };
};

export const useOrderByCartQuery = (cartId: string, enabled = true) =>
  useQuery({
    queryKey: orderManagementKeys.byCart(cartId),
    queryFn: () => getOrderByCartId(cartId),
    enabled: !!cartId && enabled,
  });

export const useFranchiseOrdersQuery = (
  params: SearchFranchiseOrdersParams,
  enabled = true,
) =>
  useQuery({
    queryKey: orderManagementKeys.list(params),
    queryFn: () => getFranchiseOrders(params),
    enabled: !!params.franchiseId && enabled,
  });

export const useStaffDeliveryOrdersQuery = (
  params: SearchDeliveriesParams,
  enabled = true,
) =>
  useQuery({
    queryKey: orderManagementKeys.staffList(params),
    queryFn: async () => {
      const deliveries = await searchDeliveries(params);
      const uniqueDeliveries = Array.from(
        new Map(
          deliveries
            .filter((delivery) => delivery.orderId)
            .map((delivery) => [delivery.orderId, delivery]),
        ).values(),
      );

      const orders = await Promise.all(
        uniqueDeliveries.map(async (delivery) => {
          const order = await getOrderDetail(delivery.orderId);
          return mapDeliverySearchItemToOrderListItem(delivery, order);
        }),
      );

      return orders;
    },
    enabled: !!params.staffId && enabled,
  });

export const useOrderDetailQuery = (orderId: string, enabled = true) =>
  useQuery({
    queryKey: orderManagementKeys.detail(orderId),
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId && enabled,
  });

export const useOrderByCodeQuery = (code: string, enabled = true) =>
  useQuery({
    queryKey: orderManagementKeys.byCode(code),
    queryFn: () => getOrderByCode(code),
    enabled: !!code && enabled,
  });

export const useOrderDeliveryQuery = (orderId: string, enabled = true) =>
  useQuery({
    queryKey: orderManagementKeys.deliveryByOrder(orderId),
    queryFn: () => getDeliveryByOrderId(orderId),
    enabled: !!orderId && enabled,
  });

export const useOrderPaymentQuery = (orderId: string, enabled = true) =>
  useQuery({
    queryKey: orderManagementKeys.paymentByOrder(orderId),
    queryFn: () => getPaymentByOrderId(orderId),
    enabled: !!orderId && enabled,
  });

export const useFranchiseDeliveryStaffQuery = (
  franchiseId: string,
  enabled = true,
) =>
  useQuery({
    queryKey: orderManagementKeys.staffByFranchise(franchiseId),
    queryFn: () => getAssignableStaffByFranchise(franchiseId),
    enabled: !!franchiseId && enabled,
    staleTime: 5 * 60 * 1000,
  });

export const useSetOrderPreparingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => setOrderPreparing(orderId),
    onSuccess: async () => {
      await invalidateOrderManagement(queryClient);
      toast.success("Order moved to preparing");
    },
    onError: (error: Error) => {
      toast.error("Failed to update order", {
        description: error.message,
      });
    },
  });
};

export const useSetOrderReadyForPickupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: ReadyForPickupPayload;
    }) => setOrderReadyForPickup(orderId, payload),
    onSuccess: async () => {
      await invalidateOrderManagement(queryClient);
      toast.success("Order is ready for pickup");
    },
    onError: (error: Error) => {
      toast.error("Failed to assign delivery staff", {
        description: error.message,
      });
    },
  });
};

export const usePickupDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) => pickupDelivery(deliveryId),
    onSuccess: async () => {
      await invalidateOrderManagement(queryClient);
      toast.success("Delivery picked up");
    },
    onError: (error: Error) => {
      toast.error("Failed to update delivery", {
        description: error.message,
      });
    },
  });
};

export const useCompleteDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) => completeDelivery(deliveryId),
    onSuccess: async () => {
      await invalidateOrderManagement(queryClient);
      toast.success("Delivery completed");
    },
    onError: (error: Error) => {
      toast.error("Failed to complete delivery", {
        description: error.message,
      });
    },
  });
};

export const useConfirmOrderPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      payload,
    }: {
      paymentId: string;
      payload: ConfirmPaymentPayload;
    }) => confirmPayment(paymentId, payload),
    onSuccess: async () => {
      await invalidateOrderManagement(queryClient);
      toast.success("Payment confirmed");
    },
    onError: (error: Error) => {
      toast.error("Failed to confirm payment", {
        description: error.message,
      });
    },
  });
};

export const useRefundOrderPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      payload,
    }: {
      paymentId: string;
      payload: RefundPaymentPayload;
    }) => refundPayment(paymentId, payload),
    onSuccess: async () => {
      await invalidateOrderManagement(queryClient);
      toast.success("Payment refunded");
    },
    onError: (error: Error) => {
      toast.error("Failed to refund payment", {
        description: error.message,
      });
    },
  });
};
