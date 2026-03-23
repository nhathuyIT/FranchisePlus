import { httpClient } from "../httpClient.api";
import type {
  CreateCartByStaffRequest,
  CreateCartByStaffResponse,
  CreateCartByStaffBulkRequest,
  CreateCartByStaffBulkResponse,
  AddProductToCartByStaffRequest,
  AddProductToCartByStaffResponse,
  AddProductToCartRequest,
  AddProductToCartResponse,
  ApplyVoucherInCartRequest,
  ApplyVoucherInCartResponse,
  CancelCartResponse,
  CheckoutCartResponse,
  CheckoutCartRequest,
  CountCartByCustomerParams,
  CountCartByCustomerResponse,
  CountCartItemByCartResponse,
  DeleteCartItemResponse,
  GetCartDetailResponse,
  GetCartsByCustomerParams,
  GetCartsByCustomerResponse,
  RemoveCartOptionItemRequest,
  RemoveCartOptionItemResponse,
  RemoveVoucherInCartResponse,
  UpdateCartOptionItemRequest,
  UpdateCartOptionItemResponse,
  UpdateCartRequest,
  UpdateCartResponse,
  CartOptionResponse,
  CartItemResponse,
  CartResponse,
  StaffBulkAddCartPayload,
} from "@/types/cart";

export type UpdateCartItemRequest = {
  cartItemId: string;
  quantity: number;
  note?: string;
};

export type UpdateCartItemResponse = CartResponse | null;

type RawCartProductInfo = {
  name?: string;
  imageUrl?: string;
  productName?: string;
  productImageUrl?: string;
};

type RawCartOptionResponse = Partial<CartOptionResponse> & {
  product?: RawCartProductInfo;
  productName?: string;
  productImageUrl?: string;
};

type RawCartItemResponse = Partial<CartItemResponse> & {
  product?: RawCartProductInfo;
  productName?: string;
  productImageUrl?: string;
  options?: RawCartOptionResponse[];
};

type RawCartResponse = Partial<CartResponse> & {
  id: string;
  customerId?: string;
  franchiseId?: string;
  staffId?: string;
  cartItems?: RawCartItemResponse[];
};

const normalizeCartProduct = (
  product?: RawCartProductInfo,
  fallback?: {
    name?: string;
    imageUrl?: string;
  },
) => ({
  productName:
    product?.name ||
    product?.productName ||
    fallback?.name ||
    "Unnamed product",
  productImageUrl:
    product?.imageUrl || product?.productImageUrl || fallback?.imageUrl || "",
});

const normalizeCartOption = (
  option: RawCartOptionResponse,
): CartOptionResponse => ({
  quantity: option.quantity ?? 0,
  productFranchiseId: option.productFranchiseId ?? "",
  priceSnapshot: option.priceSnapshot ?? 0,
  discountAmount: option.discountAmount ?? 0,
  finalPrice: option.finalPrice ?? 0,
  ...normalizeCartProduct(option.product, {
    name: option.productName,
    imageUrl: option.productImageUrl,
  }),
});

const normalizeCartItem = (item: RawCartItemResponse): CartItemResponse => ({
  cartItemId: item.cartItemId ?? "",
  quantity: item.quantity ?? 0,
  productFranchiseId: item.productFranchiseId ?? "",
  productCartPrice: item.productCartPrice ?? 0,
  discountAmount: item.discountAmount ?? 0,
  lineTotal: item.lineTotal ?? 0,
  finalLineTotal: item.finalLineTotal ?? 0,
  optionsHash: item.optionsHash ?? "",
  note: item.note ?? "",
  ...normalizeCartProduct(item.product, {
    name: item.productName,
    imageUrl: item.productImageUrl,
  }),
  options: (item.options ?? []).map(normalizeCartOption),
});

