import React from "react";

interface CartPageHeaderProps {
  selectedItemCount: number;
}

const CartPageHeader: React.FC<CartPageHeaderProps> = ({ selectedItemCount }) => {
  return (
    <div className="relative mx-auto max-w-7xl px-3 pt-5 sm:px-4 sm:pt-8">
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--cart-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(249,238,228,0.92)_56%,rgba(243,225,212,0.96)_100%)] shadow-[0_28px_70px_rgba(63,41,33,0.1)] sm:rounded-[2rem]">
        <div className="grid gap-5 px-4 py-5 sm:px-6 sm:py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--cart-muted)] sm:text-xs sm:tracking-[0.32em]">
              Coffee Cart
            </p>
            <h1 className="mt-2.5 font-coffee text-3xl leading-none text-[var(--cart-ink)] sm:mt-3 sm:text-5xl">
              Your cart
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--cart-muted)] sm:mt-4 sm:text-[15px] sm:leading-7">
              Manage each store in one clean view so you can track vouchers
              and checkout faster.
            </p>
          </div>

          <div className="relative lg:justify-self-end">
            <div className="absolute right-[-1rem] top-[-2rem] h-20 w-20 rounded-full bg-white/55 blur-2xl sm:h-24 sm:w-24" />
            <div className="relative rounded-[1.35rem] border border-white/80 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-sm sm:rounded-[1.75rem] sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--cart-muted)] sm:text-xs sm:tracking-[0.28em]">
                Selected
              </p>
              <div className="mt-3 flex items-end gap-2.5 sm:mt-4 sm:gap-3">
                <span className="text-3xl font-semibold leading-none text-[var(--cart-accent)] sm:text-4xl">
                  {selectedItemCount}
                </span>
                <span className="pb-1 text-sm text-[var(--cart-muted)]">
                  items
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--cart-warm)] sm:mt-4">
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