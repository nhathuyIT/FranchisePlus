import type { CartItemResponse } from "@/types/cart";
import { formatCartMoney } from "../utils/cartDisplay";
import { CartDetailField } from "./CartDetailField";
import { CartOptionRow } from "./CartOptionRow";
import { CartProductImage } from "./CartProductImage";

interface CartItemCardProps {
  item: CartItemResponse;
}

export const CartItemCard = ({ item }: CartItemCardProps) => (
  <div className="rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <CartProductImage
          src={item.productImageUrl}
          alt={item.productName || "Cart product"}
          className="h-16 w-16 shrink-0"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#3E2723]">
            {item.productName || "Unnamed product"}
          </p>
        </div>
      </div>

      <div className="grid gap-1 text-right text-sm text-[#5D4037]">
        <p>Qty: {item.quantity}</p>
        <p>Unit Price: {formatCartMoney(item.productCartPrice)}</p>
        <p className="font-semibold text-[#3E2723]">
          Final Total: {formatCartMoney(item.finalLineTotal)}
        </p>
      </div>
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <CartDetailField
        label="Discount"
        value={formatCartMoney(item.discountAmount)}
      />
      <CartDetailField
        label="Line Total"
        value={formatCartMoney(item.lineTotal)}
      />
      <CartDetailField
        label="Options Count"
        value={item.options.length.toString()}
      />
    </div>

    {item.note ? (
      <div className="mt-4 rounded-xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-[#8D6E63]">Note</p>
        <p className="mt-2 text-sm text-[#5D4037]">{item.note}</p>
      </div>
    ) : null}

    {item.options.length > 0 ? (
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
          Options
        </p>
        <div className="mt-2 space-y-2">
          {item.options.map((option, optionIndex) => (
            <CartOptionRow
              key={`${item.cartItemId}-${option.productFranchiseId}-${optionIndex}`}
              option={option}
            />
          ))}
        </div>
      </div>
    ) : null}
  </div>
);
