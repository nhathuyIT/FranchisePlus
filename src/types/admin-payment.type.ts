export type AdminPaymentMethod =
  | "CARD"
  | "CASH"
  | "COD"
  | "QR"
  | "BANK_TRANSFER"
  | (string & {});

export type AdminPaymentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED"
  | (string & {});

export interface AdminPayment {
  id: string;
  code: string;
  orderId: string;
  customerId: string;
  amount: number;
  method: AdminPaymentMethod;
  status: AdminPaymentStatus;
  providerTxnId: string;
  refundReason: string;
  paidAt: string;
  refundedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
