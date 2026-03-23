import { httpClient } from "@/api/httpClient.api";

export type AdminOrderStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface AdminOrderItem {
  id: string;
  productName: string;
  quantity: number;
  lineTotal: number;
}

export interface AdminOrder {
  id: string;
  code: string;
  franchiseId: string;
  franchiseName: string;
  customerId: string;
  customerName: string;
  type: string;
  status: AdminOrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  items: AdminOrderItem[];
}

type RawOrderItem = {
  id?: string;
  productNameSnapshot?: string;
  productName?: string;
  quantity?: number;
  lineTotal?: number;
};

type RawOrder = {
  id?: string;
  code?: string;
  franchiseId?: string;
  franchiseName?: string;
  customerId?: string;
  customerName?: string;
  type?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  confirmedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  orderItems?: RawOrderItem[];
  items?: RawOrderItem[];
};

const STATUS_FALLBACK: AdminOrderStatus = "DRAFT";

const ORDER_STATUSES: AdminOrderStatus[] = [
  "DRAFT",
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const normalizeStatus = (value?: string): AdminOrderStatus => {
  if (!value) return STATUS_FALLBACK;
  const upper = value.toUpperCase();
  return ORDER_STATUSES.includes(upper as AdminOrderStatus)
    ? (upper as AdminOrderStatus)
    : STATUS_FALLBACK;
};

const normalizeOrderItem = (
  item: RawOrderItem,
  index: number,
): AdminOrderItem => ({
  id: item.id ?? `item-${index}`,
  productName:
    item.productNameSnapshot ?? item.productName ?? "Unknown product",
  quantity: item.quantity ?? 0,
  lineTotal: item.lineTotal ?? 0,
});

const normalizeOrder = (order: RawOrder): AdminOrder => ({
  id: order.id ?? "",
  code: order.code ?? "",
  franchiseId: order.franchiseId ?? "",
  franchiseName: order.franchiseName ?? "Unknown franchise",
  customerId: order.customerId ?? "",
  customerName: order.customerName ?? "Unknown customer",
  type: order.type ?? "UNKNOWN",
  status: normalizeStatus(order.status),
  totalAmount: order.totalAmount ?? 0,
  createdAt: order.createdAt ?? "",
  updatedAt: order.updatedAt ?? "",
  confirmedAt: order.confirmedAt ?? null,
  completedAt: order.completedAt ?? null,
  cancelledAt: order.cancelledAt ?? null,
  items: (order.orderItems ?? order.items ?? []).map(normalizeOrderItem),
});

const encodeId = (id: string) => encodeURIComponent(id);

export const getOrdersByFranchise = async (params: {
  franchiseId: string;
  status?: AdminOrderStatus;
}): Promise<AdminOrder[]> => {
  const response = await httpClient.get<
    RawOrder[],
    { status?: AdminOrderStatus }
  >({
    url: `/api/orders/franchise/${encodeId(params.franchiseId)}`,
    params: {
      status: params.status,
    },
  });

  return (response ?? []).map(normalizeOrder);
};

export const getOrdersByCustomer = async (
  customerId: string,
): Promise<AdminOrder[]> => {
  const response = await httpClient.get<RawOrder[]>({
    url: `/api/orders/customer/${encodeId(customerId)}`,
  });

  return (response ?? []).map(normalizeOrder);
};

export const getOrderById = async (
  orderId: string,
): Promise<AdminOrder | null> => {
  const response = await httpClient.get<RawOrder>({
    url: `/api/orders/${encodeId(orderId)}`,
  });

  return response ? normalizeOrder(response) : null;
};

export const getOrderByCode = async (
  code: string,
): Promise<AdminOrder | null> => {
  const response = await httpClient.get<RawOrder, { code: string }>({
    url: "/api/orders/code",
    params: {
      code,
    },
  });

  return response ? normalizeOrder(response) : null;
};
