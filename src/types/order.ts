import type { ID, BaseTimestamp, SoftDeletable } from "./common";

/**
 * Order type - POS (Point of Sale) or ONLINE
 */
export type OrderType = "POS" | "ONLINE";

/**
 * Order status lifecycle
 */
export type OrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "PREPARING"
  | "COMPLETED"
  | "CANCELLED";

/**
 * Order entity - snapshot-based order system
 */
export interface Order extends BaseTimestamp, SoftDeletable {
  id: ID;
  code: string; // unique
  franchise_id: ID;
  customer_id: ID;
  type: OrderType;
  status: OrderStatus;
  total_amount: number; // decimal - snapshot, không tính lại từ product
  confirmed_at: string | null; // Chốt đơn
  completed_at: string | null; // Hoàn tất
  cancelled_at: string | null; // Huỷ
  created_by: ID | null; // Staff tạo (POS)
}

/**
 * OrderItem entity - individual items in an order with snapshot pricing
 */
export interface OrderItem extends BaseTimestamp, SoftDeletable {
  id: ID;
  order_id: ID;
  product_franchise_id: ID;
  product_name_snapshot: string; // Tên tại thời điểm mua
  price_snapshot: number; // decimal - Giá tại thời điểm mua
  quantity: number;
  line_total: number; // decimal - price × quantity
}
