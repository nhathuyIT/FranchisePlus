import type { ID, Timestamp } from "./common";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface Payment extends Timestamp {
  id: ID;
  orderId: ID;
  method: "cod" | "bank" | "card" | "ewallet";
  amount: number;
  status: PaymentStatus;
}
