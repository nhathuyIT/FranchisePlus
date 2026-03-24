import type {
  DashboardData,
  DashboardDeliveryCounts,
  DashboardDeliveryStatus,
  DashboardOrderCounts,
  DashboardOrderStatus,
  DashboardPaymentCounts,
  DashboardPaymentStatus,
} from "@/types/dashboard.type";

export interface DashboardStatusDatum<K extends string> {
  key: K;
  label: string;
  value: number;
  fill: string;
  share: number;
  valueLabel: string;
}

export interface DashboardInsight {
  title: string;
  description: string;
  emphasis: string;
  dotColor: string;
}

interface StatusMeta {
  label: string;
  fill: string;
}

const integerFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const safeNumber = (value: unknown) => {
  const normalized =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? 0));

  return Number.isFinite(normalized) ? normalized : 0;
};

const ORDER_STATUS_SEQUENCE: DashboardOrderStatus[] = [
  "DRAFT",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELED",
];

const PAYMENT_STATUS_SEQUENCE: DashboardPaymentStatus[] = [
  "PAID",
  "PENDING",
  "REFUNDED",
  "FAILED",
];

const DELIVERY_STATUS_SEQUENCE: DashboardDeliveryStatus[] = [
  "ASSIGNED",
  "PICKING_UP",
  "DELIVERED",
];

export const ORDER_STATUS_META: Record<DashboardOrderStatus, StatusMeta> = {
  DRAFT: {
    label: "Draft",
    fill: "#D7C8B8",
  },
  CONFIRMED: {
    label: "Confirmed",
    fill: "#FFB703",
  },
  PREPARING: {
    label: "Preparing",
    fill: "#F4C95D",
  },
  READY_FOR_PICKUP: {
    label: "Ready for Pickup",
    fill: "#E9B9A6",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    fill: "#9C6B56",
  },
  COMPLETED: {
    label: "Completed",
    fill: "#3E2723",
  },
  CANCELED: {
    label: "Canceled",
    fill: "#C75C5C",
  },
};

export const PAYMENT_STATUS_META: Record<DashboardPaymentStatus, StatusMeta> = {
  PAID: {
    label: "Paid",
    fill: "#3E2723",
  },
  PENDING: {
    label: "Pending",
    fill: "#FFB703",
  },
  REFUNDED: {
    label: "Refunded",
    fill: "#E76F51",
  },
  FAILED: {
    label: "Failed",
    fill: "#B3261E",
  },
};

export const DELIVERY_STATUS_META: Record<DashboardDeliveryStatus, StatusMeta> =
  {
    ASSIGNED: {
      label: "Assigned",
      fill: "#FFB703",
    },
    PICKING_UP: {
      label: "Picking Up",
      fill: "#F5DEB3",
    },
    DELIVERED: {
      label: "Delivered",
      fill: "#FFF8EA",
    },
  };

export const formatCount = (value: number) => integerFormatter.format(safeNumber(value));

export const formatSummaryValue = (value: number) =>
  safeNumber(value) >= 50000
    ? compactFormatter.format(safeNumber(value))
    : integerFormatter.format(safeNumber(value));

export const formatPercent = (value: number) =>
  `${Math.round(Math.max(safeNumber(value), 0) * 100)}%`;

export const sumCounts = (counts: Record<string, number>) =>
  Object.values(counts).reduce((sum, value) => sum + safeNumber(value), 0);

const getShare = (value: number, total: number) =>
  safeNumber(total) === 0 ? 0 : safeNumber(value) / safeNumber(total);

export const toOrderStatusData = (
  counts: DashboardOrderCounts,
): DashboardStatusDatum<DashboardOrderStatus>[] => {
  const total = sumCounts(counts);

  return ORDER_STATUS_SEQUENCE.map((status) => ({
    key: status,
    label: ORDER_STATUS_META[status].label,
    value: counts[status],
    fill: ORDER_STATUS_META[status].fill,
    share: getShare(counts[status], total),
    valueLabel: formatCount(counts[status]),
  }));
};

export const toPaymentStatusData = (
  counts: DashboardPaymentCounts,
): DashboardStatusDatum<DashboardPaymentStatus>[] => {
  const total = sumCounts(counts);

  return PAYMENT_STATUS_SEQUENCE.map((status) => ({
    key: status,
    label: PAYMENT_STATUS_META[status].label,
    value: counts[status],
    fill: PAYMENT_STATUS_META[status].fill,
    share: getShare(counts[status], total),
    valueLabel: formatCount(counts[status]),
  }));
};

