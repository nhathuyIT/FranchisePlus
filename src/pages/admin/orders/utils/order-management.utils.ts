import type {
  AdminOrderStatus,
  AdminPaymentStatus,
  FranchiseOrderListItem,
} from "../models/order-management.type";

export const ORDER_STATUS_FILTERS: Array<{
  value: AdminOrderStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All Orders" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY_FOR_PICKUP", label: "Ready for Pickup" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
];

export const ORDER_PROGRESS_STEPS: Array<{
  status: Exclude<AdminOrderStatus, "DRAFT" | "CANCELED">;
  label: string;
}> = [
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PREPARING", label: "Preparing" },
  { status: "READY_FOR_PICKUP", label: "Ready for Pickup" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "COMPLETED", label: "Completed" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "CASH" },
  { label: "Card", value: "CARD" },
  { label: "COD", value: "COD" },
  { label: "QR", value: "QR" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
];

const ORDER_STATUS_ORDER: Record<AdminOrderStatus, number> = {
  DRAFT: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY_FOR_PICKUP: 3,
  OUT_FOR_DELIVERY: 4,
  COMPLETED: 5,
  CANCELED: 0,
};

export const ORDER_STATUS_META: Record<
  AdminOrderStatus,
  {
    label: string;
    badgeClassName: string;
    accentClassName: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    badgeClassName: "border-slate-200 bg-slate-50 text-slate-700",
    accentClassName: "text-slate-700",
  },
  CONFIRMED: {
    label: "Confirmed",
    badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
    accentClassName: "text-sky-700",
  },
  PREPARING: {
    label: "Preparing",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
    accentClassName: "text-amber-700",
  },
  READY_FOR_PICKUP: {
    label: "Ready for Pickup",
    badgeClassName: "border-orange-200 bg-orange-50 text-orange-700",
    accentClassName: "text-orange-700",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    badgeClassName: "border-indigo-200 bg-indigo-50 text-indigo-700",
    accentClassName: "text-indigo-700",
  },
  COMPLETED: {
    label: "Completed",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accentClassName: "text-emerald-700",
  },
  CANCELED: {
    label: "Canceled",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
    accentClassName: "text-rose-700",
  },
};

export const PAYMENT_STATUS_META: Record<
  AdminPaymentStatus,
  {
    label: string;
    badgeClassName: string;
  }
> = {
  PENDING: {
    label: "Pending",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  PAID: {
    label: "Paid",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  REFUNDED: {
    label: "Refunded",
    badgeClassName: "border-slate-200 bg-slate-50 text-slate-700",
  },
};

export const normalizeOrderStatus = (
  value?: string | null,
): AdminOrderStatus => {
  const normalized = (value || "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  if (normalized.includes("READY") || normalized.includes("PICKUP")) {
    return "READY_FOR_PICKUP";
  }

  if (
    normalized.includes("OUT_FOR_DELIVERY") ||
    normalized.includes("DELIVERY")
  ) {
    return "OUT_FOR_DELIVERY";
  }

  if (normalized.includes("PREPAR")) {
    return "PREPARING";
  }

  if (normalized.includes("COMPLETE")) {
    return "COMPLETED";
  }

  if (normalized.includes("CANCEL")) {
    return "CANCELED";
  }

  if (normalized.includes("CONFIRM")) {
    return "CONFIRMED";
  }

  return "DRAFT";
};

export const toApiOrderStatus = (
  value?: AdminOrderStatus | "",
): string | undefined => {
  if (!value) return undefined;

  const mapping: Record<AdminOrderStatus, string> = {
    DRAFT: "DRAFT",
    CONFIRMED: "CONFIRMED",
    PREPARING: "PREPARING",
    READY_FOR_PICKUP: "READY_FOR_PICKUP",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED",
  };

  return mapping[value];
};

export const normalizePaymentStatus = (
  value?: string | null,
): AdminPaymentStatus => {
  const normalized = (value || "").trim().toUpperCase();

  if (normalized.includes("REFUND")) {
    return "REFUNDED";
  }

  if (normalized.includes("PAID")) {
    return "PAID";
  }

  return "PENDING";
};

export const formatCurrency = (value?: number | null) => {
  const amount = Number.isFinite(value) ? Number(value) : 0;
  return `${amount.toLocaleString("vi-VN")} VND`;
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const filterOrderList = (
  orders: FranchiseOrderListItem[],
  searchTerm: string,
) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return orders;
  }

  return orders.filter((order) =>
    [order.code, order.customerName, order.phone]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedSearch)),
  );
};

export const getOrderProgressState = (
  currentStatus: AdminOrderStatus,
  stepStatus: Exclude<AdminOrderStatus, "DRAFT" | "CANCELED">,
) => {
  if (currentStatus === "CANCELED") {
    return "canceled";
  }

  const currentIndex = ORDER_STATUS_ORDER[currentStatus];
  const stepIndex = ORDER_STATUS_ORDER[stepStatus];

  if (currentIndex > stepIndex) {
    return "completed";
  }

  if (currentIndex === stepIndex) {
    return "active";
  }

  return "upcoming";
};
