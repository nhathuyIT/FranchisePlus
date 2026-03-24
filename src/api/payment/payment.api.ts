import { httpClient } from "../httpClient.api";
import type { PaymentDetailResponse } from "./payment.type";
import type { ConfirmPaymentRequest, RefundPaymentRequest } from "./payment.type";
import type { AdminPayment } from "@/types/admin-payment.type";

const BASE_URL = "/api/payments";

const encodeId = (id: string) => encodeURIComponent(id);

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<PaymentDetailResponse | null> => {
  return httpClient.get<PaymentDetailResponse, never>({
    url: `${BASE_URL}/order/${encodeId(orderId)}`,
  });
};

export const getPaymentsByCustomerId = async (
  customerId: string,
): Promise<AdminPayment[]> => {
  const response = await httpClient.get<AdminPayment[], never>({
    url: `${BASE_URL}/customer/${encodeId(customerId)}`,
  });

  return response || [];
};

export const getPaymentByCode = async (
  code: string,
): Promise<PaymentDetailResponse | null> => {
  return httpClient.get<PaymentDetailResponse, { code: string }>({
    url: `${BASE_URL}/code`,
    params: { code },
  });
};

export const getPaymentById = async (
  paymentId: string,
): Promise<PaymentDetailResponse | null> => {
  return httpClient.get<PaymentDetailResponse, never>({
    url: `${BASE_URL}/${encodeId(paymentId)}`,
  });
};

export const confirmPayment = async (
  paymentId: string,
  data: ConfirmPaymentRequest,
): Promise<PaymentDetailResponse | null> => {
  return httpClient.putRaw<PaymentDetailResponse, ConfirmPaymentRequest>({
    url: `${BASE_URL}/${encodeId(paymentId)}/confirm`,
    data,
  });
};

export const getPaymentsByFranchiseId = async (
  franchiseId: string,
  status?: string,
): Promise<AdminPayment[]> => {
  const response = await httpClient.get<AdminPayment[], { status?: string }>({
    url: `${BASE_URL}/franchise/${encodeId(franchiseId)}`,
    params: { status },
  });

  return response || [];
};

export const refundPayment = async (
  paymentId: string,
  data: RefundPaymentRequest,
): Promise<PaymentDetailResponse | null> => {
  return httpClient.put<PaymentDetailResponse, { refund_reason: string }>({
    url: `${BASE_URL}/${encodeId(paymentId)}/refund`,
    data: {
      refund_reason: data.refundReason,
    },
  });
};
