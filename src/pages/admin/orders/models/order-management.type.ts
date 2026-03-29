export type AdminOrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELED";

export type AdminPaymentStatus = "PENDING" | "PAID" | "REFUNDED";

export interface DeliveryReference {
  id?: string;
}

export interface DeliveryDetail {
  id: string;
  orderId: string;
  customerId: string;
  assignedBy?: string;
  assignedTo?: string;
  status?: string;
  assignedAt?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  orderCode?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  franchiseId?: string;
  franchiseName?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToPhone?: string;
  assignedByName?: string;
  assignedByEmail?: string;
}

export interface OrderItemOption {
  quantity: number;
  productFranchiseId: string;
  priceSnapshot: number;
  discountAmount: number;
  finalPrice: number;
  productName: string;
  productImageUrl: string;
}

export interface OrderItem {
  orderItemId: string;
  quantity: number;
  productFranchiseId: string;
  priceSnapshot: number;
  discountAmount: number;
  lineTotal: number;
  finalLineTotal: number;
  optionsHash: string;
  productName: string;
  productImageUrl: string;
  options: OrderItemOption[];
}

export interface OrderDetail {
  id: string;
  customerId: string;
  franchiseId: string;
  deliveryId?: string;
  delivery?: DeliveryReference | null;
  cartId?: string;
  staffId?: string;
  code: string;
  status: AdminOrderStatus;
  address?: string;
  phone?: string;
  message?: string;
  promotionDiscount: number;
  voucherDiscount: number;
  loyaltyDiscount: number;
  subtotalAmount: number;
  finalAmount: number;
  promotionId?: string;
  promotionType?: string;
  promotionValue?: number;
  voucherType?: string;
  voucherValue?: number;
  loyaltyPointsUsed?: number;
  failedReason?: string;
  franchiseName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  staffName?: string;
  staffEmail?: string;
  orderItems: OrderItem[];
  createdAt?: string;
}

export interface FranchiseOrderListItem {
  id: string;
  customerId?: string;
  customerName?: string;
  code: string;
  status: AdminOrderStatus;
  phone: string;
  subtotalAmount: number;
  finalAmount: number;
  createdAt: string;
}

export interface PaymentDetail {
  id: string;
  franchiseId: string;
  customerId: string;
  orderId: string;
  code: string;
  method: string;
  status: AdminPaymentStatus;
  amount: number;
  providerTxnId?: string;
  refundReason?: string;
  refundedAt?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  version?: number;
}

export interface DeliveryStaffMember {
  id: string;
  userId: string;
  franchiseId: string | null;
  name: string;
  email?: string;
  phone?: string;
  roleCode?: string;
  image?: string;
}

export interface DeliverySearchItem {
  id: string;
  orderId: string;
  customerId: string;
  assignedBy?: string;
  assignedTo?: string;
  status?: string;
  assignedAt?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  orderCode?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  franchiseId?: string;
  franchiseName?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToPhone?: string;
  assignedByName?: string;
  assignedByEmail?: string;
}

export interface ReadyForPickupPayload {
  staffId: string;
}

export interface ConfirmPaymentPayload {
  method: string;
  providerTxnId: string;
}

export interface RefundPaymentPayload {
  refundReason: string;
}

export interface SearchFranchiseOrdersParams {
  franchiseId: string;
  status?: AdminOrderStatus | "";
}

export interface SearchDeliveriesParams {
  franchiseId?: string;
  staffId?: string;
  customerId?: string;
  status?: AdminOrderStatus | "";
}
