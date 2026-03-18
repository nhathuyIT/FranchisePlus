import { httpClient } from "../httpClient.api";
import type {
  AddProductToCartByStaffRequest,
  AddProductToCartByStaffResponse,
  AddProductToCartRequest,
  AddProductToCartResponse,
  ApplyVoucherInCartRequest,
  ApplyVoucherInCartResponse,
  CancelCartResponse,
  CheckoutCartResponse,
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
  UpdateCartItemRequest,
  UpdateCartItemResponse,
  UpdateCartOptionItemRequest,
  UpdateCartOptionItemResponse,
  UpdateCartRequest,
  UpdateCartResponse,
} from "@/types/cart";

export const addProductToCartByStaff = async (
  data: AddProductToCartByStaffRequest,
): Promise<AddProductToCartByStaffResponse> => {
  const response = await httpClient.post<
    AddProductToCartByStaffResponse,
    AddProductToCartByStaffRequest
  >({
    url: "/api/carts/items/staff",
    data,
  });

  return response!;
};

export const addProductToCart = async (
  data: AddProductToCartRequest,
): Promise<AddProductToCartResponse> => {
  const response = await httpClient.post<
    AddProductToCartResponse,
    AddProductToCartRequest
  >({
    url: "/api/carts/items",
    data,
  });

  return response!;
};

export const getCartsByCustomerId = async ({
  customerId,
  status,
}: GetCartsByCustomerParams): Promise<GetCartsByCustomerResponse> => {
  const response = await httpClient.get<
    GetCartsByCustomerResponse,
    { status?: string }
  >({
    url: `/api/carts/customer/${customerId}`,
    params: {
      status,
    },
  });

  return response!;
};

export const getCartDetail = async (
  cartId: string,
): Promise<GetCartDetailResponse> => {
  const response = await httpClient.get<GetCartDetailResponse>({
    url: `/api/carts/${cartId}`,
  });

  return response!;
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
  const response = await httpClient.put<UpdateCartResponse, UpdateCartRequest>({
    url: `/api/carts/${cartId}`,
    data,
  });

  return response!;
};

export const deleteCartItem = async (
  cartItemId: string,
): Promise<DeleteCartItemResponse> => {
  const response = await httpClient.delete<DeleteCartItemResponse>({
    url: `/api/carts/items/${cartItemId}`,
  });

  return response!;
};

export const updateCartItem = async (
  data: UpdateCartItemRequest,
): Promise<UpdateCartItemResponse> => {
  const response = await httpClient.patch<
    UpdateCartItemResponse,
    UpdateCartItemRequest
  >({
    url: "/api/carts/items/update-cart-item",
    data,
  });

  return response!;
};

export const updateOptionItemQuantity = async (
  data: UpdateCartOptionItemRequest,
): Promise<UpdateCartOptionItemResponse> => {
  const response = await httpClient.patch<
    UpdateCartOptionItemResponse,
    UpdateCartOptionItemRequest
  >({
    url: "/api/carts/items/update-option",
    data,
  });

  return response!;
};

export const removeOptionItem = async (
  data: RemoveCartOptionItemRequest,
): Promise<RemoveCartOptionItemResponse> => {
  const response = await httpClient.patch<
    RemoveCartOptionItemResponse,
    RemoveCartOptionItemRequest
  >({
    url: "/api/carts/items/remove-option",
    data,
  });

  return response!;
};

export const applyVoucherInCart = async (
  cartId: string,
  data: ApplyVoucherInCartRequest,
): Promise<ApplyVoucherInCartResponse> => {
  const response = await httpClient.put<
    ApplyVoucherInCartResponse,
    ApplyVoucherInCartRequest
  >({
    url: `/api/carts/${cartId}/apply-voucher`,
    data,
  });

  return response!;
};

export const removeVoucherInCart = async (
  cartId: string,
): Promise<RemoveVoucherInCartResponse> => {
  const response = await httpClient.delete<RemoveVoucherInCartResponse>({
    url: `/api/carts/${cartId}/remove-voucher`,
  });

  return response!;
};

export const checkoutCart = async (
  cartId: string,
): Promise<CheckoutCartResponse> => {
  const response = await httpClient.put<CheckoutCartResponse>({
    url: `/api/carts/${cartId}/checkout`,
  });

  return response!;
};

export const cancelCart = async (
  cartId: string,
): Promise<CancelCartResponse> => {
  const response = await httpClient.put<CancelCartResponse>({
    url: `/api/carts/${cartId}/cancel`,
  });

  return response!;
};
