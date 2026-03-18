import React from "react";
import { useForm } from "react-hook-form";
import { MapPin, Store, TicketPercent } from "lucide-react";
import type { CartResponse } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useGetMenuByFranchise } from "@/hooks/client/useProduct.hook";
import { getSizeLabel } from "@/pages/client/menu/lib/helpers";
import CartItem from "./CartItem";
import { formatCurrency } from "../cart.utils";

type CartStoreMessageForm = {
  message: string;
};

interface CartStoreSectionProps {
  cart: CartResponse;
  hasAppliedVoucher: boolean;
  isVoucherPending: boolean;
  isCancellingCart: boolean;
  initialMessage?: string;
  isSavingMessage: boolean;
  selectedItemIds: string[];
  checked: boolean;
  indeterminate: boolean;
  onToggleCart: (checked: boolean) => void;
  onToggleItem: (cartItemId: string, checked: boolean) => void;
  onIncrease: (cartItemId: string) => void;
  onDecrease: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  onSaveItemNote: (cartItemId: string, note: string) => void;
  isItemPending: (cartItemId: string) => boolean;
  onCancelCart: () => void;
  onSaveMessage: (message: string) => void;
  onOpenVoucherDialog: () => void;
  onRemoveVoucher: () => void;
}

const CartStoreSection: React.FC<CartStoreSectionProps> = ({
  cart,
  hasAppliedVoucher,
  isVoucherPending,
  isCancellingCart,
  initialMessage,
  isSavingMessage,
  selectedItemIds,
  checked,
  indeterminate,
  onToggleCart,
  onToggleItem,
  onIncrease,
  onDecrease,
  onUpdateQuantity,
  onRemove,
  onSaveItemNote,
  isItemPending,
  onCancelCart,
  onSaveMessage,
  onOpenVoucherDialog,
  onRemoveVoucher,
}) => {
  const menuQuery = useGetMenuByFranchise(cart.franchiseId);
  const hasCartDiscount =
    Number(cart.finalAmount || 0) < Number(cart.subtotalAmount || 0);
  const messageForm = useForm<CartStoreMessageForm>({
    defaultValues: {
      message: initialMessage ?? "",
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = messageForm;

  const { imageByProductFranchiseId, sizeLabelByProductFranchiseId } =
    React.useMemo(() => {
      const imageMap = new Map<string, string>();
      const sizeMap = new Map<string, string>();

      (menuQuery.data ?? []).forEach((category) => {
        category.products.forEach((product) => {
          product.sizes.forEach((size) => {
            sizeMap.set(
              String(size.productFranchiseId),
              getSizeLabel(String(size.size)),
            );

            if (product.imageUrl) {
              imageMap.set(String(size.productFranchiseId), product.imageUrl);
            }
          });
        });
      });

      return {
        imageByProductFranchiseId: imageMap,
        sizeLabelByProductFranchiseId: sizeMap,
      };
    }, [menuQuery.data]);

  const resolveProductImage = (
    productFranchiseId: string,
    imageUrl?: string | null,
  ) => imageUrl || imageByProductFranchiseId.get(String(productFranchiseId));

  const resolveProductSize = (productFranchiseId: string) =>
    sizeLabelByProductFranchiseId.get(String(productFranchiseId));

  React.useEffect(() => {
    reset({
      message: initialMessage ?? "",
    });
  }, [cart.id, initialMessage, reset]);

  return (
    <section
      aria-busy={isCancellingCart}
      className={`overflow-hidden rounded-[1.75rem] border border-[var(--cart-border)] bg-[var(--cart-panel-strong)] shadow-[0_18px_38px_rgba(63,41,33,0.05)] transition-all ${
        isCancellingCart ? "opacity-70" : ""
      }`}
    >
      <div className="border-b border-[var(--cart-border-soft)] bg-[linear-gradient(180deg,#fffdfa_0%,#fcf5ee_100%)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              disabled={isCancellingCart}
              checked={checked ? true : indeterminate ? "indeterminate" : false}
              onCheckedChange={(next) => onToggleCart(next === true)}
              className="mt-1"
            />

            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[1.1rem] bg-[var(--cart-warm)] text-[var(--cart-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <Store className="h-5 w-5" />
              </div>

              <div className="space-y-2">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--cart-ink)]">
                    {cart.franchiseName || "Store"}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--cart-muted)]">
                    {cart.cartItems.length} items in this cart
                  </p>
                </div>

                {(cart.address || cart.phone) && (
                  <div className="flex flex-wrap gap-2.5 text-sm text-[var(--cart-muted)]">
                    {cart.address && (
                      <div className="inline-flex items-start gap-2 rounded-full border border-[var(--cart-border)] bg-white/80 px-3 py-2 shadow-[0_8px_18px_rgba(63,41,33,0.04)]">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--cart-accent)]" />
                        <span>{cart.address}</span>
                      </div>
                    )}

                    {cart.phone && (
                      <div className="rounded-full border border-[var(--cart-border)] bg-white/80 px-3 py-2 shadow-[0_8px_18px_rgba(63,41,33,0.04)]">
                        {cart.phone}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-sm">
            <span className="rounded-full border border-[var(--cart-border)] bg-white/80 px-3 py-2 font-medium text-[var(--cart-muted)] shadow-[0_8px_18px_rgba(63,41,33,0.04)]">
              {cart.cartItems.length} items
            </span>

            {hasCartDiscount && (
              <span className="rounded-full bg-[#fff1e7] px-3 py-2 font-medium text-[var(--cart-accent)]">
                Save {formatCurrency(cart.subtotalAmount - cart.finalAmount)}
              </span>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancelCart}
              disabled={isCancellingCart}
              className="rounded-full border-[var(--cart-border)] bg-white/85 px-4 text-[var(--cart-accent-deep)] hover:border-[#d8b8a4] hover:bg-[#fff6ef]"
            >
              {isCancellingCart ? "Cancelling..." : "Cancel cart"}
            </Button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--cart-border-soft)]">
        {cart.cartItems.map((item) => (
          <CartItem
            key={item.cartItemId}
            item={item}
            checked={selectedItemIds.includes(item.cartItemId)}
            isPending={isCancellingCart || isItemPending(item.cartItemId)}
            resolveProductImage={resolveProductImage}
            resolveProductSize={resolveProductSize}
            onToggle={(next) => onToggleItem(item.cartItemId, next)}
            onIncrease={() => onIncrease(item.cartItemId)}
            onDecrease={() => onDecrease(item.cartItemId)}
            onUpdateQuantity={(quantity) =>
              onUpdateQuantity(item.cartItemId, quantity)
            }
            onRemove={() => onRemove(item.cartItemId)}
            onSaveNote={(note) => onSaveItemNote(item.cartItemId, note)}
          />
        ))}
      </div>

      <div className="border-t border-[var(--cart-border-soft)] px-5 py-5 md:px-6">
        <form
          onSubmit={handleSubmit((values) => onSaveMessage(values.message))}
          className="rounded-[1.5rem] border border-[var(--cart-border)] bg-[linear-gradient(180deg,#fffdf9_0%,#faf3ec_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
        >
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cart-muted)]">
                Message
              </p>
              <p className="mt-1 text-sm text-[var(--cart-ink)]">
                Message for the store
              </p>
            </div>

            <Textarea
              disabled={isCancellingCart}
              placeholder="For example: deliver within 30 minutes, call before delivery..."
              className="min-h-24 resize-y rounded-[1.2rem] border-[var(--cart-border)] bg-white/95 text-[var(--cart-ink)] placeholder:text-[#a08778] focus-visible:ring-[var(--cart-accent)]/20"
              {...register("message")}
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-[var(--cart-muted)]">
                This content is stored in the cart message field.
              </p>

              <Button
                type="submit"
                size="sm"
                disabled={isCancellingCart || isSavingMessage || !isDirty}
                className="rounded-full bg-[linear-gradient(135deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)] px-5 text-white shadow-[0_14px_28px_rgba(183,104,67,0.22)] hover:opacity-95"
              >
                {isSavingMessage ? "Saving..." : "Save message"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="border-t border-[var(--cart-border-soft)] bg-[linear-gradient(180deg,#fdf8f3_0%,#f7efe7_100%)]">
        <div className="flex flex-col gap-4 px-5 py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm text-[var(--cart-ink)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-white text-[var(--cart-accent)] shadow-[0_10px_24px_rgba(63,41,33,0.05)]">
              <TicketPercent className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Store voucher</p>
              <p className="text-xs text-[var(--cart-muted)]">
                Apply a discount code for this store
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {Number(cart.voucherDiscount || 0) > 0 ? (
              <span className="rounded-full bg-[#fff1e7] px-3 py-2 font-medium text-[var(--cart-accent)]">
                Save {formatCurrency(Number(cart.voucherDiscount || 0))}
              </span>
            ) : (
              <span className="text-[var(--cart-muted)]">No voucher applied</span>
            )}

            <button
              type="button"
              disabled={isCancellingCart || isVoucherPending}
              onClick={onOpenVoucherDialog}
              className="rounded-full border border-[var(--cart-border)] bg-white/85 px-4 py-2 font-medium text-[var(--cart-ink)] shadow-[0_10px_24px_rgba(63,41,33,0.04)] transition-all hover:border-[#d7b7a4] hover:text-[var(--cart-accent)] disabled:cursor-not-allowed disabled:text-[#b7a59a]"
            >
              Choose or enter code
            </button>

            {hasAppliedVoucher && (
              <button
                type="button"
                disabled={isCancellingCart || isVoucherPending}
                onClick={onRemoveVoucher}
                className="rounded-full border border-[#ebc8b6] bg-[#fff8f2] px-4 py-2 text-[#a24a37] transition-colors hover:text-[#7c2f20] disabled:cursor-not-allowed disabled:text-[#b7a59a]"
              >
                {isVoucherPending ? "Removing voucher..." : "Remove voucher"}
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--cart-border-soft)] px-5 py-5 md:px-6">
          <div className="rounded-[1.5rem] border border-[var(--cart-border)] bg-white/88 p-4 shadow-[0_14px_34px_rgba(63,41,33,0.04)]">
            <div className="space-y-3 text-sm text-[var(--cart-muted)]">
              <div className="flex items-center justify-between gap-4">
                <span>Subtotal</span>
                <strong className="text-[var(--cart-ink)]">
                  {formatCurrency(cart.subtotalAmount)}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-[var(--cart-ink)]">Total payment</span>
                <div className="text-right">
                  {hasCartDiscount && (
                    <p className="text-xs text-[#aa8f80] line-through">
                      {formatCurrency(cart.subtotalAmount)}
                    </p>
                  )}
                  <p
                    className={`text-xl font-semibold ${
                      hasCartDiscount
                        ? "text-[var(--cart-accent)]"
                        : "text-[var(--cart-ink)]"
                    }`}
                  >
                    {formatCurrency(cart.finalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartStoreSection;
