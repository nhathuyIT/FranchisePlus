import type { CartItemResponse } from "@/types/cart";
import { formatCartMoney } from "../utils/cartDisplay";
import { CartDetailField } from "./CartDetailField";
import { CartOptionRow } from "./CartOptionRow";
import { CartProductImage } from "./CartProductImage";

interface CartItemCardProps {
  item: CartItemResponse;
  index?: number;
}

export const CartItemCard = ({ item, index }: CartItemCardProps) => (
  <div className="overflow-hidden rounded-2xl border border-[#E2D4C7] bg-white shadow-sm ring-1 ring-[#F5EDE6]">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0E4DA] bg-[#FFF8F1] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[#D7CCC8] bg-white px-2 text-xs font-semibold text-[#6D4C41]">
          #{index ?? 1}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#3E2723]">
            {item.productName || "Unnamed product"}
          </p>
          <p className="mt-1 text-xs text-[#8D6E63]">
            {item.options.length > 0
              ? `${item.options.length} option(s)`
              : "No options"}
          </p>
        </div>
      </div>

      <div className="grid gap-1 text-right text-sm text-[#5D4037]">
        <p className="font-medium text-[#3E2723]">Qty: {item.quantity}</p>
        <p>Unit Price: {formatCartMoney(item.productCartPrice)}</p>
        <p className="font-semibold text-[#3E2723]">
          Final Total: {formatCartMoney(item.finalLineTotal)}
        </p>
      </div>
    </div>

    <div className="p-4">
      <div className="flex flex-wrap items-start gap-4">
        <CartProductImage
          src={item.productImageUrl}
          alt={item.productName || "Cart product"}
          className="h-20 w-20 shrink-0 rounded-xl"
        />

        <div className="min-w-0 flex-1">
          <div className="grid gap-3 md:grid-cols-3">
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
        </div>
      </div>

      {item.note ? (
        <div className="mt-4 rounded-xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-[#8D6E63]">Note</p>
          <p className="mt-2 text-sm text-[#5D4037]">{item.note}</p>
        </div>
      ) : null}

      {item.options.length > 0 ? (
        <div className="mt-4 rounded-xl border border-[#EFE2D7] bg-[#FFFCF8] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
              Options
            </p>
            <span className="text-xs font-medium text-[#8D6E63]">
              {item.options.length} option(s)
            </span>
          </div>

          <div className="mt-3 space-y-3">
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
  </div>
);
