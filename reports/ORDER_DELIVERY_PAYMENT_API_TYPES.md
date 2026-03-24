# Order Delivery Payment API Types

Updated: 2026-03-24

## 1. Muc tieu

Tai lieu nay tong hop toan bo type lien quan 3 nhom API:

- Order API
- Delivery API
- Payment API

Muc dich:

- copy type qua project khac de tai su dung
- map ro request/response theo endpoint

## 3. Shared enums

```ts
export type OrderStatus =
  | "draft"
  | "confirmed"
  | "preparing"
  | "readyForPickup"
  | "outForDelivery"
  | "completed"
  | "canceled";

export type PaymentStatus = "pending" | "paid" | "refunded";
```

## 4. Domain types

### 4.1 Delivery

```ts
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
  assignedByName?: string;
  assignedByEmail?: string;
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
  assignedByName?: string;
  assignedByEmail?: string;
}
```

### 4.2 Order

```ts
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
  status: OrderStatus;
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
  franchiseName?: string;
  customerName?: string;
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
  status: OrderStatus;
  phone: string;
  subtotalAmount: number;
  finalAmount: number;
  createdAt: string;
}
```

### 4.3 Payment

```ts
export interface PaymentDetail {
  id: string;
  franchiseId: string;
  customerId: string;
  orderId: string;
  code: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  version?: number;
}
```

## 5. Request payload types

```ts
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
```

## 6. Query params types

```ts
export interface SearchFranchiseOrdersParams {
  franchiseId: string;
  status?: OrderStatus | "";
}

export interface SearchDeliveriesParams {
  franchiseId?: string;
  staffId?: string;
  customerId?: string;
  status?: OrderStatus | "";
}
```

## 7. Endpoint type mapping

### 7.1 Order API

1. GET `/orders/cart/:cartId`
   - Request params: `cartId: string`
   - Response data: `OrderDetail | null`
2. GET `/orders/franchise/:franchiseId?status=...`
   - Request params: `franchiseId: string`, `status?: OrderStatus | ""`
   - Response data: `FranchiseOrderListItem[] | null`
3. GET `/orders/:id`
   - Request params: `orderId: string`
   - Response data: `OrderDetail | null`
4. GET `/orders/code?code=...`
   - Query: `{ code: string }`
   - Response data: `OrderDetail | null`
5. PUT `/orders/:id/preparing`
   - Request body: none
   - Response data: `null`
6. PUT `/orders/:id/ready-for-pickup`
   - Request body: `ReadyForPickupPayload`

- Body example: `{ staffId: "<userId>" }`
- Response data: `null`

### 7.2 Delivery API

1. GET `/deliveries/order/:orderId`
   - Request params: `orderId: string`
   - Response data: `DeliveryDetail | null`
2. POST `/deliveries/search`
   - Request body: `SearchDeliveriesParams`
   - Response data: `DeliverySearchItem[] | null`
3. PUT `/deliveries/:deliveryId/pickup`
   - Request body: none
   - Response data: `null`
4. PUT `/deliveries/:deliveryId/complete`
   - Request body: none
   - Response data: `null`

### 7.3 Payment API

1. GET `/payments/order/:orderId`
   - Request params: `orderId: string`
   - Response data: `PaymentDetail | null`
2. GET `/payments/customer/:customerId`
   - Request params: `customerId: string`
   - Response data: `PaymentDetail[] | null`
3. PUT `/payments/:paymentId/confirm`
   - Request body: `ConfirmPaymentPayload`

- Body example: `{ method: "CASH", providerTxnId: "TXN_001" }`
- Response data: `PaymentDetail | null`

4. PUT `/payments/:paymentId/refund`
   - Request body: `RefundPaymentPayload`

- Body example: `{ refundReason: "Customer canceled" }`
- Response data: `PaymentDetail | null`

## 8. Copy-ready consolidated type block

```ts
export type OrderStatus =
  | "draft"
  | "confirmed"
  | "preparing"
  | "readyForPickup"
  | "outForDelivery"
  | "completed"
  | "canceled";

export type PaymentStatus = "pending" | "paid" | "refunded";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T | null;
}

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
  status: OrderStatus;
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
  franchiseName?: string;
  customerName?: string;
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
  status: OrderStatus;
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
  status: PaymentStatus;
  amount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  version?: number;
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
```

## 9. Notes khi mang qua project khac

1. Neu backend moi khac wrapper, dieu chinh `ApiSuccessResponse<T>` truoc.
2. `DeliveryDetail.status` hien la `string`; co the tighten thanh union neu backend chot enum.
3. Cac ham service hien nhan ket qua `T | null`, can xu ly null-safe o layer usecase/hook.

4. Tai lieu nay da duoc normalize sang camelCase cho muc tieu reuse cross-project.
