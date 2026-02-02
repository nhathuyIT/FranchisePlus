import type { ID, BaseTimestamp } from "./common";
import type { OrderStatus } from "./order";

/**
 * ProductFranchisePriceLog - tracks price changes for products
 */
export interface ProductFranchisePriceLog extends BaseTimestamp {
  id: ID;
  product_franchise_id: ID;
  old_price: number; // decimal
  new_price: number; // decimal
  reason: string | null;
  changed_by: ID;
}

/**
 * OrderStatusLog - tracks order status changes
 */
export interface OrderStatusLog extends BaseTimestamp {
  id: ID;
  order_id: ID;
  from_status: OrderStatus;
  to_status: OrderStatus;
  changed_by: ID;
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
  entity_type: string; // order / product / user / …
  entity_id: ID;
  action: AuditAction;
  old_data: Record<string, unknown> | null; // JSON
  new_data: Record<string, unknown> | null; // JSON
  changed_by: ID;
  note: string | null;
}
