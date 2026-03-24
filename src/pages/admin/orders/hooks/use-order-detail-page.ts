import { useMemo } from "react";
import type {
  ConfirmPaymentPayload,
  ReadyForPickupPayload,
} from "../models/order-management.type";
import {
  useCompleteDeliveryMutation,
  useConfirmOrderPaymentMutation,
  useOrderDeliveryQuery,
  useOrderDetailQuery,
  useOrderPaymentQuery,
  usePickupDeliveryMutation,
  useSetOrderPreparingMutation,
  useSetOrderReadyForPickupMutation,
} from "./use-order-management-query";

const isDeliveryNotFoundError = (error: unknown) =>
  error instanceof Error &&
  error.message.toLowerCase().includes("delivery not found by order id");

export const useOrderDetailPage = (orderId?: string | null) => {
  const normalizedOrderId = orderId || "";
  const orderQuery = useOrderDetailQuery(normalizedOrderId, !!normalizedOrderId);
  const deliveryQuery = useOrderDeliveryQuery(normalizedOrderId, !!normalizedOrderId);
  const paymentQuery = useOrderPaymentQuery(normalizedOrderId, !!normalizedOrderId);

  const prepareMutation = useSetOrderPreparingMutation();
  const readyForPickupMutation = useSetOrderReadyForPickupMutation();
  const pickupMutation = usePickupDeliveryMutation();
  const completeMutation = useCompleteDeliveryMutation();
  const confirmPaymentMutation = useConfirmOrderPaymentMutation();

  const order = orderQuery.data ?? null;
  const isMissingDelivery = isDeliveryNotFoundError(deliveryQuery.error);
  const deliveryError =
    deliveryQuery.error instanceof Error && !isMissingDelivery
      ? deliveryQuery.error
      : null;
  const delivery = isMissingDelivery ? null : (deliveryQuery.data ?? null);
  const payment = paymentQuery.data ?? null;
  const deliveryId = order?.deliveryId || delivery?.id || "";
  const deliveryEmptyMessage = isMissingDelivery
    ? "This order has not been assigned to delivery yet."
    : "Delivery information has not been created yet for this order.";

  const canMoveToPreparing = order?.status === "CONFIRMED";
  const canReadyForPickup = order?.status === "PREPARING";
  const canPickupDelivery = order?.status === "READY_FOR_PICKUP" && !!deliveryId;
  const canCompleteDelivery = order?.status === "OUT_FOR_DELIVERY" && !!deliveryId;
  const canConfirmPayment = payment?.status === "PENDING";

  const deliveryActionMessage = useMemo(() => {
    if (!order) return "";

    if (
      (order.status === "READY_FOR_PICKUP" || order.status === "OUT_FOR_DELIVERY") &&
      !deliveryId
    ) {
      return "Delivery ID is missing, so the final delivery actions are blocked.";
    }

    return "";
  }, [deliveryId, order]);

  const isMutating =
    prepareMutation.isPending ||
    readyForPickupMutation.isPending ||
    pickupMutation.isPending ||
    completeMutation.isPending ||
    confirmPaymentMutation.isPending;

  const refetchAll = async () => {
    await Promise.all([
      orderQuery.refetch(),
      deliveryQuery.refetch(),
      paymentQuery.refetch(),
    ]);
  };

  const handleMoveToPreparing = async () => {
    if (!normalizedOrderId || !canMoveToPreparing) return;
    await prepareMutation.mutateAsync(normalizedOrderId);
  };

  const handleReadyForPickup = async (payload: ReadyForPickupPayload) => {
    if (!normalizedOrderId || !canReadyForPickup) return;
    await readyForPickupMutation.mutateAsync({
      orderId: normalizedOrderId,
      payload,
    });
  };

  const handlePickupDelivery = async () => {
    if (!deliveryId || !canPickupDelivery) return;
    await pickupMutation.mutateAsync(deliveryId);
  };

  const handleCompleteDelivery = async () => {
    if (!deliveryId || !canCompleteDelivery) return;
    await completeMutation.mutateAsync(deliveryId);
  };

  const handleConfirmPayment = async (payload: ConfirmPaymentPayload) => {
    if (!payment?.id || !canConfirmPayment) return;
    await confirmPaymentMutation.mutateAsync({
      paymentId: payment.id,
      payload,
    });
  };

  return {
    orderQuery,
    deliveryQuery,
    paymentQuery,
    order,
    delivery,
    deliveryError,
    deliveryEmptyMessage,
    payment,
    deliveryId,
    isMutating,
    deliveryActionMessage,
    canMoveToPreparing,
    canReadyForPickup,
    canPickupDelivery,
    canCompleteDelivery,
    canConfirmPayment,
    handleMoveToPreparing,
    handleReadyForPickup,
    handlePickupDelivery,
    handleCompleteDelivery,
    handleConfirmPayment,
    refetchAll,
  };
};
