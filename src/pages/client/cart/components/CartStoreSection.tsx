import React from "react";
import { useForm } from "react-hook-form";
import { MapPin, Store, TicketPercent } from "lucide-react";
import type {
  CartItemEditConfig,
  CartItemOptionRequest,
  CartItemResponse,
  CartResponse,
} from "@/types/cart";
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

const resolveProductSizeLabel = (productFranchiseId: string) => {
  const normalized = String(productFranchiseId || "").toLowerCase();

  if (normalized.includes("small") || normalized.endsWith("-s")) return "S";
  if (normalized.includes("medium") || normalized.endsWith("-m")) return "M";
  if (normalized.includes("large") || normalized.endsWith("-l")) return "L";

  return "Option";
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
  onSaveEditedItem: (
    item: CartItemResponse,
    options: CartItemOptionRequest[],
  ) => Promise<boolean> | void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => Promise<unknown> | void;
  onRemove: (cartItemId: string) => Promise<unknown> | void;
  isItemPending: (cartItemId: string) => boolean;
  onCancelCart: () => Promise<unknown> | void;
  onSaveMessage: (message: string) => Promise<unknown> | void;
  onOpenVoucherDialog: () => void;
  onRemoveVoucher: () => Promise<unknown> | void;
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
  onSaveEditedItem,
  onUpdateQuantity,
  onRemove,
  isItemPending,
  onCancelCart,
  onSaveMessage,
  onOpenVoucherDialog,
  onRemoveVoucher,
}) => {
  const menuQuery = useGetMenuByFranchise(cart.franchiseId);
  const hasCartDiscount =
    Number(cart.finalAmount || 0) < Number(cart.subtotalAmount || 0);
  const promotionDiscount = Math.max(Number(cart.promotionDiscount || 0), 0);
  const voucherDiscount = Math.max(Number(cart.voucherDiscount || 0), 0);
  const totalDiscount = Math.max(
    0,
    Number(cart.subtotalAmount || 0) - Number(cart.finalAmount || 0),
  );
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

  const { sizeLabelByProductFranchiseId, editConfigByProductFranchiseId } = React.useMemo(() => {
    const sizeMap = new Map<string, string>();
    const editMap = new Map<string, CartItemEditConfig>();

    const baseToppingOptions: CartItemEditConfig["toppingOptions"] = [];

    (menuQuery.data ?? []).forEach((category) => {
      const isToppingCategory = String(category.categoryName || "")
        .trim()
        .toLowerCase()
        .includes("topping");

      category.products.forEach((product) => {
        const availableSizes = product.sizes.filter((size) => size.isAvailable);
        const sizeOptions = availableSizes.map((size) => ({
          productFranchiseId: String(size.productFranchiseId),
          label: getSizeLabel(String(size.size)),
          price: Number(size.price || 0),
        }));

        sizeOptions.forEach((sizeOption) => {
          sizeMap.set(sizeOption.productFranchiseId, sizeOption.label);
        });

        if (!isToppingCategory || sizeOptions.length === 0) {
          return;
        }

        baseToppingOptions.push({
          productId: String(product.productId),
          name: product.name,
          imageUrl: product.imageUrl || undefined,
          sizes: sizeOptions,
        });
      });
    });

    const knownToppingSizeIds = new Set(
      baseToppingOptions.flatMap((option) =>
        option.sizes.map((size) => String(size.productFranchiseId)),
      ),
    );
    const fallbackToppingOptions: CartItemEditConfig["toppingOptions"] = [];

    (cart.cartItems ?? []).forEach((cartItem) => {
      (cartItem.options ?? []).forEach((option) => {
        const optionProductFranchiseId = String(option.productFranchiseId);

        if (knownToppingSizeIds.has(optionProductFranchiseId)) {
          return;
        }

        knownToppingSizeIds.add(optionProductFranchiseId);
        fallbackToppingOptions.push({
          productId: optionProductFranchiseId,
          name: option.productName || optionProductFranchiseId,
          imageUrl: option.productImageUrl || undefined,
          sizes: [
            {
              productFranchiseId: optionProductFranchiseId,
              label:
                sizeMap.get(optionProductFranchiseId) ||
                resolveProductSizeLabel(optionProductFranchiseId),
              price: Number(option.finalPrice || option.priceSnapshot || 0),
            },
          ],
        });
      });
    });

    const toppingOptions = [...baseToppingOptions, ...fallbackToppingOptions];
    const productFranchiseIdsWithCurrentOptions = new Set(
      (cart.cartItems ?? [])
        .filter((cartItem) => (cartItem.options ?? []).length > 0)
        .map((cartItem) => String(cartItem.productFranchiseId)),
    );

    (menuQuery.data ?? []).forEach((category) => {
      category.products.forEach((product) => {
        const availableSizes = product.sizes.filter((size) => size.isAvailable);
        const sizeOptions = availableSizes.map((size) => ({
          productFranchiseId: String(size.productFranchiseId),
          label: getSizeLabel(String(size.size)),
          price: Number(size.price || 0),
        }));

        availableSizes.forEach((size) => {
          sizeMap.set(
            String(size.productFranchiseId),
            getSizeLabel(String(size.size)),
          );
        });

        const hasCurrentOptions = sizeOptions.some((sizeOption) =>
          productFranchiseIdsWithCurrentOptions.has(
            String(sizeOption.productFranchiseId),
          ),
        );
        const canEditProduct =
          toppingOptions.length > 0 &&
          (product.isHaveTopping === true || hasCurrentOptions);

        if (!canEditProduct) {
          return;
        }

        const editConfig: CartItemEditConfig = {
          sizeOptions,
          toppingOptions,
        };

        sizeOptions.forEach((sizeOption) => {
          editMap.set(sizeOption.productFranchiseId, editConfig);
        });
      });
    });

    return {
      sizeLabelByProductFranchiseId: sizeMap,
      editConfigByProductFranchiseId: editMap,
    };
  }, [cart.cartItems, menuQuery.data]);

  const resolveProductImage = (
    _productFranchiseId: string,
    imageUrl?: string | null,
  ) => imageUrl || undefined;

  const resolveProductSize = (productFranchiseId: string) =>
    sizeLabelByProductFranchiseId.get(String(productFranchiseId));

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isCancellingCart || checked) {
      return;
    }

    const target = event.target as HTMLElement;
    if (
      target.closest(
        "button, a, input, textarea, select, [data-cart-header-ignore-toggle='true']",
      )
    ) {
      return;
    }

    onToggleCart(true);
  };

  React.useEffect(() => {
    reset({
      message: initialMessage ?? "",
    });
  }, [cart.id, initialMessage, reset]);

  return (
    <section
      aria-busy={isCancellingCart}
      className={`overflow-hidden rounded-[1.35rem] sm:rounded-[1.75rem] border border-[var(--cart-border)] bg-[var(--cart-panel-strong)] shadow-[0_18px_38px_rgba(63,41,33,0.05)] transition-all ${
        isCancellingCart ? "opacity-70" : ""
      }`}
    >
      <div className="cursor-pointer border-b border-[var(--cart-border-soft)] bg-[linear-gradient(180deg,#fffdfa_0%,#fcf5ee_100%)] px-4 py-4 sm:px-5 sm:py-5 md:px-6" onClick={handleHeaderClick}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <Checkbox
              disabled={isCancellingCart}
              checked={checked ? true : indeterminate ? "indeterminate" : false}
              onCheckedChange={(next) => onToggleCart(next === true)}
              className="mt-0.5 sm:mt-1"
            />

            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[1rem] bg-[var(--cart-warm)] text-[var(--cart-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:h-12 sm:w-12 sm:rounded-[1.1rem]">
                <Store className="h-5 w-5" />
              </div>

              <div className="space-y-2">
                <div>
                  <h2 className="text-base font-semibold text-[var(--cart-ink)] sm:text-lg">
                    {cart.franchiseName || "Store"}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--cart-muted)] sm:text-sm">
                    {cart.cartItems.length} items in this cart
                  </p>
                </div>

                {(cart.address || cart.phone) && (
                  <div className="flex flex-col gap-2 text-xs text-[var(--cart-muted)] sm:flex-wrap sm:flex-row sm:gap-2.5 sm:text-sm">
                    {cart.address && (
                      <div className="inline-flex max-w-full items-start gap-2 rounded-2xl border border-[var(--cart-border)] bg-white/80 px-3 py-2 text-left shadow-[0_8px_18px_rgba(63,41,33,0.04)] sm:rounded-full">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--cart-accent)]" />
                        <span>{cart.address}</span>
                      </div>
                    )}

                    {cart.phone && (
                      <div className="w-fit rounded-2xl border border-[var(--cart-border)] bg-white/80 px-3 py-2 shadow-[0_8px_18px_rgba(63,41,33,0.04)] sm:rounded-full">
                        {cart.phone}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <span className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--cart-border)] bg-white/80 px-3 py-2 font-medium text-[var(--cart-muted)] shadow-[0_8px_18px_rgba(63,41,33,0.04)]">
              {cart.cartItems.length} items
            </span>

            {promotionDiscount > 0 && (
              <span className="rounded-full bg-[#fff4ea] px-3 py-2 font-medium text-[var(--cart-accent-deep)]">
                Promotion -{formatCurrency(promotionDiscount)}
              </span>
            )}

            {voucherDiscount > 0 && (
              <span className="rounded-full bg-[#fff1e7] px-3 py-2 font-medium text-[var(--cart-accent)]">
                Voucher -{formatCurrency(voucherDiscount)}
              </span>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancelCart}
              disabled={isCancellingCart}
              data-cart-header-ignore-toggle="true" className="self-end w-auto min-w-28 rounded-full border-[var(--cart-border)] bg-white/85 px-3 py-1.5 text-xs text-[var(--cart-accent-deep)] hover:border-[#d8b8a4] hover:bg-[#fff6ef] sm:px-4 sm:py-2 sm:text-sm"
            >
              {isCancellingCart ? "Cancelling..." : "Cancel cart"}
            </Button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--cart-border-soft)]">
        {cart.cartItems.map((item) => {
          const hasUnsupportedOptionQuantity = (item.options ?? []).some(
            (option) => Math.max(1, Number(option.quantity || 1)) > 1,
          );
          const editConfig = !hasUnsupportedOptionQuantity
            ? editConfigByProductFranchiseId.get(String(item.productFranchiseId))
            : undefined;
          const canRepresentCurrentOptions = (item.options ?? []).every((option) =>
            (editConfig?.toppingOptions ?? []).some((topping) =>
              topping.sizes.some(
                (size) =>
                  String(size.productFranchiseId) ===
                  String(option.productFranchiseId),
              ),
            ),
          );
          const canEditItem =
            !!editConfig &&
            (!item.options?.length || canRepresentCurrentOptions);

          return (
            <CartItem
              key={item.cartItemId}
              item={item}
              checked={selectedItemIds.includes(item.cartItemId)}
              isPending={isCancellingCart || isItemPending(item.cartItemId)}
              editConfig={canEditItem ? editConfig : undefined}
              resolveProductImage={resolveProductImage}
              resolveProductSize={resolveProductSize}
              onToggle={(next) => onToggleItem(item.cartItemId, next)}
              onSaveEdit={(options) => onSaveEditedItem(item, options)}
              onUpdateQuantity={(quantity) =>
                onUpdateQuantity(item.cartItemId, quantity)
              }
              onRemove={() => onRemove(item.cartItemId)}
            />
          );
        })}
      </div>

      <div className="border-t border-[var(--cart-border-soft)] px-4 py-4 sm:px-5 sm:py-5 md:px-6">
        <form
          onSubmit={handleSubmit((values) => onSaveMessage(values.message))}
          className="rounded-[1.25rem] border border-[var(--cart-border)] bg-[linear-gradient(180deg,#fffdf9_0%,#faf3ec_100%)] p-3.5 sm:rounded-[1.5rem] sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[var(--cart-muted)]">
                This content is stored in the cart message field.
              </p>

              <Button
                type="submit"
                size="sm"
                disabled={isCancellingCart || isSavingMessage || !isDirty}
                className="self-end w-auto min-w-32 rounded-full bg-[linear-gradient(135deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)] px-5 text-white shadow-[0_14px_28px_rgba(183,104,67,0.22)] hover:opacity-95"
              >
                {isSavingMessage ? "Saving..." : "Save message"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="border-t border-[var(--cart-border-soft)] bg-[linear-gradient(180deg,#fdf8f3_0%,#f7efe7_100%)]">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
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

          <div className="flex flex-col items-stretch gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center">
              {voucherDiscount > 0 ? (
              <span className="rounded-full bg-[#fff1e7] px-3 py-2 font-medium text-[var(--cart-accent)]">
                  Save {formatCurrency(voucherDiscount)}
              </span>
            ) : (
              <span className="text-[var(--cart-muted)]">No voucher applied</span>
            )}

            <button
              type="button"
              disabled={isCancellingCart || isVoucherPending}
              onClick={onOpenVoucherDialog}
              className="w-full rounded-full border border-[var(--cart-border)] bg-white/85 px-4 py-2 font-medium text-[var(--cart-ink)] shadow-[0_10px_24px_rgba(63,41,33,0.04)] transition-all hover:border-[#d7b7a4] hover:text-[var(--cart-accent)] disabled:cursor-not-allowed disabled:text-[#b7a59a] sm:w-auto"
            >
              Choose or enter code
            </button>

            {hasAppliedVoucher && (
              <button
                type="button"
                disabled={isCancellingCart || isVoucherPending}
                onClick={onRemoveVoucher}
                className="w-full rounded-full border border-[#ebc8b6] bg-[#fff8f2] px-4 py-2 text-[#a24a37] transition-colors hover:text-[#7c2f20] disabled:cursor-not-allowed disabled:text-[#b7a59a] sm:w-auto"
              >
                {isVoucherPending ? "Removing voucher..." : "Remove voucher"}
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--cart-border-soft)] px-4 py-4 sm:px-5 sm:py-5 md:px-6">
          <div className="rounded-[1.25rem] border border-[var(--cart-border)] bg-white/88 p-3.5 sm:rounded-[1.5rem] sm:p-4 shadow-[0_14px_34px_rgba(63,41,33,0.04)]">
            <div className="space-y-3 text-sm text-[var(--cart-muted)]">
              <div className="flex items-center justify-between gap-4">
                <span>Subtotal</span>
                <strong className="text-[var(--cart-ink)]">
                  {formatCurrency(cart.subtotalAmount)}
                </strong>
              </div>

              {promotionDiscount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span>Promotion discount</span>
                  <strong className="text-[var(--cart-accent-deep)]">
                    - {formatCurrency(promotionDiscount)}
                  </strong>
                </div>
              )}

              {voucherDiscount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span>Voucher discount</span>
                  <strong className="text-[var(--cart-accent)]">
                    - {formatCurrency(voucherDiscount)}
                  </strong>
                </div>
              )}

              {totalDiscount > promotionDiscount + voucherDiscount && (
                <div className="flex items-center justify-between gap-4">
                  <span>Other discount</span>
                  <strong className="text-[var(--cart-accent)]">
                    - {formatCurrency(totalDiscount - promotionDiscount - voucherDiscount)}
                  </strong>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <span>Total payable</span>
                <div className="text-right">
                  {hasCartDiscount && (
                    <p className="text-xs text-[#a78c7e] line-through">
                      {formatCurrency(cart.subtotalAmount)}
                    </p>
                  )}
                  <strong className="text-base text-[var(--cart-accent)]">
                    {formatCurrency(cart.finalAmount)}
                  </strong>
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







