import React from "react";
import type { CartResponse } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartVoucherDialogProps {
  open: boolean;
  cart: CartResponse | null;
  voucherCode: string;
  isApplying: boolean;
  onOpenChange: (open: boolean) => void;
  onVoucherCodeChange: (value: string) => void;
  onApply: () => void;
}

const CartVoucherDialog: React.FC<CartVoucherDialogProps> = ({
  open,
  cart,
  voucherCode,
  isApplying,
  onOpenChange,
  onVoucherCodeChange,
  onApply,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden rounded-[1.8rem] border-[var(--cart-border)] bg-[linear-gradient(180deg,#fffdf9_0%,#fbf3ea_100%)] p-0 shadow-[0_28px_70px_rgba(63,41,33,0.16)]">
        <div className="border-b border-[var(--cart-border-soft)] px-6 py-5">
          <DialogHeader>
            <DialogTitle className="font-coffee text-3xl text-[var(--cart-ink)]">
              Apply voucher
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-[var(--cart-muted)]">
              {cart?.franchiseName || "Store"} - enter a voucher code and apply
              it directly with the cart API.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="rounded-[1.4rem] border border-[var(--cart-border)] bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cart-muted)]">
              Voucher code
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Input
                value={voucherCode}
                onChange={(event) => onVoucherCodeChange(event.target.value)}
                placeholder="Enter your voucher code"
                className="h-12 rounded-full border-[var(--cart-border)] bg-[#fffdfa] px-5 text-[var(--cart-ink)] placeholder:text-[#a08778]"
              />
              <Button
                onClick={onApply}
                disabled={isApplying || !voucherCode.trim()}
                className="h-12 rounded-full bg-[linear-gradient(135deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)] px-6 text-white shadow-[0_18px_28px_rgba(183,104,67,0.24)] hover:opacity-95"
              >
                {isApplying ? "Applying..." : "Apply"}
              </Button>
            </div>
          </div>

          <div className="rounded-[1.25rem] bg-[#fff7ef] px-4 py-3 text-sm text-[var(--cart-muted)]">
            The voucher will be applied to this store cart if the code is valid.
          </div>
        </div>

        <DialogFooter className="border-t border-[var(--cart-border-soft)] px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full border-[var(--cart-border)] bg-white/85 px-5 text-[var(--cart-ink)] hover:bg-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartVoucherDialog;
