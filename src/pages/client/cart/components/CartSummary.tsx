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
    <div className="fixed inset-x-0 bottom-0 z-30 bg-[linear-gradient(180deg,rgba(246,239,231,0)_0%,rgba(246,239,231,0.84)_22%,rgba(246,239,231,0.96)_100%)] pt-8">
      <div className="mx-auto max-w-7xl px-4 pb-5">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--cart-border)] bg-[rgba(255,252,247,0.9)] px-5 py-4 shadow-[0_-16px_44px_rgba(63,41,33,0.09)] backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
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

            <div className="flex flex-wrap gap-3 text-sm text-[var(--cart-muted)]">
              <span className="rounded-full bg-[#fbf1e8] px-3 py-1.5">
                Subtotal: {formatCurrency(selectedTotalBeforeDiscount)}
              </span>
              {selectedSavings > 0 && (
                <span className="rounded-full bg-[#fff1e7] px-3 py-1.5 text-[var(--cart-accent)]">
                  Saved: {formatCurrency(selectedSavings)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="text-right">
              <p className="text-sm text-[var(--cart-muted)]">
                Total ({selectedItemCount} items)
              </p>
              {hasDiscount && (
                <p className="mt-1 text-sm text-[#aa8f80] line-through">
                  {formatCurrency(selectedTotalBeforeDiscount)}
                </p>
              )}
              <p className="text-3xl font-semibold text-[var(--cart-accent)]">
                {formatCurrency(selectedPayable)}
              </p>
            </div>

            <button
              onClick={onCheckout}
              disabled={selectedItemCount === 0}
              className="inline-flex min-w-48 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(183,104,67,0.28)] transition-all hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#d8b29c] disabled:shadow-none"
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
