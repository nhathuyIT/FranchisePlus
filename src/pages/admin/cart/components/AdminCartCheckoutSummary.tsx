import { AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCartMoney } from "../utils/cartDisplay";

interface AdminCartCheckoutSummaryProps {
  itemCount: number;
  subtotalAmount: number;
  promotionDiscount: number;
  voucherDiscount: number;
  loyaltyDiscount: number;
  finalAmount: number;
  canCheckout: boolean;
  disableReason?: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onCheckout: () => void;
}

export const AdminCartCheckoutSummary = ({
  itemCount,
  subtotalAmount,
  promotionDiscount,
  voucherDiscount,
  loyaltyDiscount,
  finalAmount,
  canCheckout,
  disableReason,
  isSubmitting,
  onBack,
  onCheckout,
}: AdminCartCheckoutSummaryProps) => {
  const totalDiscount = promotionDiscount + voucherDiscount + loyaltyDiscount;

  return (
    <aside className="rounded-[28px] border border-[#E6D7CA] bg-[linear-gradient(180deg,#4f3428_0%,#3b241d_100%)] p-6 text-white shadow-[0_24px_60px_rgba(62,39,35,0.22)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#DCC3B4]">
            Summary
          </p>
          <h2 className="mt-1 text-xl font-semibold">Complete checkout</h2>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-[24px] border border-white/10 bg-white/6 p-5">
        <div className="flex items-center justify-between text-sm text-[#EBDAD0]">
          <span>Items</span>
          <span className="font-semibold text-white">{itemCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[#EBDAD0]">
          <span>Subtotal</span>
          <span className="font-semibold text-white">
            {formatCartMoney(subtotalAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-[#EBDAD0]">
          <span>Promotion</span>
          <span className="font-semibold text-white">
            {formatCartMoney(promotionDiscount)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-[#EBDAD0]">
          <span>Voucher</span>
          <span className="font-semibold text-white">
            {formatCartMoney(voucherDiscount)}
          </span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center justify-between text-sm text-[#EBDAD0]">
            <span>Total discount</span>
            <span className="font-semibold text-[#F4D4B3]">
              {formatCartMoney(totalDiscount)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm uppercase tracking-[0.18em] text-[#DCC3B4]">
              Final amount
            </span>
            <span className="text-2xl font-semibold text-[#FFE7CC]">
              {formatCartMoney(finalAmount)}
            </span>
          </div>
        </div>
      </div>

      {disableReason ? (
        <div className="mt-5 rounded-2xl border border-[#8F5B49] bg-[#6B4032] px-4 py-3 text-sm text-[#FCE6DA]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{disableReason}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        <Button
          type="button"
          onClick={onCheckout}
          disabled={!canCheckout || isSubmitting}
          className="h-11 rounded-2xl bg-[#F2A65A] font-semibold text-[#3B241D] hover:bg-[#F4B46F]"
        >
          {isSubmitting ? "Checking out..." : "Checkout cart"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          Back to cart list
        </Button>
      </div>
    </aside>
  );
};
