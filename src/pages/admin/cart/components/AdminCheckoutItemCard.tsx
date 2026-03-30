import type { CartItemResponse } from "@/types/cart";
import { formatCartMoney } from "../utils/cartDisplay";
import { CartDetailField } from "./CartDetailField";
import { CartOptionRow } from "./CartOptionRow";
import { CartProductImage } from "./CartProductImage";

interface AdminCheckoutItemCardProps {
  item: CartItemResponse;
  index: number;
}

export const AdminCheckoutItemCard = ({
  item,
  index,
}: AdminCheckoutItemCardProps) => (
  <article className="overflow-hidden rounded-[26px] border border-[#E3D5C8] bg-white shadow-sm">
    <div className="flex flex-wrap items-start gap-4 border-b border-[#F0E4DA] bg-[#FFF8F1] px-5 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[#D7CCC8] bg-white px-2 text-xs font-semibold text-[#6D4C41]">
          #{index}
        </span>

        <CartProductImage
          src={item.productImageUrl}
          alt={item.productName || "Cart product"}
          className="h-16 w-16 shrink-0 rounded-2xl"
        />

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[#3E2723]">
            {item.productName || "Unnamed product"}
          </p>
          <p className="mt-1 text-sm text-[#8D6E63]">
            Qty: {item.quantity} · Unit: {formatCartMoney(item.productCartPrice)}
          </p>
          <p className="mt-1 text-sm font-medium text-[#5D4037]">
            Final total: {formatCartMoney(item.finalLineTotal)}
          </p>
        </div>
      </div>
    </div>

    <div className="p-5">
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
          value={`${item.options.length} option(s)`}
        />
      </div>

      {item.note ? (
        <div className="mt-4 rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-[#8D6E63]">Note</p>
          <p className="mt-2 text-sm text-[#5D4037]">{item.note}</p>
        </div>
      ) : null}

      {item.options.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-[#EFE2D7] bg-[#FFFCF8] px-4 py-4">
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
  </article>
);
