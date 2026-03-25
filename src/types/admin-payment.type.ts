export type AdminPaymentMethod =
  | "COD"
  | "QR"
  | (string & {});

export type AdminPaymentStatus =
  | "PENDING"
  | "PAID"
  | "REFUNDED";

export interface AdminPayment {
  id: string;
  code: string;
  orderId: string | { _id: string; code?: string };
  customerId: string | { _id: string; name?: string };
  franchiseId?: string | { _id: string; name?: string; code?: string };
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
