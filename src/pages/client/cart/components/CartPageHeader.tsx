import React from "react";

interface CartPageHeaderProps {
  selectedItemCount: number;
}

const CartPageHeader: React.FC<CartPageHeaderProps> = ({ selectedItemCount }) => {
  return (
    <div className="relative mx-auto max-w-7xl px-4 pt-8">
      <div className="overflow-hidden rounded-[2rem] border border-[var(--cart-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(249,238,228,0.92)_56%,rgba(243,225,212,0.96)_100%)] shadow-[0_28px_70px_rgba(63,41,33,0.1)]">
        <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--cart-muted)]">
              Coffee Cart
            </p>
            <h1 className="mt-3 font-coffee text-4xl leading-none text-[var(--cart-ink)] sm:text-5xl">
              Your cart
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--cart-muted)] sm:text-[15px]">
              Manage each store in one clean view so you can track vouchers,
              notes, and checkout faster.
            </p>
          </div>

          <div className="relative">
            <div className="absolute right-[-1rem] top-[-2rem] h-24 w-24 rounded-full bg-white/55 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/80 bg-white/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--cart-muted)]">
                Selected
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-4xl font-semibold leading-none text-[var(--cart-accent)]">
                  {selectedItemCount}
                </span>
                <span className="pb-1 text-sm text-[var(--cart-muted)]">
                  items
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-[var(--cart-warm)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)]"
                  style={{
                    width: `${Math.min(100, Math.max(18, selectedItemCount * 10))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageHeader;
