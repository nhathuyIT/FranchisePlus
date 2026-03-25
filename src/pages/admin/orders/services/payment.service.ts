import { httpClient } from "@/api/httpClient.api";
import type {
  ConfirmPaymentPayload,
  PaymentDetail,
  RefundPaymentPayload,
} from "../models/order-management.type";
import { normalizePaymentStatus } from "../utils/order-management.utils";
import {
  extractSingle,
  toBooleanValue,
  toNumberValue,
  toRecord,
  toStringValue,
} from "./service.utils";

const BASE_PAYMENT_URL = "/api/payments";

const normalizePaymentDetail = (raw: unknown): PaymentDetail | null => {
  const record = toRecord(raw);
  if (!record) return null;

  const id = toStringValue(record.id);
  if (!id) {
    return null;
  }

  return {
    id,
    franchiseId: toStringValue(record.franchiseId),
    customerId: toStringValue(record.customerId),
    orderId: toStringValue(record.orderId),
    code: toStringValue(record.code, id),
    method: toStringValue(record.method, "CASH"),
    status: normalizePaymentStatus(toStringValue(record.status)),
    amount: toNumberValue(record.amount),
    providerTxnId: toStringValue(record.providerTxnId) || undefined,
    refundReason: toStringValue(record.refundReason) || undefined,
    refundedAt: toStringValue(record.refundedAt) || undefined,
    isActive: toBooleanValue(record.isActive, true),
    isDeleted: toBooleanValue(record.isDeleted),
    createdAt: toStringValue(record.createdAt),
    updatedAt: toStringValue(record.updatedAt),
    paidAt: toStringValue(record.paidAt) || undefined,
    version: toNumberValue(record.version) || undefined,
  };
};

export const getPaymentByOrderId = async (orderId: string) => {
  const response = await httpClient.get<unknown, never>({
    url: `${BASE_PAYMENT_URL}/order/${encodeURIComponent(orderId)}`,
  });

  return normalizePaymentDetail(extractSingle(response));
};

export const confirmPayment = async (
  paymentId: string,
  payload: ConfirmPaymentPayload,
) => {
  const response = await httpClient.put<unknown, ConfirmPaymentPayload>({
    url: `${BASE_PAYMENT_URL}/${encodeURIComponent(paymentId)}/confirm`,
    data: payload,
  });

  return normalizePaymentDetail(extractSingle(response));
};

export const refundPayment = async (
  paymentId: string,
  payload: RefundPaymentPayload,
) => {
  const response = await httpClient.put<unknown, RefundPaymentPayload>({
    url: `${BASE_PAYMENT_URL}/${encodeURIComponent(paymentId)}/refund`,
    data: payload,
  });

  return normalizePaymentDetail(extractSingle(response));
};
