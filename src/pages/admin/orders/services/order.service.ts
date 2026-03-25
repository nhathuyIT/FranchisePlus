import { httpClient } from "@/api/httpClient.api";
import type {
  DeliveryReference,
  FranchiseOrderListItem,
  OrderDetail,
  OrderItem,
  OrderItemOption,
  ReadyForPickupPayload,
  SearchFranchiseOrdersParams,
} from "../models/order-management.type";
import {
  normalizeOrderStatus,
  toApiOrderStatus,
} from "../utils/order-management.utils";
import {
  extractArray,
  extractSingle,
  toNumberValue,
  toRecord,
  toStringValue,
} from "./service.utils";

const BASE_ORDER_URL = "/api/orders";

const normalizeOrderItemOption = (raw: unknown): OrderItemOption => {
  const record = toRecord(raw) || {};

  return {
    quantity: toNumberValue(record.quantity),
    productFranchiseId: toStringValue(
      record.productFranchiseId,
      record.productId,
    ),
    priceSnapshot: toNumberValue(record.priceSnapshot, record.price),
    discountAmount: toNumberValue(record.discountAmount),
    finalPrice: toNumberValue(record.finalPrice, record.lineTotal),
    productName: toStringValue(record.productName, record.name, "Option"),
    productImageUrl: toStringValue(
      record.productImageUrl,
      record.imageUrl,
      record.image,
    ),
  };
};

const normalizeOrderItem = (raw: unknown, index: number): OrderItem => {
  const record = toRecord(raw) || {};
  const options = Array.isArray(record.options)
    ? record.options.map(normalizeOrderItemOption)
    : [];

  const orderItemId = toStringValue(
    record.orderItemId,
    record.id,
    record.productFranchiseId,
    `${index + 1}`,
  );

  return {
    orderItemId,
    quantity: toNumberValue(record.quantity) || 1,
    productFranchiseId: toStringValue(record.productFranchiseId),
    priceSnapshot: toNumberValue(record.priceSnapshot, record.price),
    discountAmount: toNumberValue(record.discountAmount),
    lineTotal: toNumberValue(record.lineTotal),
    finalLineTotal: toNumberValue(record.finalLineTotal, record.lineTotal),
    optionsHash: toStringValue(record.optionsHash),
    productName: toStringValue(
      record.productName,
      record.productNameSnapshot,
      record.name,
      "Product",
    ),
    productImageUrl: toStringValue(
      record.productImageUrl,
      record.imageUrl,
      record.image,
    ),
    options,
  };
};

const normalizeDeliveryReference = (raw: unknown): DeliveryReference | null => {
  const record = toRecord(raw);
  if (!record) return null;

  const id = toStringValue(record.id);
  if (!id) return null;

  return { id };
};

const normalizeOrderDetail = (raw: unknown): OrderDetail | null => {
  const record = toRecord(raw);
  if (!record) return null;

  const deliveryRecord = toRecord(record.delivery);
  const orderItems = Array.isArray(record.orderItems)
    ? record.orderItems.map(normalizeOrderItem)
    : Array.isArray(record.items)
      ? record.items.map(normalizeOrderItem)
      : [];

  const id = toStringValue(record.id);
  if (!id) {
    return null;
  }

  return {
    id,
    customerId: toStringValue(record.customerId),
    franchiseId: toStringValue(record.franchiseId),
    deliveryId:
      toStringValue(record.deliveryId, deliveryRecord?.id) || undefined,
    delivery: normalizeDeliveryReference(record.delivery),
    cartId: toStringValue(record.cartId) || undefined,
    staffId: toStringValue(record.staffId) || undefined,
    code: toStringValue(record.code, id),
    status: normalizeOrderStatus(toStringValue(record.status)),
    address: toStringValue(record.address) || undefined,
    phone: toStringValue(record.phone) || undefined,
    message: toStringValue(record.message, record.note) || undefined,
    promotionDiscount: toNumberValue(record.promotionDiscount),
    voucherDiscount: toNumberValue(record.voucherDiscount),
    loyaltyDiscount: toNumberValue(record.loyaltyDiscount),
    subtotalAmount: toNumberValue(record.subtotalAmount),
    finalAmount: toNumberValue(record.finalAmount, record.totalAmount),
    promotionId: toStringValue(record.promotionId) || undefined,
    promotionType: toStringValue(record.promotionType) || undefined,
    promotionValue: toNumberValue(record.promotionValue) || undefined,
    voucherType: toStringValue(record.voucherType) || undefined,
    voucherValue: toNumberValue(record.voucherValue) || undefined,
    loyaltyPointsUsed: toNumberValue(record.loyaltyPointsUsed) || undefined,
    franchiseName: toStringValue(record.franchiseName) || undefined,
    customerName: toStringValue(record.customerName) || undefined,
    customerEmail: toStringValue(record.customerEmail) || undefined,
    customerPhone:
      toStringValue(record.customerPhone, record.phone) || undefined,
    staffName: toStringValue(record.staffName) || undefined,
    staffEmail: toStringValue(record.staffEmail) || undefined,
    orderItems,
    createdAt: toStringValue(record.createdAt) || undefined,
  };
};

const normalizeOrderListItem = (
  raw: unknown,
): FranchiseOrderListItem | null => {
  const record = toRecord(raw);
  if (!record) return null;

  const id = toStringValue(record.id);
  if (!id) {
    return null;
  }

  return {
    id,
    customerId: toStringValue(record.customerId) || undefined,
    customerName: toStringValue(record.customerName) || undefined,
    code: toStringValue(record.code, id),
    status: normalizeOrderStatus(toStringValue(record.status)),
    phone: toStringValue(record.phone),
    subtotalAmount: toNumberValue(record.subtotalAmount),
    finalAmount: toNumberValue(record.finalAmount, record.totalAmount),
    createdAt: toStringValue(record.createdAt),
  };
};

export const getOrderByCartId = async (cartId: string) => {
  const response = await httpClient.get<unknown, never>({
    url: `${BASE_ORDER_URL}/cart/${encodeURIComponent(cartId)}`,
  });

  return normalizeOrderDetail(extractSingle(response));
};

export const getFranchiseOrders = async (
  params: SearchFranchiseOrdersParams,
) => {
  const response = await httpClient.get<unknown, { status?: string }>({
    url: `${BASE_ORDER_URL}/franchise/${encodeURIComponent(params.franchiseId)}`,
    params: {
      status: toApiOrderStatus(params.status),
    },
  });

  return extractArray(response)
    .map(normalizeOrderListItem)
    .filter((item): item is FranchiseOrderListItem => item !== null);
};

export const getOrderDetail = async (orderId: string) => {
  const response = await httpClient.get<unknown, never>({
    url: `${BASE_ORDER_URL}/${encodeURIComponent(orderId)}`,
  });

  return normalizeOrderDetail(extractSingle(response));
};

export const getOrderByCode = async (code: string) => {
  const response = await httpClient.get<unknown, { code: string }>({
    url: `${BASE_ORDER_URL}/code`,
    params: { code },
  });

  return normalizeOrderDetail(extractSingle(response));
};

export const setOrderPreparing = async (orderId: string) => {
  await httpClient.put<null, never>({
    url: `${BASE_ORDER_URL}/${encodeURIComponent(orderId)}/preparing`,
  });
};

export const setOrderReadyForPickup = async (
  orderId: string,
  payload: ReadyForPickupPayload,
) => {
  await httpClient.put<null, ReadyForPickupPayload>({
    url: `${BASE_ORDER_URL}/${encodeURIComponent(orderId)}/ready-for-pickup`,
    data: payload,
  });
};
