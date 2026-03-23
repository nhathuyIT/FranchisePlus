import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartActionButtonsProps {
  onViewDetail: () => void;
  onEditCart?: () => void;
  canEditCart?: boolean;
  compact?: boolean;
}

export const CartActionButtons = ({
  onViewDetail,
  onEditCart,
  canEditCart = false,
  compact = false,
}: CartActionButtonsProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <Button
      type="button"
      variant="outline"
      size={compact ? "sm" : "default"}
      onClick={onViewDetail}
      className="border-[#E8DFD6] text-[#6D4C41] hover:bg-[#FFF8F1]"
    >
      <Eye className="mr-2 h-4 w-4" />
      View detail
    </Button>

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
  </div>
);
