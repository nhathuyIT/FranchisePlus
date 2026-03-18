export type CartStatus = string;

export interface CartItemOptionRequest {
  productFranchiseId: string;
  quantity: number;
}

export interface AddProductToCartByStaffRequest {
  customerId: string;
  franchiseId: string;
  productFranchiseId: string;
  quantity: number;
  address: string;
  phone: string;
  note?: string;
  message?: string;
  options?: CartItemOptionRequest[];
}

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

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
  note?: string;
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
  name?: string;
  imageUrl?: string | null;
}

export interface CartOptionResponse {
  quantity: number;
  productFranchiseId: string;
  priceSnapshot?: number;
  discountAmount?: number;
  finalPrice?: number;
  productName?: string;
  productImageUrl?: string | null;
  product?: CartProductInfo;
}

export interface CartItemResponse {
  cartItemId: string;
  quantity: number;
  productFranchiseId: string;
  productCartPrice: number;
  discountAmount?: number;
  lineTotal?: number;
  finalLineTotal?: number;
  optionsHash?: string;
  note?: string;
  productName?: string;
  productImageUrl?: string | null;
  product?: CartProductInfo;
  options: CartOptionResponse[];
}

export interface CartResponse {
  id: string;
  customerId: string;
  franchiseId: string;
  staffId?: string;
  status: CartStatus;
  address: string;
  phone: string;
  note?: string;
  message?: string;
  promotionDiscount?: number;
  promotionType?: string;
  promotionValue?: number;
  voucherDiscount?: number;
  loyaltyPointsUsed?: number;
  loyaltyDiscount?: number;
  subtotalAmount: number;
  finalAmount: number;
  promotionId?: string;
  voucherId?: string;
  franchiseName: string;
  customerName?: string;
  staffName?: string;
  staffEmail?: string;
  cartItems: CartItemResponse[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  isActive?: boolean;
}

export type GetCartsByCustomerResponse = CartResponse[];
export type GetCartDetailResponse = CartResponse;
export type UpdateCartResponse = CartResponse;
export type DeleteCartItemResponse = CartResponse;
export type UpdateCartItemResponse = CartResponse;
export type UpdateCartOptionItemResponse = CartResponse;
export type RemoveCartOptionItemResponse = CartResponse;
export type ApplyVoucherInCartResponse = CartResponse;
export type RemoveVoucherInCartResponse = CartResponse;
export type CheckoutCartResponse = CartResponse;
export type CancelCartResponse = CartResponse;
export type AddProductToCartByStaffResponse = CartResponse;
export type AddProductToCartResponse = CartResponse;

export type CountCartByCustomerResponse = number;
export type CountCartItemByCartResponse = number;
