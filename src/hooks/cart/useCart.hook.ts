import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as cartApi from "@/api/cart/cart.api";
import type {
  AddProductToCartByStaffRequest,
  AddProductToCartRequest,
  ApplyVoucherInCartRequest,
  CartStatus,
  CountCartByCustomerParams,
  GetCartsByCustomerParams,
  RemoveCartOptionItemRequest,
  UpdateCartOptionItemRequest,
  UpdateCartRequest,
} from "@/types/cart";

/**
 * Centralized react-query keys for all cart-related queries.
 *
 * Usage:
 * - Use `CART_KEYS.detail(cartId)` when invalidating a single cart detail query.
 * - Use `CART_KEYS.byCustomer({ customerId, status })` for customer cart lists.
 */
export const CART_KEYS = {
  all: ["carts"] as const,
  lists: () => [...CART_KEYS.all, "list"] as const,
  byCustomer: (params: GetCartsByCustomerParams) =>
    [...CART_KEYS.lists(), "customer", params] as const,
  details: () => [...CART_KEYS.all, "detail"] as const,
  detail: (cartId: string) => [...CART_KEYS.details(), cartId] as const,
  counts: () => [...CART_KEYS.all, "count"] as const,
  countByCustomer: (params: CountCartByCustomerParams) =>
    [...CART_KEYS.counts(), "customer", params] as const,
  countItemsByCart: (cartId: string) =>
    [...CART_KEYS.counts(), "items", cartId] as const,
};

/**
 * Internal helper used by mutations to refresh affected cart caches.
 *
 * Usage:
 * - Pass `cartId` when the mutation changes one specific cart.
 * - Pass `customerId` and `status` when customer cart list/count should refresh.
 */
const invalidateCartQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  options?: {
    cartId?: string;
    customerId?: string;
    status?: CartStatus;
  },
) => {
  await queryClient.invalidateQueries({ queryKey: CART_KEYS.all });

  if (options?.cartId) {
    await queryClient.invalidateQueries({
      queryKey: CART_KEYS.detail(options.cartId),
    });
    await queryClient.invalidateQueries({
      queryKey: CART_KEYS.countItemsByCart(options.cartId),
    });
  }

  if (options?.customerId) {
    await queryClient.invalidateQueries({
      queryKey: CART_KEYS.byCustomer({
        customerId: options.customerId,
        status: options.status,
      }),
    });
    await queryClient.invalidateQueries({
      queryKey: CART_KEYS.countByCustomer({
        customerId: options.customerId,
        status: options.status,
      }),
    });
  }
};

/**
 * Fetch all carts of one customer, optionally filtered by status.
 *
 * Usage:
 * `const cartsQuery = useCartsByCustomerQuery({ customerId, status: "ACTIVE" });`
 */
export const useCartsByCustomerQuery = (
  params: GetCartsByCustomerParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: CART_KEYS.byCustomer(params),
    queryFn: () => cartApi.getCartsByCustomerId(params),
    enabled: !!params.customerId && enabled,
  });
};

/**
 * Fetch detail of a single cart by cart id.
 *
 * Usage:
 * `const cartDetailQuery = useCartDetailQuery(cartId, !!cartId);`
 */
export const useCartDetailQuery = (cartId: string, enabled = true) => {
  return useQuery({
    queryKey: CART_KEYS.detail(cartId),
    queryFn: () => cartApi.getCartDetail(cartId),
    enabled: !!cartId && enabled,
  });
};

/**
 * Fetch the number of carts for a customer.
 *
 * Usage:
 * `const cartCountQuery = useCountCartByCustomerQuery({ customerId, status: "ACTIVE" });`
 */
export const useCountCartByCustomerQuery = (
  params: CountCartByCustomerParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: CART_KEYS.countByCustomer(params),
    queryFn: () => cartApi.countCartByCustomerId(params),
    enabled: !!params.customerId && enabled,
  });
};

/**
 * Fetch the number of cart items inside one cart.
 *
 * Usage:
 * `const cartItemCountQuery = useCountCartItemByCartQuery(cartId, !!cartId);`
 */
export const useCountCartItemByCartQuery = (
  cartId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: CART_KEYS.countItemsByCart(cartId),
    queryFn: () => cartApi.countCartItemByCartId(cartId),
    enabled: !!cartId && enabled,
  });
};

/**
 * Add a product to cart on staff/admin flow.
 *
 * Usage:
 * `const addByStaff = useAddProductToCartByStaffMutation();`
 * `addByStaff.mutate({ customerId, franchiseId, productFranchiseId, quantity, address, phone, options });`
 */
export const useAddProductToCartByStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddProductToCartByStaffRequest) =>
      cartApi.addProductToCartByStaff(data),
    onSuccess: async (_response, variables) => {
      await invalidateCartQueries(queryClient, {
        customerId: variables.customerId,
        status: "ACTIVE",
      });
      toast.success("Product added to cart successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to add product to cart", {
        description: error.message,
      });
    },
  });
};

/**
 * Add a product to cart on customer flow.
 *
 * Usage:
 * `const addToCart = useAddProductToCartMutation();`
 * `addToCart.mutate({ franchiseId, productFranchiseId, quantity, address, phone, options });`
 */