const normalizeCart = (cart: RawCartResponse): CartResponse => ({
  id: cart.id, // Nếu JSON trả về _id, đảm bảo bạn đã map (ví dụ: cart.id ?? cart._id ?? "")
  customerId: cart.customerId ?? "",
  franchiseId: cart.franchiseId ?? "",
  staffId: cart.staffId ?? "",
  status: cart.status ?? "ACTIVE",
  address: cart.address ?? "",
  phone: cart.phone ?? "",
  note: cart.note,
  message: cart.message ?? "",

  // Promotion
  promotionDiscount: cart.promotionDiscount ?? 0,
  promotionType: cart.promotionType ?? "",
  promotionValue: cart.promotionValue ?? 0,
  promotionId: cart.promotionId ?? "",

  // Voucher (Các trường mới được thêm vào ở đây)
  voucherDiscount: cart.voucherDiscount ?? 0,
  voucherId: cart.voucherId,
  voucherType: cart.voucherType, // Thêm mới
  voucherValue: cart.voucherValue, // Thêm mới
  voucherCode: cart.voucherCode, // Thêm mới

  // Loyalty
  loyaltyPointsUsed: cart.loyaltyPointsUsed ?? 0,
  loyaltyDiscount: cart.loyaltyDiscount ?? 0,

  // Amounts
  subtotalAmount: cart.subtotalAmount ?? 0,
  finalAmount: cart.finalAmount ?? 0,

  // Info
  franchiseName: cart.franchiseName ?? "",
  customerName: cart.customerName ?? "",
  staffName: cart.staffName ?? "",
  staffEmail: cart.staffEmail ?? "",

  // Items
  cartItems: (cart.cartItems ?? []).map(normalizeCartItem),

  // BaseTimestamp, SoftDeletable, Activatable
  createdAt: cart.createdAt ?? "",
  updatedAt: cart.updatedAt ?? "",
  isDeleted: cart.isDeleted ?? false,
  isActive: cart.isActive ?? true,
});

const toStaffBulkAddCartPayload = (
  data: CreateCartByStaffBulkRequest,
): StaffBulkAddCartPayload => ({
  customer_id: data.customerId,
  franchise_id: data.franchiseId,
  items: data.items.map((item) => ({
    product_franchise_id: item.productFranchiseId,
    quantity: item.quantity,
    note: item.note,
    options: item.options?.map((option) => ({
      product_franchise_id: option.productFranchiseId,
      quantity: option.quantity,
    })),
  })),
});

export const createCartByStaff = async (
  data: CreateCartByStaffRequest,
): Promise<CreateCartByStaffResponse> => {
  const response = await httpClient.post<
    RawCartResponse,
    CreateCartByStaffRequest
  >({
    url: "/api/carts/items/staff",
    data,
  });

  return normalizeCart(response!);
};
export const createCartByStaffBulk = async (
  data: CreateCartByStaffBulkRequest,
): Promise<CreateCartByStaffBulkResponse> => {
  const response = await httpClient.post<
    RawCartResponse,
    StaffBulkAddCartPayload
  >({
    url: "/api/carts/items/staff-bulk",
    data: toStaffBulkAddCartPayload(data),
  });

  return normalizeCart(response!);
};
export const addProductToCartByStaff = async (
  data: AddProductToCartByStaffRequest,
): Promise<AddProductToCartByStaffResponse> => createCartByStaff(data);

export const addProductToCart = async (
  data: AddProductToCartRequest,
): Promise<AddProductToCartResponse> => {
  const response = await httpClient.post<
    RawCartResponse,
    AddProductToCartRequest
  >({
    url: "/api/carts/items",
    data,
  });

  return normalizeCart(response!);
};

export const getCartsByCustomerId = async ({
  customerId,
  status,
}: GetCartsByCustomerParams): Promise<GetCartsByCustomerResponse> => {
  const response = await httpClient.get<RawCartResponse[], { status?: string }>(
    {
      url: `/api/carts/customer/${customerId}`,
      params: {
        status,
      },
    },
  );

  return (response ?? []).map(normalizeCart);
};

