import type { ID, BaseTimestamp } from "./common";
import type { OrderStatus } from "./order";

/**
 * ProductFranchisePriceLog - tracks price changes for products
 */
export interface ProductFranchisePriceLog extends BaseTimestamp {
  id: ID;
  productFranchiseId: ID;
  oldPrice: number; // decimal
  newPrice: number; // decimal
  reason: string | null;
  changedBy: ID;
}

/**
 * OrderStatusLog - tracks order status changes
 */
export interface OrderStatusLog extends BaseTimestamp {
  id: ID;
  orderId: ID;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy: ID;
  note: string | null;
}

/**
 * Audit action types
 */
export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "SOFT_DELETE";

/**
 * AuditLog - comprehensive audit trail for all entities
 */
export interface AuditLog extends BaseTimestamp {
  id: ID;
  entityType: string; // order / product / user / …
  entityId: ID;
  action: AuditAction;
  oldData: Record<string, unknown> | null; // JSON
  newData: Record<string, unknown> | null; // JSON
  changedBy: ID;
  note: string | null;
}
