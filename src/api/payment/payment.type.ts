import type { AdminPayment, AdminPaymentMethod } from "@/types/admin-payment.type";

export interface ConfirmPaymentRequest {
  method: AdminPaymentMethod;
  providerTxnId?: string;
}

export interface RefundPaymentRequest {
  refundReason: string;
}

export type PaymentDetailResponse = AdminPayment;
