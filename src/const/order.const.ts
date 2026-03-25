export type OrderType = "ONLINE" | "IN_STORE";
export type OrderStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItemData {
  id: number;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  rawId?: string;
  apiStatus?:
    | "DRAFT"
    | "CONFIRMED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "OUT_FOR_DELIVERY"
    | "COMPLETED"
    | "CANCELED";
  code: string;
  franchiseId: number;
  franchiseName: string;
  customerId: number;
  type: OrderType;
  status: OrderStatus;
  totalAmount: number;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdBy: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItemData[];
}

export const ORDER_STATUS_TABS: { key: OrderStatus | "ALL"; label: string }[] =
  [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ thanh toán" },
    { key: "CONFIRMED", label: "Vận chuyển" },
    { key: "SHIPPING", label: "Chờ giao hàng" },
    { key: "COMPLETED", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã hủy" },
    { key: "REFUNDED", label: "Trả hàng/Hoàn tiền" },
  ];

export const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  DRAFT: { label: "Nhap", color: "text-slate-500" },
  PENDING: { label: "Chờ thanh toán", color: "text-yellow-600" },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-600" },
  SHIPPING: { label: "Đang giao hàng", color: "text-orange-500" },
  COMPLETED: { label: "Hoàn thành", color: "text-green-600" },
  CANCELLED: { label: "Đã hủy", color: "text-red-500" },
  REFUNDED: { label: "Trả hàng/Hoàn tiền", color: "text-gray-500" },
};
