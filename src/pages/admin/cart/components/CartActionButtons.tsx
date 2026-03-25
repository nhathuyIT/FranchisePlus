import { CreditCard, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartActionButtonsProps {
  onEditCart?: () => void;
  onCheckoutCart?: () => void;
  onCancelCart?: () => void;
  canEditCart?: boolean;
  canCheckoutCart?: boolean;
  canCancelCart?: boolean;
  isCancellingCart?: boolean;
  compact?: boolean;
}

export const CartActionButtons = ({
  onEditCart,
  onCheckoutCart,
  onCancelCart,
  canEditCart = false,
  canCheckoutCart = false,
  canCancelCart = false,
  isCancellingCart = false,
  compact = false,
}: CartActionButtonsProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {onEditCart ? (
      <Button
        type="button"
        size={compact ? "sm" : "default"}
        onClick={onEditCart}
        disabled={!canEditCart}
        className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
      >
        <Pencil className="mr-2 h-4 w-4" />
        Edit cart
      </Button>
    ) : null}

    {onCheckoutCart ? (
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={onCheckoutCart}
        disabled={!canCheckoutCart}
        className="border-[#D4B59E] bg-[#FFF8F1] text-[#8A4B2E] hover:bg-[#FFF1E3]"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Checkout
      </Button>
    ) : null}

    {onCancelCart ? (
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={onCancelCart}
        disabled={!canCancelCart || isCancellingCart}
        className="border-[#E7C5B8] bg-[#FFF6F2] text-[#B34B2A] hover:bg-[#FFEDE6]"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isCancellingCart ? "Canceling..." : "Cancel cart"}
      </Button>
    ) : null}
  </div>
);
