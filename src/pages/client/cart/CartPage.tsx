import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useCart } from "./useCart";
import { useCartSelection } from "./useCartSelection";
import {
  useApplyVoucherInCartMutation,
  useCancelCartMutation,
  useRemoveVoucherInCartMutation,
  useUpdateCartMutation,
} from "@/hooks/cart/useCart.hook";
import { ROUTER_URL } from "@/router/route.const";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import { useLoadingStore } from "@/stores/loading.store";
import CartEmpty from "./components/CartEmpty";
import CartPageHeader from "./components/CartPageHeader";
import CartSummary from "./components/CartSummary";
import CartTableHeader from "./components/CartTableHeader";
import CartStoreSection from "./components/CartStoreSection";
import CartVoucherDialog from "./components/CartVoucherDialog";

const CartPage: React.FC = () => {
  const {
    carts,
    updateItemQuantity,
    removeItem,
    saveItemNote,
    saveEditedItem,
    itemCount,
    isLoading,
    isItemPending,
  } = useCart();
  const navigate = useNavigate();
  const applyVoucherMutation = useApplyVoucherInCartMutation();
  const cancelCartMutation = useCancelCartMutation();
  const removeVoucherMutation = useRemoveVoucherInCartMutation();
  const updateCartMutation = useUpdateCartMutation();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const isNavigatingToCheckoutRef = useRef(false);

  const [voucherDialogCartId, setVoucherDialogCartId] = useState<string | null>(
    null,
  );
  const [voucherInputs, setVoucherInputs] = useState<Record<string, string>>(
    {},
  );
  const [cancellingCartIds, setCancellingCartIds] = useState<string[]>([]);
  const [voucherPendingCartIds, setVoucherPendingCartIds] = useState<string[]>(
    [],
  );
  const [savingMessageCartId, setSavingMessageCartId] = useState<string | null>(
    null,
  );
  const [cartActionLoadingCount, setCartActionLoadingCount] = useState(0);

  const {
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
  } = useCartSelection(carts);

  const voucherDialogCart = useMemo(
    () => carts.find((cart) => cart.id === voucherDialogCartId) ?? null,
    [carts, voucherDialogCartId],
  );

  const isCartActionLoading = cartActionLoadingCount > 0;

  const runWithCartActionLoading = async <T,>(
    action: () => Promise<T>,
  ): Promise<T> => {
    setCartActionLoadingCount((current) => current + 1);

    try {
      return await action();
    } finally {
      setCartActionLoadingCount((current) => Math.max(0, current - 1));
    }
  };

  const handleRemove = (cartItemId: string) => {
    void runWithCartActionLoading(async () => {
      const wasRemoved = await removeItem(cartItemId);
      if (wasRemoved) {
        removeSelection(cartItemId);
      }

      return wasRemoved;
    });
  };

  // Voucher/cancel/save-message run per shop cart, so pending state is tracked by cartId.
  const setCancellingCartState = (cartId: string, pending: boolean) => {
    setCancellingCartIds((current) => {
      if (pending) {
        return current.includes(cartId) ? current : [...current, cartId];
      }

      return current.filter((id) => id !== cartId);
    });
  };

  const setVoucherPendingState = (cartId: string, pending: boolean) => {
    setVoucherPendingCartIds((current) => {
      if (pending) {
        return current.includes(cartId) ? current : [...current, cartId];
      }

      return current.filter((id) => id !== cartId);
    });
  };

  const isCancellingCart = (cartId: string) =>
    cancellingCartIds.includes(cartId);
  const isVoucherPending = (cartId: string) =>
    voucherPendingCartIds.includes(cartId);

  const handleCancelCart = (cartId: string) => {
    if (!cartId || isCancellingCart(cartId)) return;

    setCancellingCartState(cartId, true);

    void runWithCartActionLoading(async () => {
      try {
        await cancelCartMutation.mutateAsync(cartId);
        setVoucherDialogCartId((current) =>
          current === cartId ? null : current,
        );
      } finally {
        setCancellingCartState(cartId, false);
      }
    });
  };

  const handleCheckout = () => {
    const checkoutItemIds = selectedItemIds.filter((cartItemId) =>
      carts.some((singleCart) =>
        singleCart.cartItems.some((item) => item.cartItemId === cartItemId),
      ),
    );

    if (!checkoutItemIds.length) {
      return;
    }

    isNavigatingToCheckoutRef.current = true;
    setLoading(true);

    navigate(`${ROUTER_URL.CLIENT}/${ROUTER_URL.CLIENT_ROUTER.CHECKOUT}`, {
      state: {
        selectedCartItemIds: checkoutItemIds,
        showCheckoutLoading: true,
      },
    });
  };

  const openVoucherDialog = (cartId: string) => {
    setVoucherDialogCartId(cartId);
    setVoucherInputs((current) => ({
      ...current,
      [cartId]: current[cartId] ?? "",
    }));
  };

  const handleVoucherInputChange = (cartId: string, value: string) => {
    setVoucherInputs((current) => ({
      ...current,
      [cartId]: value,
    }));
  };

  const handleApplyVoucher = () => {
    if (!voucherDialogCart || isVoucherPending(voucherDialogCart.id)) return;

    const targetCartId = voucherDialogCart.id;
    const code = (voucherInputs[targetCartId] ?? "").trim();
    if (!code) return;

    setVoucherPendingState(targetCartId, true);

    void runWithCartActionLoading(async () => {
      try {
        await applyVoucherMutation.mutateAsync({
          cartId: targetCartId,
          data: { voucherCode: code },
        });
        setVoucherDialogCartId(null);
      } finally {
        setVoucherPendingState(targetCartId, false);
      }
    });
  };

  const handleRemoveVoucher = (cartId: string) => {
    if (!cartId || isVoucherPending(cartId)) return;

    setVoucherPendingState(cartId, true);

    void runWithCartActionLoading(async () => {
      try {
        await removeVoucherMutation.mutateAsync(cartId);
        setVoucherInputs((current) => ({
          ...current,
          [cartId]: "",
        }));
        setVoucherDialogCartId((current) =>
          current === cartId ? null : current,
        );
      } finally {
        setVoucherPendingState(cartId, false);
      }
    });
  };

  const handleSaveCartMessage = (cartId: string, message: string) => {
    setSavingMessageCartId(cartId);

    void runWithCartActionLoading(async () => {
      try {
        await updateCartMutation.mutateAsync({
          cartId,
          data: {
            message: message.trim(),
          },
        });
      } finally {
        setSavingMessageCartId((current) =>
          current === cartId ? null : current,
        );
      }
    });
  };

  useEffect(() => {
    if (!isNavigatingToCheckoutRef.current) {
      setLoading(isLoading);
    }

    return () => {
      if (!isNavigatingToCheckoutRef.current) {
        setLoading(false);
      }
    };
  }, [isLoading, setLoading]);

  if (isLoading) {
    return null;
  }

  if (itemCount === 0) {
    return <CartEmpty />;
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[var(--cart-page)] pb-48"
      style={
        {
          "--cart-page": "#f6efe7",
          "--cart-surface": "rgba(255,252,247,0.82)",
          "--cart-panel": "#fffaf5",
          "--cart-panel-strong": "#fffdf9",
          "--cart-border": "#e9d9cb",
          "--cart-border-soft": "#f2e7dc",
          "--cart-ink": "#3f2921",
          "--cart-muted": "#8b7163",
          "--cart-accent": "#b76843",
          "--cart-accent-deep": "#8f4a2e",
          "--cart-warm": "#f5e6d8",
        } as React.CSSProperties
      }
    >
      <NormalLoadingLayout forceShow={isCartActionLoading} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#f0d4bb]/55 blur-3xl" />
        <div className="absolute right-[-5rem] top-0 h-80 w-80 rounded-full bg-[#edd8c9]/70 blur-3xl" />
        <div className="absolute left-1/2 top-36 h-56 w-56 -translate-x-1/2 rounded-full bg-[#fff5ed]/90 blur-3xl" />
      </div>

      <CartPageHeader selectedItemCount={selectedItemCount} />

      <div className="relative mx-auto max-w-7xl px-4 pb-8">
        <section className="overflow-hidden rounded-[2rem] border border-[var(--cart-border)] bg-[var(--cart-surface)] shadow-[0_24px_70px_rgba(63,41,33,0.08)] backdrop-blur-md">
          <div className="border-b border-[var(--cart-border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,249,242,0.88)_100%)]">
            <CartTableHeader
              allChecked={allChecked}
              someChecked={someChecked}
              onToggleAll={toggleAll}
            />
          </div>

          <div className="space-y-5 p-4 md:p-5">
            {carts.map((singleCart) => (
              <CartStoreSection
                key={singleCart.id}
                cart={singleCart}
                hasAppliedVoucher={
                  Boolean(singleCart.voucherId) ||
                  Number(singleCart.voucherDiscount || 0) > 0
                }
                isVoucherPending={isVoucherPending(singleCart.id)}
                isCancellingCart={isCancellingCart(singleCart.id)}
                initialMessage={singleCart.message}
                isSavingMessage={
                  savingMessageCartId === singleCart.id &&
                  updateCartMutation.isPending
                }
                selectedItemIds={selectedItemIds}
                checked={isCartChecked(singleCart.id)}
                indeterminate={isCartIndeterminate(singleCart.id)}
                onToggleCart={(checked) => toggleCart(singleCart.id, checked)}
                onToggleItem={toggleItem}
                onSaveEditedItem={(item, options) =>
                  runWithCartActionLoading(() =>
                    saveEditedItem(item.cartItemId, options),
                  )
                }
                onUpdateQuantity={(cartItemId, quantity) =>
                  void runWithCartActionLoading(() =>
                    updateItemQuantity(cartItemId, quantity),
                  )
                }
                onRemove={handleRemove}
                onSaveItemNote={(cartItemId, note) =>
                  runWithCartActionLoading(() => saveItemNote(cartItemId, note))
                }
                isItemPending={isItemPending}
                onSaveMessage={(message) =>
                  handleSaveCartMessage(singleCart.id, message)
                }
                onCancelCart={() => handleCancelCart(singleCart.id)}
                onOpenVoucherDialog={() => openVoucherDialog(singleCart.id)}
                onRemoveVoucher={() => handleRemoveVoucher(singleCart.id)}
              />
            ))}
          </div>
        </section>

        <div className="mt-7">
          <Link
            to="/client/menu"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--cart-border)] bg-white/80 px-4 py-2.5 text-sm font-medium text-[var(--cart-ink)] shadow-[0_14px_30px_rgba(63,41,33,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#d6b9a7] hover:text-[var(--cart-accent)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>
      </div>

      <CartSummary
        allChecked={allChecked}
        someChecked={someChecked}
        selectedItemCount={selectedItemCount}
        selectedTotalBeforeDiscount={selectedTotalBeforeDiscount}
        selectedSavings={selectedSavings}
        selectedPayable={selectedPayable}
        onToggleAll={toggleAll}
        onCheckout={handleCheckout}
      />

      <CartVoucherDialog
        open={!!voucherDialogCart}
        cart={voucherDialogCart}
        voucherCode={
          voucherDialogCart ? voucherInputs[voucherDialogCart.id] || "" : ""
        }
        isApplying={
          voucherDialogCart ? isVoucherPending(voucherDialogCart.id) : false
        }
        onOpenChange={(open) => !open && setVoucherDialogCartId(null)}
        onVoucherCodeChange={(value) =>
          voucherDialogCart &&
          handleVoucherInputChange(voucherDialogCart.id, value)
        }
        onApply={handleApplyVoucher}
      />
    </div>
  );
};

export default CartPage;