export const toDeliveryStatusData = (
  counts: DashboardDeliveryCounts,
): DashboardStatusDatum<DashboardDeliveryStatus>[] => {
  const total = sumCounts(counts);

  return DELIVERY_STATUS_SEQUENCE.map((status) => ({
    key: status,
    label: DELIVERY_STATUS_META[status].label,
    value: counts[status],
    fill: DELIVERY_STATUS_META[status].fill,
    share: getShare(counts[status], total),
    valueLabel: formatCount(counts[status]),
  }));
};

export const getOperationalHealthScore = (data: DashboardData) => {
  const orderTotal = sumCounts(data.countOrders);
  const paymentTotal = sumCounts(data.countPayments);
  const deliveryTotal = sumCounts(data.countDeliveries);
  const metrics: number[] = [];

  if (orderTotal > 0) {
    metrics.push(getShare(data.countOrders.COMPLETED, orderTotal));
  }

  if (paymentTotal > 0) {
    metrics.push(getShare(data.countPayments.PAID, paymentTotal));
  }

  if (deliveryTotal > 0) {
    metrics.push(getShare(data.countDeliveries.DELIVERED, deliveryTotal));
  }

  if (metrics.length === 0) {
    return 0;
  }

  return Math.round(
    (metrics.reduce((sum, value) => sum + value, 0) / metrics.length) * 100,
  );
};

export const buildDashboardInsights = (
  data: DashboardData,
  scopeLabel: string,
): DashboardInsight[] => {
  const orderTotal = sumCounts(data.countOrders);
  const paymentTotal = sumCounts(data.countPayments);
  const deliveryTotal = sumCounts(data.countDeliveries);
  const openOrders =
    orderTotal - data.countOrders.COMPLETED - data.countOrders.CANCELED;
  const paymentExceptions =
    data.countPayments.PENDING +
    data.countPayments.REFUNDED +
    data.countPayments.FAILED;
  const deliveryBacklog =
    data.countDeliveries.ASSIGNED + data.countDeliveries.PICKING_UP;

  return [
    {
      title: "Open order queue",
      emphasis: formatCount(openOrders),
      description: `${formatCount(openOrders)} orders are still progressing through ${scopeLabel.toLowerCase()}.`,
      dotColor: "#FFB703",
    },
    {
      title: "Collections to review",
      emphasis: formatCount(paymentExceptions),
      description:
        paymentTotal === 0
          ? "No payment activity has been captured yet."
          : `${formatPercent(getShare(paymentExceptions, paymentTotal))} of payments still need attention, follow-up, or exception handling.`,
      dotColor: "#7A3B2E",
    },
    {
      title: "Delivery backlog",
      emphasis: formatCount(deliveryBacklog),
      description:
        deliveryTotal === 0
          ? "No deliveries have been dispatched yet."
          : `${formatCount(deliveryBacklog)} deliveries remain in motion before completion.`,
      dotColor: "#D9A441",
    },
    {
      title: "Catalog reach",
      emphasis: formatCount(data.countProductFranchises),
      description: `${formatCount(data.countProducts)} products are currently mapped into ${formatCount(data.countProductFranchises)} franchise placements.`,
      dotColor: "#C96F3D",
    },
  ];
};

export const buildHighlightCopy = (data: DashboardData, scopeLabel: string) => {
  const orderTotal = sumCounts(data.countOrders);
  const paymentTotal = sumCounts(data.countPayments);
  const deliveryTotal = sumCounts(data.countDeliveries);
  const paidRate = getShare(data.countPayments.PAID, paymentTotal);
  const deliveredRate = getShare(data.countDeliveries.DELIVERED, deliveryTotal);

  if (orderTotal === 0 && paymentTotal === 0 && deliveryTotal === 0) {
    return {
      eyebrow: "Operational spotlight",
      headline: scopeLabel,
      description:
        "This workspace is ready for live tracking. As orders, payments, and deliveries come in, this panel will turn the current totals into an instant performance snapshot.",
    };
  }

  return {
    eyebrow: "Operational spotlight",
    headline: scopeLabel,
    description: `${formatPercent(paidRate)} of payments are already settled and ${formatPercent(deliveredRate)} of deliveries are complete. ${formatCount(data.countCustomers)} customers and ${formatCount(data.countProducts)} products are represented inside the current dashboard view.`,
  };
};
