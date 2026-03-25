import { httpClient } from "@/api/httpClient.api";
import type {
  DeliveryDetail,
  DeliverySearchItem,
  DeliveryStaffMember,
  SearchDeliveriesParams,
} from "../models/order-management.type";
import {
  extractArray,
  extractSingle,
  toBooleanValue,
  toNumberValue,
  toRecord,
  toStringValue,
} from "./service.utils";
import { toApiOrderStatus } from "../utils/order-management.utils";

const BASE_DELIVERY_URL = "/api/deliveries";
const BASE_USER_FRANCHISE_ROLE_URL = "/api/user-franchise-roles";

const normalizeDeliveryRecord = (raw: unknown): DeliverySearchItem | null => {
  const record = toRecord(raw);
  if (!record) return null;

  const id = toStringValue(record.id);
  if (!id) {
    return null;
  }

  return {
    id,
    orderId: toStringValue(record.orderId),
    customerId: toStringValue(record.customerId),
    assignedBy: toStringValue(record.assignedBy) || undefined,
    assignedTo: toStringValue(record.assignedTo) || undefined,
    status: toStringValue(record.status) || undefined,
    assignedAt: toStringValue(record.assignedAt) || undefined,
    isActive: toBooleanValue(record.isActive),
    isDeleted: toBooleanValue(record.isDeleted),
    createdAt: toStringValue(record.createdAt) || undefined,
    updatedAt: toStringValue(record.updatedAt) || undefined,
    version: toNumberValue(record.version) || undefined,
    orderCode: toStringValue(record.orderCode) || undefined,
    customerName: toStringValue(record.customerName) || undefined,
    customerEmail: toStringValue(record.customerEmail) || undefined,
    customerPhone: toStringValue(record.customerPhone) || undefined,
    franchiseId: toStringValue(record.franchiseId) || undefined,
    franchiseName: toStringValue(record.franchiseName) || undefined,
    assignedToName: toStringValue(record.assignedToName) || undefined,
    assignedToEmail: toStringValue(record.assignedToEmail) || undefined,
    assignedToPhone: toStringValue(record.assignedToPhone) || undefined,
    assignedByName: toStringValue(record.assignedByName) || undefined,
    assignedByEmail: toStringValue(record.assignedByEmail) || undefined,
  };
};

const normalizeDeliveryStaff = (raw: unknown): DeliveryStaffMember | null => {
  const record = toRecord(raw);
  if (!record) return null;

  const userRecord = toRecord(record.user);
  const roleRecord = toRecord(record.role);
  const userId = toStringValue(record.userId, userRecord?.id, record.id);
  if (!userId) {
    return null;
  }

  return {
    id: toStringValue(record.id, userId),
    userId,
    franchiseId: toStringValue(record.franchiseId) || null,
    name: toStringValue(record.userName, userRecord?.name, record.name, userId),
    email: toStringValue(record.userEmail, userRecord?.email, record.email) || undefined,
    phone: toStringValue(record.userPhone, userRecord?.phone, record.phone) || undefined,
    roleCode: toStringValue(record.roleCode, roleRecord?.code, record.roleName) || undefined,
  };
};

const filterDeliveryStaff = (items: DeliveryStaffMember[]) => {
  const preferred = items.filter((item) => {
    const roleCode = (item.roleCode || "").toUpperCase();
    return (
      roleCode.includes("STAFF") ||
      roleCode.includes("SHIP") ||
      roleCode.includes("DELIVERY")
    );
  });

  return preferred.length > 0 ? preferred : items;
};

export const getDeliveryByOrderId = async (orderId: string) => {
  const response = await httpClient.get<unknown, never>({
    url: `${BASE_DELIVERY_URL}/order/${encodeURIComponent(orderId)}`,
  });

  return normalizeDeliveryRecord(extractSingle(response)) as DeliveryDetail | null;
};

export const searchDeliveries = async (
  params: SearchDeliveriesParams,
): Promise<DeliverySearchItem[]> => {
  const payload = {
    franchise_id: params.franchiseId ?? "",
    staff_id: params.staffId ?? "",
    customer_id: params.customerId ?? "",
    status: toApiOrderStatus(params.status) ?? "",
  };

  const response = await httpClient.postPaginatedRaw<DeliverySearchItem, typeof payload>({
    url: `${BASE_DELIVERY_URL}/search`,
    data: payload,
  });

  if (!response?.success) {
    throw new Error("Failed to search deliveries");
  }

  return (response.data ?? [])
    .map(normalizeDeliveryRecord)
    .filter((item): item is DeliverySearchItem => item !== null);
};

export const pickupDelivery = async (deliveryId: string) => {
  await httpClient.put<null, never>({
    url: `${BASE_DELIVERY_URL}/${encodeURIComponent(deliveryId)}/pickup`,
  });
};

export const completeDelivery = async (deliveryId: string) => {
  await httpClient.put<null, never>({
    url: `${BASE_DELIVERY_URL}/${encodeURIComponent(deliveryId)}/complete`,
  });
};

export const getDeliveryStaffByFranchise = async (franchiseId: string) => {
  const response = await httpClient.get<unknown, never>({
    url: `${BASE_USER_FRANCHISE_ROLE_URL}/franchise/${encodeURIComponent(franchiseId)}`,
  });

  const items = extractArray(response)
    .map(normalizeDeliveryStaff)
    .filter((item): item is DeliveryStaffMember => item !== null);

  return filterDeliveryStaff(items);
};
