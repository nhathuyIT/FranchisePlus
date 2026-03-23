import { Loader2, TicketPercent, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatCartMoney,
  formatVoucherValue,
} from "../utils/cartDisplay";

interface AdminCartVoucherCardProps {
  mode: "draft" | "cart";
  voucherCode: string;
  onVoucherCodeChange: (value: string) => void;
  currentVoucherCode?: string;
  hasAppliedVoucher?: boolean;
  voucherDiscount?: number;
  voucherType?: string;
  voucherValue?: number;
  disabled?: boolean;
  isApplying?: boolean;
  isRemoving?: boolean;
  onApply?: () => void;
  onRemove?: () => void;
  onClearDraft?: () => void;
}

export const AdminCartVoucherCard = ({
  mode,
  voucherCode,
  onVoucherCodeChange,
  currentVoucherCode,
  hasAppliedVoucher: hasAppliedVoucherProp,
  voucherDiscount = 0,
  voucherType,
  voucherValue,
  disabled = false,
  isApplying = false,
  isRemoving = false,
  onApply,
  onRemove,
  onClearDraft,
}: AdminCartVoucherCardProps) => {
  const normalizedVoucherCode = voucherCode.trim();
  const normalizedCurrentVoucherCode = currentVoucherCode?.trim() ?? "";
  const hasTypedVoucher = normalizedVoucherCode.length > 0;
  const hasAppliedVoucher =
    hasAppliedVoucherProp ??
    (normalizedCurrentVoucherCode.length > 0 || Number(voucherDiscount) > 0);
  const isSameAsAppliedVoucher =
    hasTypedVoucher &&
    normalizedCurrentVoucherCode.length > 0 &&
    normalizedVoucherCode.toLowerCase() ===
      normalizedCurrentVoucherCode.toLowerCase();
  const voucherValueLabel = formatVoucherValue(voucherType, voucherValue);
  const isBusy = isApplying || isRemoving;

  return (
    <section className="rounded-2xl border border-[#E8DFD6] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF1E8] text-[#A56A43]">
          <TicketPercent className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#3E2723]">Voucher</p>
          <p className="mt-1 text-sm text-[#8D6E63]">
            {mode === "cart"
              ? "Apply or remove voucher directly on this cart. Cart totals refresh after each change."
              : "Enter a voucher code now. It will be applied automatically after the cart is created."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row">
        <Input
          value={voucherCode}
          onChange={(event) => onVoucherCodeChange(event.target.value)}
          placeholder="Enter voucher code"
          disabled={disabled || isBusy}
          className="h-11 border-[#E8DFD6] bg-[#FFFDFC] text-[#3E2723] placeholder:text-[#A1887F]"
        />

        {mode === "cart" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={onApply}
              disabled={
                disabled ||
                isBusy ||
                !hasTypedVoucher ||
                isSameAsAppliedVoucher
              }
              className="h-11 bg-[#6D4C41] text-white hover:bg-[#5D4037]"
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply voucher"
              )}
            </Button>

            {hasAppliedVoucher ? (
              <Button
                type="button"
                variant="outline"
                onClick={onRemove}
                disabled={disabled || isBusy}
                className="h-11 border-[#E8DFD6] text-[#A24A37] hover:bg-[#FFF8F2]"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove voucher
                  </>
                )}
              </Button>
            ) : null}
          </div>
        ) : hasTypedVoucher ? (
          <Button
            type="button"
            variant="outline"
            onClick={onClearDraft}
            disabled={disabled || isBusy}
            className="h-11 border-[#E8DFD6] text-[#6D4C41] hover:bg-[#FAF8F5]"
          >
            <X className="mr-2 h-4 w-4" />
            Clear code
          </Button>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-3">
        {mode === "cart" ? (
          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-[#3E2723]">
                {hasAppliedVoucher
                  ? normalizedCurrentVoucherCode || "Voucher applied"
                  : "No voucher applied"}
              </span>
              <span className="font-semibold text-[#6D4C41]">
                {formatCartMoney(Number(voucherDiscount || 0))}
              </span>
            </div>

            {hasAppliedVoucher ? (
              <p className="text-xs text-[#8D6E63]">
                {voucherValueLabel
                  ? `Value: ${voucherValueLabel}`
                  : "Cart is currently carrying a voucher."}
              </p>
            ) : (
              <p className="text-xs text-[#8D6E63]">
                Enter a code above to apply discount to this cart.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-[#3E2723]">
                {hasTypedVoucher
                  ? normalizedVoucherCode
                  : "No voucher code entered"}
              </span>
              <span className="text-[#8D6E63]">
                {hasTypedVoucher ? "Ready after create" : "Optional"}
              </span>
            </div>

            <p className="text-xs text-[#8D6E63]">
              {hasTypedVoucher
                ? "The code will be sent right after the new cart is created."
                : "Leave this empty if you do not want to apply a voucher yet."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
