import type { CartOptionResponse } from "@/types/cart";
import { formatCartMoney } from "../utils/cartDisplay";
import { CartProductImage } from "./CartProductImage";

interface CartOptionRowProps {
  option: CartOptionResponse;
}

export const CartOptionRow = ({ option }: CartOptionRowProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8DFD6] bg-white px-3 py-3 shadow-sm">
    <div className="flex min-w-0 items-center gap-3">
      <CartProductImage
        src={option.productImageUrl}
        alt={option.productName || "Option product"}
        className="h-12 w-12 shrink-0 rounded-lg"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#3E2723]">
          {option.productName || "Unnamed product"}
        </p>
        <p className="mt-1 text-xs text-[#8D6E63]">
          Qty: {option.quantity} · Unit: {formatCartMoney(option.priceSnapshot)}
        </p>
      </div>
    </div>

    <div className="grid gap-1 text-right text-sm text-[#5D4037]">
      <p className="font-semibold text-[#3E2723]">
        Final Total: {formatCartMoney(option.finalPrice)}
      </p>
    </div>
  </div>
);
