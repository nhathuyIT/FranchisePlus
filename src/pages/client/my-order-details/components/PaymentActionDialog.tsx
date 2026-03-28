import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type PaymentActionType = "cancel" | "refund" | null;

interface PaymentActionDialogProps {
  open: boolean;
  actionType: PaymentActionType;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const COMMON_REASONS = [
  "Changed my mind",
  "Wrong items ordered",
  "Found better price elsewhere",
  "Delivery taking too long",
  "Order placed by mistake",
];

const DIALOG_META: Record<
  "cancel" | "refund",
  {
    title: string;
    description: string;
    confirmLabel: string;
    confirmClassName: string;
  }
> = {
  cancel: {
    title: "Refund Pending Payment",
    description:
      "This will mark your payment as REFUNDED. Note: your order will remain active. Please tell us why you are requesting this refund.",
    confirmLabel: "Yes, Refund Payment",
    confirmClassName:
      "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500",
  },
  refund: {
    title: "Request Payment Refund",
    description:
      "This will refund your payment and update status to REFUNDED. The order status will NOT be cancelled. Please provide a reason.",
    confirmLabel: "Yes, Request Refund",
    confirmClassName:
      "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500",
  },
};

export function PaymentActionDialog({
  open,
  actionType,
  onConfirm,
  onClose,
}: PaymentActionDialogProps) {
  const [reason, setReason] = useState("");
  const meta = actionType ? DIALOG_META[actionType] : null;

  const handleConfirm = () => {
    const finalReason = reason.trim() || "Customer requested refund";
    onConfirm(finalReason);
    setReason(""); // reset for next time
  };

  const clearAndClose = () => {
    setReason("");
    onClose();
  };

  if (!meta) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) clearAndClose(); }}>
      <DialogContent className="max-w-md rounded-3xl border border-[#E9DED3] p-0 shadow-[0_32px_64px_-24px_rgba(117,76,36,0.35)] overflow-hidden">
        <div className="border-b border-[#F0E5DA] px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#3E2723]">
              {meta.title}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm leading-relaxed text-[#8D6E63]">
              {meta.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#9A7B67]">
              Select or type a reason
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    reason === r
                      ? "bg-[#C97B3D] text-white shadow-sm"
                      : "bg-[#FAF6F0] text-[#8D6E63] hover:bg-[#F0E1CF] hover:text-[#5D4037]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            
            <Textarea
              placeholder="Additional details (optional)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-3 min-h-[100px] rounded-xl border-[#E8DFD6] bg-[#FAF8F5] text-sm text-[#3E2723] focus:border-[#C97B3D] focus:ring-[#C97B3D]/20"
            />
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Button
              type="button"
              onClick={handleConfirm}
              className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${meta.confirmClassName}`}
            >
              {meta.confirmLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearAndClose}
              className="w-full rounded-xl border-2 border-[#E8DFD6] py-3 text-sm font-semibold text-[#6D4C41] hover:border-[#D9C1AE] hover:text-[#3E2723]"
            >
              Never mind, go back
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
