import type { ID, Timestamp } from "./common";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled";

export interface OrderItem {
  productId: ID;
  quantity: number;
  price: number; // snapshot per item
}

export interface Order extends Timestamp {
  id: ID;
  customerId: ID;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentId?: ID;
}
