export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export type PaymentMethod = "COD" | "QR";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";