export const useAddProductToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddProductToCartRequest) => cartApi.addProductToCart(data),
    onSuccess: async () => {
      await invalidateCartQueries(queryClient);
      toast.success("Product added to cart successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to add product to cart", {
        description: error.message,
      });
    },
  });
};

/**
 * Update cart-level information such as address, phone, note, or message.
 *
 * Usage:
 * `const updateCart = useUpdateCartMutation();`
 * `updateCart.mutate({ cartId, data: { address, phone, note } });`
 */
export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      data,
    }: {
      cartId: string;
      data: UpdateCartRequest;
    }) => cartApi.updateCart(cartId, data),
    onSuccess: async (_response, variables) => {
      await invalidateCartQueries(queryClient, {
        cartId: variables.cartId,
      });
      toast.success("Cart updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update cart", {
        description: error.message,
      });
    },
  });
};

/**
 * Delete one cart item from a cart.
 *
 * Usage:
 * `const deleteCartItem = useDeleteCartItemMutation();`
 * `deleteCartItem.mutate(cartItemId);`
 */
export const useDeleteCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => cartApi.deleteCartItem(cartItemId),
    onSuccess: async (response) => {
      await invalidateCartQueries(queryClient, {
        cartId: response?.id,
        customerId: response?.customerId,
        status: response?.status,
      });
      toast.success("Cart item deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete cart item", {
        description: error.message,
      });
    },
  });
};

/**
 * Update quantity of one option item inside a cart item.
 *
 * Usage:
 * `const updateOption = useUpdateCartOptionItemMutation();`
 * `updateOption.mutate({ cartItemId, optionProductFranchiseId, quantity });`
 */
export const useUpdateCartOptionItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartOptionItemRequest) =>
      cartApi.updateOptionItemQuantity(data),
    onSuccess: async (response) => {
      await invalidateCartQueries(queryClient, {
        cartId: response?.id,
        customerId: response?.customerId,
        status: response?.status,
      });
      toast.success("Cart option updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update cart option", {
        description: error.message,
      });
    },
  });
};

/**
 * Remove one option item from a cart item.
 *
 * Usage:
 * `const removeOption = useRemoveCartOptionItemMutation();`
 * `removeOption.mutate({ cartItemId, optionProductFranchiseId });`
 */
export const useRemoveCartOptionItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveCartOptionItemRequest) =>
      cartApi.removeOptionItem(data),
    onSuccess: async (response) => {
      await invalidateCartQueries(queryClient, {
        cartId: response?.id,
        customerId: response?.customerId,
        status: response?.status,
      });
      toast.success("Cart option removed successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to remove cart option", {
        description: error.message,
      });
    },
  });
};

/**
 * Apply a voucher code to a cart.
 *
 * Usage:
 * `const applyVoucher = useApplyVoucherInCartMutation();`
 * `applyVoucher.mutate({ cartId, data: { voucherCode } });`
 */
export const useApplyVoucherInCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      data,
    }: {
      cartId: string;
      data: ApplyVoucherInCartRequest;
    }) => cartApi.applyVoucherInCart(cartId, data),
    onSuccess: async (response, variables) => {
      await invalidateCartQueries(queryClient, {
        cartId: variables.cartId,
        customerId: response?.customerId,
        status: response?.status,
      });
      toast.success("Voucher applied successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to apply voucher", {
        description: error.message,
      });
    },
  });
};

/**
 * Remove the current voucher from a cart.
 *
 * Usage:
 * `const removeVoucher = useRemoveVoucherInCartMutation();`
 * `removeVoucher.mutate(cartId);`
 */
export const useRemoveVoucherInCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => cartApi.removeVoucherInCart(cartId),
    onSuccess: async (response, cartId) => {
      await invalidateCartQueries(queryClient, {
        cartId,
        customerId: response?.customerId,
        status: response?.status,
      });
      toast.success("Voucher removed successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to remove voucher", {
        description: error.message,
      });
    },
  });
};

/**
 * Checkout an existing cart.
 *
 * Usage:
 * `const checkoutCart = useCheckoutCartMutation();`
 * `checkoutCart.mutate(cartId);`
 */
export const useCheckoutCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => cartApi.checkoutCart(cartId),
    onSuccess: async (response, cartId) => {
      await invalidateCartQueries(queryClient, {
        cartId,
        customerId: response?.customerId,
        status: response?.status,
      });
      toast.success("Cart checked out successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to checkout cart", {
        description: error.message,
      });
    },
  });
};

/**
 * Cancel an existing cart.
 *
 * Usage:
 * `const cancelCart = useCancelCartMutation();`
 * `cancelCart.mutate(cartId);`
 */
export const useCancelCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => cartApi.cancelCart(cartId),
    onSuccess: async (response, cartId) => {
      await invalidateCartQueries(queryClient, {
        cartId,
        customerId: response?.customerId,
        status: response?.status,
      });
      toast.success("Cart cancelled successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to cancel cart", {
        description: error.message,
      });
    },
  });
};