export const getCartDetail = async (
  cartId: string,
): Promise<GetCartDetailResponse> => {
  const response = await httpClient.get<RawCartResponse>({
    url: `/api/carts/${cartId}`,
  });

  return normalizeCart(response!);
};

export const countCartByCustomerId = async ({
  customerId,
  status,
}: CountCartByCustomerParams): Promise<CountCartByCustomerResponse> => {
  const response = await httpClient.get<
    CountCartByCustomerResponse,
    { status?: string }
  >({
    url: `/api/carts/customer/${customerId}/count-cart`,
    params: {
      status,
    },
  });

  return response!;
};

export const countCartItemByCartId = async (
  cartId: string,
): Promise<CountCartItemByCartResponse> => {
  const response = await httpClient.get<CountCartItemByCartResponse>({
    url: `/api/carts/${cartId}/count-cart-item`,
  });

  return response!;
};

export const updateCart = async (
  cartId: string,
  data: UpdateCartRequest,
): Promise<UpdateCartResponse> => {
  const response = await httpClient.put<RawCartResponse, UpdateCartRequest>({
    url: `/api/carts/${cartId}`,
    data,
  });

  return normalizeCart(response!);
};

export const deleteCartItem = async (
  cartItemId: string,
): Promise<DeleteCartItemResponse | null> => {
  const response = await httpClient.delete<RawCartResponse>({
    url: `/api/carts/items/${cartItemId}`,
  });

  if (!response) {
    return null;
  }

  return normalizeCart(response);
};

export const updateCartItem = async (
  data: UpdateCartItemRequest,
): Promise<UpdateCartItemResponse> => {
  const response = await httpClient.patch<
    RawCartResponse,
    UpdateCartItemRequest
  >({
    url: "/api/carts/items/update-cart-item",
    data,
  });

  if (!response) {
    return null;
  }

  return normalizeCart(response);
};

export const updateOptionItemQuantity = async (
  data: UpdateCartOptionItemRequest,
): Promise<UpdateCartOptionItemResponse> => {
  const response = await httpClient.patch<
    RawCartResponse,
    UpdateCartOptionItemRequest
  >({
    url: "/api/carts/items/update-option",
    data,
  });

  if (!response) {
    return null;
  }

  return normalizeCart(response);
};

export const removeOptionItem = async (
  data: RemoveCartOptionItemRequest,
): Promise<RemoveCartOptionItemResponse> => {
  const response = await httpClient.patch<
    RawCartResponse,
    RemoveCartOptionItemRequest
  >({
    url: "/api/carts/items/remove-option",
    data,
  });

  if (!response) {
    return null;
  }

  return normalizeCart(response);
};

export const applyVoucherInCart = async (
  cartId: string,
  data: ApplyVoucherInCartRequest,
): Promise<ApplyVoucherInCartResponse> => {
  await httpClient.put<null, ApplyVoucherInCartRequest>({
    url: `/api/carts/${cartId}/apply-voucher`,
    data,
  });
};

export const removeVoucherInCart = async (
  cartId: string,
): Promise<RemoveVoucherInCartResponse> => {
  await httpClient.delete<null>({
    url: `/api/carts/${cartId}/remove-voucher`,
  });
};

export const checkoutCart = async (
  cartId: string,
  data: CheckoutCartRequest,
): Promise<CheckoutCartResponse> => {
  const response = await httpClient.put<RawCartResponse, CheckoutCartRequest>({
    url: `/api/carts/${cartId}/checkout`,
    data,
  });

  return normalizeCart(response!);
};

export const cancelCart = async (
  cartId: string,
): Promise<CancelCartResponse> => {
  const response = await httpClient.put<RawCartResponse>({
    url: `/api/carts/${cartId}/cancel`,
  });

  return normalizeCart(response!);
};
