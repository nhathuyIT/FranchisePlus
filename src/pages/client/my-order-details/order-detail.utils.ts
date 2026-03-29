import type {
  AdminOrderStatus,
  OrderDetail,
} from "@/pages/admin/orders/models/order-management.type";
import {
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  formatCurrency,
  formatDateTime,
  getOrderProgressState,
} from "@/pages/admin/orders/utils/order-management.utils";
import { ROUTER_URL } from "@/router/route.const";
import type { AdminPayment } from "@/types/admin-payment.type";

const PRODUCT_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none"><rect width="320" height="320" rx="32" fill="#FAF1E7"/><rect x="70" y="82" width="180" height="156" rx="24" fill="#FFF8F1" stroke="#E6D5C5" stroke-width="10"/><path d="M108 126h104" stroke="#C97B3D" stroke-width="16" stroke-linecap="round"/><path d="M108 160h76" stroke="#D4A373" stroke-width="16" stroke-linecap="round"/><path d="M108 194h52" stroke="#E3B587" stroke-width="16" stroke-linecap="round"/><circle cx="226" cy="194" r="22" fill="#F6D7B8"/></svg>',
)}`;

export {
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  formatCurrency,
  formatDateTime,
  getOrderProgressState,
};

export const getClientPath = (path: string) => `${ROUTER_URL.CLIENT}/${path}`;

export const getMyOrdersPath = () =>
  `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;

export const getMyOrderDetailPath = (orderId: string) =>
  `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER_DETAIL.replace(":orderId", orderId)}`;

export const getOrderItemCount = (order?: OrderDetail | null) =>
  (order?.orderItems || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

export const getOrderDiscountTotal = (order: OrderDetail) =>
  Number(order.promotionDiscount || 0) +
  Number(order.voucherDiscount || 0) +
  Number(order.loyaltyDiscount || 0);

export const getPaymentStatusMeta = (payment?: AdminPayment | null) =>
  payment ? PAYMENT_STATUS_META[payment.status] : null;

export const formatPaymentMethod = (method?: string | null) => {
  const normalized = (method || "").trim();

  if (!normalized) {
    return "Pending setup";
  }

  return normalized
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getProductImage = (value?: string | null) =>
  value?.trim() || PRODUCT_PLACEHOLDER;

export const canRepayOrder = (
  orderStatus: AdminOrderStatus,
  paymentStatus?: AdminPayment["status"] | null,
) =>
  paymentStatus !== "PAID" &&
  paymentStatus !== "REFUNDED" &&
  orderStatus !== "COMPLETED" &&
  orderStatus !== "CANCELED";

export const canCancelPayment = (
  orderStatus: AdminOrderStatus,
  paymentStatus?: AdminPayment["status"] | null,
) =>
  paymentStatus === "PENDING" &&
  orderStatus !== "COMPLETED" &&
  orderStatus !== "CANCELED";

export const canRequestRefund = (
  orderStatus: AdminOrderStatus,
  paymentStatus?: AdminPayment["status"] | null,
) =>
  paymentStatus === "PAID" &&
  orderStatus !== "COMPLETED" &&
  orderStatus !== "CANCELED";

export const getOrderStatusNarrative = (status: AdminOrderStatus) => {
  switch (status) {
    case "DRAFT":
      return "Your order has been created and is waiting for store confirmation.";
    case "CONFIRMED":
      return "The store has confirmed this order and is preparing the next step.";
    case "PREPARING":
      return "Your drinks and add-ons are being prepared with the latest order snapshot.";
    case "READY_FOR_PICKUP":
      return "Everything is packed and ready for pickup or handoff to the delivery flow.";
    case "OUT_FOR_DELIVERY":
      return "The delivery journey has started. Keep your phone available for updates.";
    case "COMPLETED":
      return "This order has been completed successfully. You can revisit the summary any time.";
    case "CANCELED":
      return "This order was canceled. The detail below keeps the final snapshot for reference.";
    default:
      return "Track every stage of this order, from confirmation to payment and delivery.";
  }
};
