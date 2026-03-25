export type DashboardOrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELED";

export type DashboardPaymentStatus =
  | "PENDING"
  | "PAID"
  | "REFUNDED"
  | "FAILED";

export type DashboardDeliveryStatus =
  | "ASSIGNED"
  | "PICKING_UP"
  | "DELIVERED";

export type DashboardOrderCounts = Record<DashboardOrderStatus, number>;
export type DashboardPaymentCounts = Record<DashboardPaymentStatus, number>;
export type DashboardDeliveryCounts = Record<DashboardDeliveryStatus, number>;

export interface DashboardData {
  countUsers: number;
  countUserFranchises: number;
  countCustomers: number;
  countCustomerFranchises: number;
  countProducts: number;
  countProductFranchises: number;
  countOrders: DashboardOrderCounts;
  countPayments: DashboardPaymentCounts;
  countDeliveries: DashboardDeliveryCounts;
}

export type DashboardResponse = DashboardData;
