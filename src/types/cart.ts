import type { Activatable, BaseTimestamp, SoftDeletable } from "./common";

export type CartStatus = "ACTIVE" | "CHECKED_OUT" | "CANCELED";

export interface CartItemOptionRequest {
  productFranchiseId: string;
  quantity: number;
}

export interface StaffCartItemRequest {
  productFranchiseId: string;
  quantity: number;
  note?: string;
  options?: CartItemOptionRequest[];
}

export interface CreateCartByStaffRequest {
  customerId: string;
  franchiseId: string;
  items: StaffCartItemRequest[];
}

export type AddProductToCartByStaffRequest = CreateCartByStaffRequest;

export interface AddProductToCartRequest {
  franchiseId: string;
  productFranchiseId: string;
  quantity: number;
  address: string;
  phone: string;
  note?: string;
  message?: string;
  options?: CartItemOptionRequest[];
}

export interface GetCartsByCustomerParams {
  customerId: string;
  status?: CartStatus;
}

export interface CountCartByCustomerParams {
  customerId: string;
  status?: CartStatus;
}

export interface UpdateCartRequest {
  address?: string;
  phone?: string;
  note?: string;
  message?: string;
}

export interface CheckoutCartRequest {
  address: string;
  phone: string;
  message?: string;
}

export interface UpdateCartOptionItemRequest {
  cartItemId: string;
  optionProductFranchiseId: string;
  quantity: number;
}

export interface RemoveCartOptionItemRequest {
  cartItemId: string;
  optionProductFranchiseId: string;
}

export interface ApplyVoucherInCartRequest {
  voucherCode: string;
}

export interface CartProductInfo {
  id?: string;
  name: string;
  imageUrl: string;
}

export interface CartOptionResponse {
  quantity: number;
  productFranchiseId: string;
  priceSnapshot: number;
  discountAmount: number;
  finalPrice: number;
  productName: string;
  productImageUrl: string;
}

export interface CartItemResponse {
  cartItemId: string;
  quantity: number;
  productFranchiseId: string;
  productCartPrice: number;
  discountAmount: number;
  lineTotal: number;
  finalLineTotal: number;
  optionsHash: string;
  note: string;
  productName: string;
  productImageUrl: string;
  options: CartOptionResponse[];
}

export interface CartResponse
  extends BaseTimestamp, SoftDeletable, Activatable {
  id: string; // Trong JSON là _id, giả định bạn đã map sang id
  customerId: string;
  franchiseId: string;
  staffId: string;
  status: CartStatus;
  address: string;
  phone: string;
  note?: string;
  message: string;

  // Promotion
  promotionDiscount: number;
  promotionType: string;
  promotionValue: number;
  promotionId: string;

  // Voucher
  voucherDiscount: number;
  voucherId?: string;
  voucherType?: string; // Thêm mới
  voucherValue?: number; // Thêm mới
  voucherCode?: string; // Thêm mới

  // Loyalty
  loyaltyPointsUsed: number;
  loyaltyDiscount: number;

  // Amounts
  subtotalAmount: number;
  finalAmount: number;

  // Info
  franchiseName: string;
  customerName: string;
  staffName: string;
  staffEmail: string;

  // Items
  cartItems: CartItemResponse[];
}

export interface StaffBulkCartOptionRequest {
  productFranchiseId: string;
  quantity: number;
}

export interface StaffBulkCartItemRequest {
  productFranchiseId: string;
  quantity: number;
  note?: string;
  options?: StaffBulkCartOptionRequest[];
}

export interface CreateCartByStaffBulkRequest {
  customerId: string;
  franchiseId: string;
  items: StaffBulkCartItemRequest[];
}

export interface StaffBulkCartOptionPayload {
  product_franchise_id: string;
  quantity: number;
}

export interface StaffBulkCartItemPayload {
  product_franchise_id: string;
  quantity: number;
  note?: string;
  options?: StaffBulkCartOptionPayload[];
}

export interface StaffBulkAddCartPayload {
  customer_id: string;
  franchise_id: string;
  items: StaffBulkCartItemPayload[];
}

export type GetCartsByCustomerResponse = CartResponse[];
export type GetCartDetailResponse = CartResponse;
export type UpdateCartResponse = CartResponse;
export type DeleteCartItemResponse = CartResponse;
export type UpdateCartOptionItemResponse = CartResponse | null;
export type RemoveCartOptionItemResponse = CartResponse | null;
export type ApplyVoucherInCartResponse = void;
export type RemoveVoucherInCartResponse = void;
export type CheckoutCartResponse = CartResponse;
export type CancelCartResponse = CartResponse;
export type CreateCartByStaffResponse = CartResponse;
export type CreateCartByStaffBulkResponse = CartResponse;
export type AddProductToCartByStaffResponse = CreateCartByStaffResponse;
export type AddProductToCartResponse = CartResponse;
export type StaffBulkAddCartResponse = CreateCartByStaffBulkResponse;

export type CountCartByCustomerResponse = number;
export type CountCartItemByCartResponse = number;
