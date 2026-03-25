import { httpClient } from "../httpClient.api";
import type { PaymentDetailResponse } from "./payment.type";
import type { ConfirmPaymentRequest, RefundPaymentRequest } from "./payment.type";
import type { AdminPayment } from "@/types/admin-payment.type";

const BASE_URL = "/api/payments";

const encodeId = (id: string) => encodeURIComponent(id);

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<PaymentDetailResponse | null> => {
  const data = await httpClient.get<unknown, never>({
    url: `${BASE_URL}/order/${encodeId(orderId)}`,
  });
  
  if (Array.isArray(data)) {
    return data[0] || null;
  }
  
  if (data && typeof data === 'object' && 'payment' in data) {
    return data.payment as PaymentDetailResponse;
  }

  return (data as PaymentDetailResponse) || null;
};

export const getPaymentsByCustomerId = async (
  customerId: string,
): Promise<AdminPayment[]> => {
  const data = await httpClient.get<unknown, never>({
    url: `${BASE_URL}/customer/${encodeId(customerId)}`,
  });

  if (Array.isArray(data)) return data;
  
  if (data && typeof data === 'object') {
    const raw = data as Record<string, unknown>;
    if (Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw.items)) return raw.items;
  }
  
  return [];
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
