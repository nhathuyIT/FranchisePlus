import { useEffect, useMemo, useState } from "react";
import type { CartResponse } from "@/types/cart";

const CART_SELECTION_STORAGE_KEY = "client-cart-selected-item-ids";

const readStoredSelection = () => {
  if (typeof window === "undefined") {
    return { ids: [] as string[], hasStoredSelection: false };
  }

  try {
    const raw = window.sessionStorage.getItem(CART_SELECTION_STORAGE_KEY);

    if (!raw) {
      return { ids: [] as string[], hasStoredSelection: false };
    }

    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed)
      ? parsed.filter(
          (cartItemId): cartItemId is string =>
            typeof cartItemId === "string" && cartItemId.length > 0,
        )
      : [];

    return {
      ids,
      hasStoredSelection: true,
    };
  } catch {
    return { ids: [] as string[], hasStoredSelection: false };
  }
};

export function useCartSelection(carts: CartResponse[]) {
  const initialSelection = useMemo(() => readStoredSelection(), []);
  const [selectedItemIdsState, setSelectedItemIdsState] = useState<string[]>(
    initialSelection.ids,
  );
  const [hasStoredSelection, setHasStoredSelection] = useState<boolean>(
    initialSelection.hasStoredSelection,
  );

  const allCartItemIds = useMemo(
    () => carts.flatMap((cart) => cart.cartItems.map((item) => item.cartItemId)),
    [carts],
  );

  const selectedItemIds = useMemo(() => {
    const validSelection = selectedItemIdsState.filter((cartItemId) =>
      allCartItemIds.includes(cartItemId),
    );

    if (hasStoredSelection) {
      return validSelection;
    }

    return allCartItemIds;
  }, [allCartItemIds, hasStoredSelection, selectedItemIdsState]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.sessionStorage.setItem(
      CART_SELECTION_STORAGE_KEY,
      JSON.stringify(selectedItemIds),
    );
  }, [selectedItemIds]);

  const commitSelection = (nextSelectedItemIds: string[]) => {
    setHasStoredSelection(true);
    setSelectedItemIdsState(nextSelectedItemIds);
  };

  const toggleItem = (cartItemId: string, checked: boolean) => {
    if (checked) {
      commitSelection(
        selectedItemIds.includes(cartItemId)
          ? selectedItemIds
          : [...selectedItemIds, cartItemId],
      );
      return;
    }

    commitSelection(selectedItemIds.filter((id) => id !== cartItemId));
  };

  const toggleCart = (cartId: string, checked: boolean) => {
    const cart = carts.find((singleCart) => singleCart.id === cartId);
    if (!cart) return;

    const cartItemIds = cart.cartItems.map((item) => item.cartItemId);

    if (checked) {
      commitSelection(Array.from(new Set([...selectedItemIds, ...cartItemIds])));
      return;
    }

    commitSelection(selectedItemIds.filter((id) => !cartItemIds.includes(id)));
  };

  const toggleAll = (checked: boolean) => {
    commitSelection(checked ? allCartItemIds : []);
  };

  const removeSelection = (cartItemId: string) => {
    commitSelection(selectedItemIds.filter((id) => id !== cartItemId));
  };

  const isCartChecked = (cartId: string) => {
    const cart = carts.find((singleCart) => singleCart.id === cartId);
    if (!cart || cart.cartItems.length === 0) return false;

    return cart.cartItems.every((item) => selectedItemIds.includes(item.cartItemId));
  };

  const isCartIndeterminate = (cartId: string) => {
    const cart = carts.find((singleCart) => singleCart.id === cartId);
    if (!cart || cart.cartItems.length === 0) return false;

    const selectedCount = cart.cartItems.filter((item) =>
      selectedItemIds.includes(item.cartItemId),
    ).length;

    return selectedCount > 0 && selectedCount < cart.cartItems.length;
  };

  const selectedItemCount = useMemo(
    () =>
      carts.reduce(
        (sum, cart) =>
          sum +
          cart.cartItems.reduce(
            (cartSum, item) =>
              cartSum +
              (selectedItemIds.includes(item.cartItemId) ? Number(item.quantity || 0) : 0),
            0,
          ),
        0,
      ),
    [carts, selectedItemIds],
  );

  // When a whole shop cart is selected, trust cart-level totals so discounts stay consistent.
  const selectedTotalBeforeDiscount = useMemo(
    () =>
      carts.reduce((sum, cart) => {
        const selectedCartItems = cart.cartItems.filter((item) =>
          selectedItemIds.includes(item.cartItemId),
        );

        if (selectedCartItems.length === 0) return sum;
        if (selectedCartItems.length === cart.cartItems.length) {
          return sum + Number(cart.subtotalAmount || 0);
        }

        return (
          sum +
          selectedCartItems.reduce(
            (cartSum, item) => cartSum + Number(item.lineTotal || item.finalLineTotal || 0),
            0,
          )
        );
      }, 0),
    [carts, selectedItemIds],
  );

  // Partial selections fall back to item totals because cart.finalAmount only applies to full-cart selection.
  const selectedPayable = useMemo(
    () =>
      carts.reduce((sum, cart) => {
        const selectedCartItems = cart.cartItems.filter((item) =>
          selectedItemIds.includes(item.cartItemId),
        );

        if (selectedCartItems.length === 0) return sum;
        if (selectedCartItems.length === cart.cartItems.length) {
          return sum + Number(cart.finalAmount || 0);
        }

        return (
          sum +
          selectedCartItems.reduce(
            (cartSum, item) => cartSum + Number(item.finalLineTotal || 0),
            0,
          )
        );
      }, 0),
    [carts, selectedItemIds],
  );

  const selectedSavings = Math.max(selectedTotalBeforeDiscount - selectedPayable, 0);
  const allChecked =
    allCartItemIds.length > 0 && selectedItemIds.length === allCartItemIds.length;
  const someChecked = selectedItemIds.length > 0 && !allChecked;

  return {
    selectedItemIds,
    toggleItem,
    toggleCart,
    toggleAll,
    removeSelection,
    isCartChecked,
    isCartIndeterminate,
    selectedItemCount,
    selectedTotalBeforeDiscount,
    selectedPayable,
    selectedSavings,
    allChecked,
    someChecked,
  };
}
