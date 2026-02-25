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
  franchiseId: ID;
  customerId: ID;
  type: OrderType;
  status: OrderStatus;
  totalAmount: number; // decimal - snapshot, không tính lại từ product
  confirmedAt: string | null; // Chốt đơn
  completedAt: string | null; // Hoàn tất
  cancelledAt: string | null; // Huỷ
  createdBy: ID | null; // Staff tạo (POS)
}

/**
 * OrderItem entity - individual items in an order with snapshot pricing
 */
export interface OrderItem extends BaseTimestamp, SoftDeletable {
  id: ID;
  orderId: ID;
  productFranchiseId: ID;
  productNameSnapshot: string; // Tên tại thời điểm mua
  priceSnapshot: number; // decimal - Giá tại thời điểm mua
  quantity: number;
  lineTotal: number; // decimal - price × quantity
}
