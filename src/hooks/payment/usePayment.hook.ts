import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as paymentApi from "@/api/payment/payment.api";
import type {
  ConfirmPaymentRequest,
  RefundPaymentRequest,
} from "@/api/payment/payment.type";

export const paymentKeys = {
  all: ["payments"] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  byCode: (code: string) => [...paymentKeys.all, "code", code] as const,
  byOrder: (orderId: string) => [...paymentKeys.all, "order", orderId] as const,
  byCustomer: (customerId: string) =>
    [...paymentKeys.all, "customer", customerId] as const,
  byFranchise: (franchiseId: string, status?: string) =>
    [...paymentKeys.all, "franchise", franchiseId, status] as const,
};

export const usePaymentById = (paymentId: string, enabled = true) => {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => paymentApi.getPaymentById(paymentId),
    enabled: !!paymentId && enabled,
  });
};

export const usePaymentByCode = (code: string, enabled = true) => {
  return useQuery({
    queryKey: paymentKeys.byCode(code),
    queryFn: () => paymentApi.getPaymentByCode(code),
    enabled: !!code && enabled,
  });
};

export const usePaymentByOrderId = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: paymentKeys.byOrder(orderId),
    queryFn: () => paymentApi.getPaymentByOrderId(orderId),
    enabled: !!orderId && enabled,
  });
};

export const usePaymentsByCustomerId = (
  customerId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: paymentKeys.byCustomer(customerId),
    queryFn: () => paymentApi.getPaymentsByCustomerId(customerId),
    enabled: !!customerId && enabled,
  });
};

export const usePaymentsByFranchiseId = (
  franchiseId: string,
  status?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: paymentKeys.byFranchise(franchiseId, status),
    queryFn: () => paymentApi.getPaymentsByFranchiseId(franchiseId, status),
    enabled: !!franchiseId && enabled,
  });
};

export const useConfirmPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      data,
    }: {
      paymentId: string;
      data: ConfirmPaymentRequest;
    }) => paymentApi.confirmPayment(paymentId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      if (response?.id) {
        queryClient.setQueryData(paymentKeys.detail(response.id), response);
      } else {
        queryClient.invalidateQueries({
          queryKey: paymentKeys.detail(variables.paymentId),
        });
      }

      toast.success("Payment confirmed successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to confirm payment", {
        description: error.message,
      });
    },
  });
};

export const useRefundPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      data,
    }: {
      paymentId: string;
      data: RefundPaymentRequest;
    }) => paymentApi.refundPayment(paymentId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      if (response?.id) {
        queryClient.setQueryData(paymentKeys.detail(response.id), response);
      } else {
        queryClient.invalidateQueries({
          queryKey: paymentKeys.detail(variables.paymentId),
        });
      }

      toast.success("Payment refunded successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to refund payment", {
        description: error.message,
      });
    },
  });
};
