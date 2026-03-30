import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "../cart.utils";

interface CartSummaryProps {
  allChecked: boolean;
  someChecked: boolean;
  selectedItemCount: number;
  selectedTotalBeforeDiscount: number;
  selectedSavings: number;
  selectedPayable: number;
  onToggleAll: (checked: boolean) => void;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  allChecked,
  someChecked,
  selectedItemCount,
  selectedTotalBeforeDiscount,
  selectedSavings,
  selectedPayable,
  onToggleAll,
  onCheckout,
}) => {
  const hasDiscount = selectedPayable < selectedTotalBeforeDiscount;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-[linear-gradient(180deg,rgba(246,239,231,0)_0%,rgba(246,239,231,0.86)_18%,rgba(246,239,231,0.97)_100%)] pt-5 sm:pt-8">
      <div className="mx-auto max-w-7xl px-3 pb-3 sm:px-4 sm:pb-5">
        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--cart-border)] bg-[rgba(255,252,247,0.92)] px-4 py-3.5 shadow-[0_-16px_44px_rgba(63,41,33,0.09)] backdrop-blur-md sm:gap-4 sm:rounded-[2rem] sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={allChecked ? true : someChecked ? "indeterminate" : false}
                onCheckedChange={(checked) => onToggleAll(checked === true)}
              />
              <span className="text-sm font-medium text-[var(--cart-ink)]">
                Select all ({selectedItemCount} items)
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5 text-sm text-[var(--cart-muted)] sm:gap-3">
              <span className="rounded-full bg-[#fbf1e8] px-3 py-1.5">
                Subtotal: {formatCurrency(selectedTotalBeforeDiscount)}
              </span>
              {selectedSavings > 0 && (
                <span className="rounded-full bg-[#f6ede6] px-3 py-1.5 text-[var(--cart-muted)]">
                  Saved: {formatCurrency(selectedSavings)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:items-center lg:gap-4">
            <div className="text-left sm:text-right">
              <p className="text-sm text-[var(--cart-muted)]">
                Total ({selectedItemCount} items)
              </p>
              {hasDiscount && (
                <p className="mt-1 text-sm text-[#aa8f80] line-through">
                  {formatCurrency(selectedTotalBeforeDiscount)}
                </p>
              )}
              <p className="text-2xl font-semibold text-[var(--cart-accent)] sm:text-3xl">
                {formatCurrency(selectedPayable)}
              </p>
            </div>

            <button
              onClick={onCheckout}
              disabled={selectedItemCount === 0}
              className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(183,104,67,0.28)] transition-all hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#d8b29c] disabled:shadow-none sm:min-w-48 sm:w-auto sm:px-8"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;