import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CartTableHeaderProps {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: (checked: boolean) => void;
}

const CartTableHeader: React.FC<CartTableHeaderProps> = ({
  allChecked,
  someChecked,
  onToggleAll,
}) => {
  return (
    <div className="hidden grid-cols-[52px_minmax(0,1fr)_140px_156px_150px_170px] items-center gap-4 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--cart-muted)] lg:grid">
      <div className="flex justify-center">
        <Checkbox
          checked={allChecked ? true : someChecked ? "indeterminate" : false}
          onCheckedChange={(checked) => onToggleAll(checked === true)}
        />
      </div>
      <div>Product</div>
      <div className="text-center">Unit price</div>
      <div className="text-center">Quantity</div>
      <div className="text-center">Total</div>
      <div className="text-center">Actions</div>
    </div>
  );
};

export default CartTableHeader;
