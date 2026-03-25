import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import {
  useAddProductToCartMutation,
  useCartsByCustomerQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
  useUpdateCartItemOptionsMutation,
} from "@/hooks/cart/useCart.hook";
import type {
  AddProductToCartRequest,
  CartItemOptionRequest,
  CartResponse,
} from "@/types/cart";

export type CartItem = {
  id: string;
  orderId: string;
  cartId: string;
  cartItemId: string;
  franchiseId: string;
  franchiseName: string;
  productFranchiseId: string;
  productNameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
  options: CartItemOptionRequest[];
  address: string;
  phone: string;
  note?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export interface Cart {
  id: string;
  code: string;
  franchiseId: string;
  customerId: string;
  type: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  items: CartItem[];
}

type AddItemMeta = {
  franchiseId?: string;
  address?: string;
  phone?: string;
  note?: string;
  message?: string;
  options?: CartItemOptionRequest[];
};

const EMPTY_CART: Cart = {
  id: "active-cart",
  code: "ACTIVE",
  franchiseId: "",
  customerId: "",
  type: "ONLINE",
  status: "ACTIVE",
  totalAmount: 0,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  isDeleted: false,
  items: [],
};

function normalizeOptions(options?: CartItemOptionRequest[]) {
  if (!Array.isArray(options)) return [];

  return options
    .filter((option) => !!option?.productFranchiseId && option.quantity > 0)
    .map((option) => ({
      productFranchiseId: String(option.productFranchiseId),
      quantity: Math.max(1, Number(option.quantity || 1)),
    }))
    .sort((left, right) => {
      if (left.productFranchiseId === right.productFranchiseId) {
        return left.quantity - right.quantity;
      }

      return left.productFranchiseId.localeCompare(right.productFranchiseId);
    });
}

// Flatten grouped cart responses into the legacy item shape still used by header/payment screens.
function mapCartItems(carts: CartResponse[]): CartItem[] {
  return carts.flatMap((cart) =>
    cart.cartItems.map((item) => ({
      id: item.cartItemId,
      orderId: cart.id,
      cartId: cart.id,
      cartItemId: item.cartItemId,
      franchiseId: cart.franchiseId,
      franchiseName: cart.franchiseName ?? "Franchise",
      productFranchiseId: item.productFranchiseId,
      productNameSnapshot: item.productName ?? item.productFranchiseId,
      priceSnapshot: Number(item.productCartPrice || 0),
      quantity: Number(item.quantity || 0),
      lineTotal: Number(item.finalLineTotal || item.lineTotal || 0),
      imageUrl: item.productImageUrl ?? undefined,
      options: (item.options ?? []).map((option) => ({
        productFranchiseId: option.productFranchiseId,
        quantity: option.quantity,
      })),
      address: cart.address ?? "",
      phone: cart.phone ?? "",
      note: item.note ?? "",
      message: cart.message,
      createdAt: cart.createdAt ?? EMPTY_CART.createdAt,
      updatedAt: cart.updatedAt ?? EMPTY_CART.updatedAt,
      isDeleted: cart.isDeleted ?? false,
    })),
  );
}

export function useCart() {
  const { authUser } = useAuthStore();
  const customerId = authUser?.user?.id ?? "";
  const [pendingCartItemIds, setPendingCartItemIds] = useState<string[]>([]);

  const cartsQuery = useCartsByCustomerQuery(
    { customerId, status: "ACTIVE" },
    !!customerId,
  );
  const addProductMutation = useAddProductToCartMutation();
  const deleteItemMutation = useDeleteCartItemMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const updateCartItemOptionsMutation = useUpdateCartItemOptionsMutation();

  const carts = useMemo(() => cartsQuery.data ?? [], [cartsQuery.data]);
  const items = useMemo(() => mapCartItems(carts), [carts]);
  const itemsByCartItemId = useMemo(
    () => new Map(items.map((item) => [item.cartItemId, item])),
    [items],
  );

  const subtotal = useMemo(
    () =>
      carts.reduce(
        (sum, singleCart) => sum + Number(singleCart.subtotalAmount || 0),
        0,
      ),
    [carts],
  );

  const totalAmount = useMemo(
    () =>
      carts.reduce(
        (sum, singleCart) => sum + Number(singleCart.finalAmount || 0),
        0,
      ),
    [carts],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const cart: Cart = {
    ...EMPTY_CART,
    franchiseId: carts[0]?.franchiseId ?? "",
    customerId,
    totalAmount,
    createdAt: carts[0]?.createdAt ?? EMPTY_CART.createdAt,
    updatedAt: carts[0]?.updatedAt ?? new Date().toISOString(),
    items,
  };

  // Add-to-cart still snapshots shipping info early, so reuse the latest cart/user defaults.
  const resolveDefaultCartData = (meta?: AddItemMeta) => {
    const currentCart = carts[0];
    const defaultPhone =
      meta?.phone?.trim() ||
      currentCart?.phone ||
      authUser?.user?.phone ||
      "0900000000";

    const defaultAddress =
      meta?.address?.trim() ||
      currentCart?.address ||
      authUser?.user?.address ||
      "N/A";

    return {
      phone: defaultPhone,
      address: defaultAddress,
      note: meta?.note,
      message: meta?.message,
    };
  };

  const findFranchiseId = (productFranchiseId: string, meta?: AddItemMeta) => {
    if (meta?.franchiseId) return String(meta.franchiseId);

    const fromExistingItem = items.find(
      (item) => item.productFranchiseId === productFranchiseId,
    )?.franchiseId;

    return (
      fromExistingItem ||
      carts[0]?.franchiseId ||
      authUser?.currentFranchiseId ||
      ""
    );
  };

  // Keep item-level pending state local so +/-/remove/note save cannot be double-submitted.
  const setItemPendingState = (cartItemId: string, pending: boolean) => {
    setPendingCartItemIds((current) => {
      if (pending) {
        return current.includes(cartItemId)
          ? current
          : [...current, cartItemId];
      }

      return current.filter((id) => id !== cartItemId);
    });
  };

  const isItemPending = (cartItemId: string) =>
    pendingCartItemIds.includes(cartItemId);

  const findItemByCartItemId = (cartItemId: string) =>
    itemsByCartItemId.get(cartItemId);

  const createAddProductPayload = (
    productFranchiseId: string,
    quantity: number,
    meta?: AddItemMeta,
  ): AddProductToCartRequest | null => {
    if (!productFranchiseId || quantity <= 0) return null;

    const franchiseId = findFranchiseId(productFranchiseId, meta);
    if (!franchiseId) {
      toast.error("Unable to determine which store this item belongs to");
      return null;
    }

    const defaults = resolveDefaultCartData(meta);

    // The cart API expects franchise, shipping, and selected options on every add call.
    return {
      franchiseId,
      productFranchiseId,
      quantity,
      address: defaults.address,
      phone: defaults.phone,
      note: defaults.note,
      message: defaults.message,
      options: normalizeOptions(meta?.options),
    };
  };

  const addItemAsync = async (
    productId: string | number,
    _productName: string,
    _price: number,
    quantity = 1,
    _imageUrl?: string,
    meta?: AddItemMeta,
  ): Promise<boolean> => {
    if (!customerId) {
      toast.error("Please sign in to use your cart");
      return false;
    }

    const productFranchiseId = String(productId || "");
    const payload = createAddProductPayload(productFranchiseId, quantity, meta);

    if (!payload) return false;

    try {
      await addProductMutation.mutateAsync(payload);
      return true;
    } catch {
      return false;
    }
  };

  const addItem = (
    productId: string | number,
    productName: string,
    price: number,
    quantity = 1,
    imageUrl?: string,
    meta?: AddItemMeta,
  ) => {
    void addItemAsync(
      productId,
      productName,
      price,
      quantity,
      imageUrl,
      meta,
    );
  };

  const removeItem = async (cartItemId: string): Promise<boolean> => {
    if (!cartItemId || isItemPending(cartItemId)) {
      return false;
    }

    const targetItem = findItemByCartItemId(cartItemId);
    if (!targetItem) return false;

    setItemPendingState(cartItemId, true);

    try {
      await deleteItemMutation.mutateAsync(targetItem.cartItemId);
      return true;
    } catch {
      return false;
    } finally {
      setItemPendingState(cartItemId, false);
    }
  };

  const updateItemQuantity = async (
    cartItemId: string,
    quantity: number,
  ): Promise<boolean> => {
    if (!cartItemId || quantity <= 0 || isItemPending(cartItemId)) {
      return false;
    }

    const targetItem = findItemByCartItemId(cartItemId);
    if (!targetItem || Number(targetItem.quantity || 0) === quantity) {
      return false;
    }

    setItemPendingState(cartItemId, true);

    try {
      await updateCartItemMutation.mutateAsync({
        cartItemId: targetItem.cartItemId,
        quantity,
      });
      return true;
    } catch {
      return false;
    } finally {
      setItemPendingState(cartItemId, false);
    }
  };

  // Item notes piggyback on update-cart-item until the backend exposes a dedicated note endpoint.
  const saveItemNote = async (
    cartItemId: string,
    note: string,
  ): Promise<boolean> => {
    if (!cartItemId || isItemPending(cartItemId)) {
      return false;
    }

    const targetItem = findItemByCartItemId(cartItemId);
    if (!targetItem) return false;

    const normalizedNote = note.trim();
    if (String(targetItem.note ?? "") === normalizedNote) {
      return false;
    }

    setItemPendingState(cartItemId, true);

    try {
      await updateCartItemMutation.mutateAsync({
        cartItemId: targetItem.cartItemId,
        quantity: Math.max(1, Number(targetItem.quantity || 1)),
        note: normalizedNote,
      });
      return true;
    } catch {
      return false;
    } finally {
      setItemPendingState(cartItemId, false);
    }
  };

  const saveEditedItem = async (
    cartItemId: string,
    options: CartItemOptionRequest[],
  ): Promise<boolean> => {
    if (!cartItemId || isItemPending(cartItemId)) {
      return false;
    }

    const targetItem = findItemByCartItemId(cartItemId);
    if (!targetItem) return false;

    const normalizedCurrentOptions = normalizeOptions(targetItem.options);
    const normalizedNextOptions = normalizeOptions(options);

    const isSameOptions =
      JSON.stringify(normalizedCurrentOptions) ===
      JSON.stringify(normalizedNextOptions);

    if (isSameOptions) {
      return true;
    }

    setItemPendingState(cartItemId, true);

    try {
      await updateCartItemOptionsMutation.mutateAsync({
        cartItemId: targetItem.cartItemId,
        options: normalizedNextOptions,
      });
      return true;
    } catch {
      return false;
    } finally {
      setItemPendingState(cartItemId, false);
    }
  };

  const clearCart = () => {
    const uniqueCartItemIds = Array.from(
      new Set(items.map((item) => item.cartItemId)),
    );

    uniqueCartItemIds.forEach((cartItemId) => {
      deleteItemMutation.mutate(cartItemId);
    });
  };

  return {
    cart,
    carts,
    addItem,
    addItemAsync,
    updateItemQuantity,
    saveItemNote,
    saveEditedItem,
    removeItem,
    clearCart,
    subtotal,
    totalAmount,
    itemCount,
    isItemPending,
    isLoading: cartsQuery.isLoading,
  };
}

