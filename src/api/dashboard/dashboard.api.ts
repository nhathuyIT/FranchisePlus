import type { DashboardResponse } from "@/types/dashboard.type";
import { httpClient } from "../httpClient.api";

const toSafeNumber = (value: unknown) => {
  const normalized =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? 0));

  return Number.isFinite(normalized) ? normalized : 0;
};

const getCountValue = (
  counts: Record<string, unknown> | null | undefined,
  aliases: string[],
) => {
  for (const alias of aliases) {
    if (alias in (counts ?? {})) {
      return toSafeNumber(counts?.[alias]);
    }
  }

  return 0;
};

export const normalizeDashboardResponse = (
  payload: unknown,
): DashboardResponse => {
  const source =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data?: unknown }).data
      : payload;
  const data =
    source && typeof source === "object"
      ? (source as Record<string, unknown>)
      : {};
  const orderCounts =
    data.countOrders && typeof data.countOrders === "object"
      ? (data.countOrders as Record<string, unknown>)
      : {};
  const paymentCounts =
    data.countPayments && typeof data.countPayments === "object"
      ? (data.countPayments as Record<string, unknown>)
      : {};
  const deliveryCounts =
    data.countDeliveries && typeof data.countDeliveries === "object"
      ? (data.countDeliveries as Record<string, unknown>)
      : {};

  return {
    countUsers: toSafeNumber(data.countUsers),
    countUserFranchises: toSafeNumber(data.countUserFranchises),
    countCustomers: toSafeNumber(data.countCustomers),
    countCustomerFranchises: toSafeNumber(data.countCustomerFranchises),
    countProducts: toSafeNumber(data.countProducts),
    countProductFranchises: toSafeNumber(data.countProductFranchises),
    countOrders: {
      DRAFT: getCountValue(orderCounts, ["DRAFT", "draft"]),
      CONFIRMED: getCountValue(orderCounts, ["CONFIRMED", "confirmed"]),
      PREPARING: getCountValue(orderCounts, ["PREPARING", "preparing"]),
      READY_FOR_PICKUP: getCountValue(orderCounts, [
        "READY_FOR_PICKUP",
        "readyForPickup",
      ]),
      OUT_FOR_DELIVERY: getCountValue(orderCounts, [
        "OUT_FOR_DELIVERY",
        "outForDelivery",
      ]),
      COMPLETED: getCountValue(orderCounts, ["COMPLETED", "completed"]),
      CANCELED: getCountValue(orderCounts, [
        "CANCELED",
        "canceled",
        "CANCELLED",
        "cancelled",
      ]),
    },
    countPayments: {
      PENDING: getCountValue(paymentCounts, ["PENDING", "pending"]),
      PAID: getCountValue(paymentCounts, ["PAID", "paid"]),
      REFUNDED: getCountValue(paymentCounts, ["REFUNDED", "refunded"]),
      FAILED: getCountValue(paymentCounts, ["FAILED", "failed"]),
    },
    countDeliveries: {
      ASSIGNED: getCountValue(deliveryCounts, ["ASSIGNED", "assigned"]),
      PICKING_UP: getCountValue(deliveryCounts, [
        "PICKING_UP",
        "pickingUp",
      ]),
      DELIVERED: getCountValue(deliveryCounts, ["DELIVERED", "delivered"]),
    },
  };
};

export const getDashboard = async (
  franchiseId: string | "",
): Promise<DashboardResponse> => {
  const response = await httpClient.get<DashboardResponse>({
    url: `/api/dashboards?franchiseId=${franchiseId}`,
  });

  return normalizeDashboardResponse(response);
};
