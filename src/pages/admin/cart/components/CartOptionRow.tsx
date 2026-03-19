import type { CartOptionResponse } from "@/types/cart";
import { formatCartMoney } from "../utils/cartDisplay";
import { CartProductImage } from "./CartProductImage";

interface CartOptionRowProps {
  option: CartOptionResponse;
}

export const CartOptionRow = ({ option }: CartOptionRowProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E8DFD6] bg-[#FAF8F5] px-3 py-2">
    <div className="flex min-w-0 items-center gap-3">
      <CartProductImage
        src={option.productImageUrl}
        alt={option.productName || "Option product"}
        className="h-12 w-12 shrink-0 rounded-lg"
      />
      <div className="min-w-0">
        <p className="truncate text-md font-medium text-[#3E2723]">
          {option.productName || "Unnamed product"}
        </p>
      </div>
    </div>

    <div className="grid gap-1 text-right text-sm text-[#5D4037]">
      <p>Qty: {option.quantity}</p>
      <p>Unit Price: {formatCartMoney(option.priceSnapshot)}</p>
      <p className="font-semibold text-[#3E2723]">
        Final Total: {formatCartMoney(option.finalPrice)}
      </p>
    </div>
  </div>
);
