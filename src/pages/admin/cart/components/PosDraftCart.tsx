import { Minus, Plus, Trash2 } from "lucide-react";
import type { PosDraftCartItem } from "../types";
import { formatCartMoney } from "../utils/cartDisplay";

interface PosDraftCartProps {
  items: PosDraftCartItem[];
  selectedItemId?: string | null;
  onSelectItem: (itemId: string) => void;
  onIncrementItem: (itemId: string) => void;
  onDecrementItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

const getLineTotal = (item: PosDraftCartItem) => {
  const optionTotal = item.options.reduce(
    (total, option) => total + option.price * option.quantity,
    0,
  );

  return (item.price + optionTotal) * item.quantity;
};

export const PosDraftCart = ({
  items,
  selectedItemId,
  onSelectItem,
  onIncrementItem,
  onDecrementItem,
  onRemoveItem,
}: PosDraftCartProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + getLineTotal(item), 0);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#3E2723]">Draft Cart</p>
          <p className="text-xs text-[#8D6E63]">{totalItems} item(s)</p>
        </div>
        <p className="text-sm font-semibold text-[#6D4C41]">
          {formatCartMoney(totalAmount)}
        </p>
      </div>

      {!items.length ? (
        <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-8 text-sm text-[#8D6E63]">
          No draft items yet. Click a product size to add it here.
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-1">
          {items.map((item) => {
            const isSelected = item.id === selectedItemId;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectItem(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectItem(item.id);
                  }
                }}
                className={
                  isSelected
                    ? "w-full rounded-2xl border border-[#C8B7A7] bg-[#FFF8F1] p-4 text-left shadow-sm"
                    : "w-full rounded-2xl border border-[#E8DFD6] bg-white p-4 text-left shadow-sm transition-colors hover:bg-[#FAF8F5]"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#3E2723]">
                      {item.productName}
                    </p>
                    <p className="text-sm text-[#8D6E63]">
                      {item.sizeLabel} - {formatCartMoney(item.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DFD6] text-[#A65A00] transition-colors hover:bg-[#FFF3E0]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {item.options.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.options.map((option) => (
                      <span
                        key={option.id}
                        className="rounded-full bg-[#FAF1E8] px-2.5 py-1 text-xs text-[#6D4C41]"
                      >
                        {option.productName} x{option.quantity}
                      </span>
                    ))}
                  </div>
                ) : null}

                {item.note ? (
                  <p className="mt-3 line-clamp-2 text-sm text-[#5D4037]">
                    Note: {item.note}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-[#E8DFD6] bg-[#FAF8F5]">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDecrementItem(item.id);
                      }}
                      disabled={item.quantity <= 1}
                      className="inline-flex h-8 w-8 items-center justify-center text-[#6D4C41] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-[#3E2723]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onIncrementItem(item.id);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center text-[#6D4C41]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-[#3E2723]">
                    {formatCartMoney(getLineTotal(item))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
