import { Minus, Plus } from "lucide-react";
import type { ProductListItem } from "@/types/product.type";
import { Textarea } from "@/components/ui/textarea";
import type { PosDraftCartItem } from "../types";
import { formatCartMoney } from "../utils/cartDisplay";
import { CartProductImage } from "./CartProductImage";

interface PosToppingPickerProps {
  selectedItem: PosDraftCartItem | null;
  toppings: ProductListItem[];
  isLoading?: boolean;
  onNoteChange: (itemId: string, note: string) => void;
  onIncrementTopping: (itemId: string, topping: ProductListItem) => void;
  onDecrementTopping: (itemId: string, toppingProductId: string) => void;
}

const getSizeLabel = (size?: string | null) => {
  const normalizedSize = size?.trim();

  if (!normalizedSize) {
    return "Default";
  }

  switch (normalizedSize.toUpperCase()) {
    case "DEFAULT":
      return "Default";
    case "SMALL":
      return "Small";
    case "MEDIUM":
      return "Medium";
    case "LARGE":
      return "Large";
    default:
      return normalizedSize;
  }
};

export const PosToppingPicker = ({
  selectedItem,
  toppings,
  isLoading = false,
  onNoteChange,
  onIncrementTopping,
  onDecrementTopping,
}: PosToppingPickerProps) => {
  if (!selectedItem) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-6 text-sm text-[#8D6E63]">
        Add one product first, then select it here to edit note and toppings.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
          Editing item
        </p>
        <p className="mt-1 text-base font-semibold text-[#3E2723]">
          {selectedItem.productName}
        </p>
        <p className="text-sm text-[#8D6E63]">
          {selectedItem.sizeLabel} - {formatCartMoney(selectedItem.price)}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#5D4037]">
          Item note
        </label>
        <Textarea
          value={selectedItem.note}
          onChange={(event) =>
            onNoteChange(selectedItem.id, event.target.value)
          }
          placeholder="Example: no ice, 30% sugar"
          rows={3}
          className="border-[#E8DFD6] bg-white"
        />
      </div>

      {!selectedItem.isHaveTopping ? (
        <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-6 text-sm text-[#8D6E63]">
          This product does not support toppings.
        </div>
      ) : isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-[#E8DFD6] bg-white p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-[#F3ECE6]" />
                <div className="flex-1">
                  <div className="mb-2 h-4 rounded bg-[#F3ECE6]" />
                  <div className="h-3 w-1/2 rounded bg-[#F7F1EB]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !toppings.length ? (
        <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-6 text-sm text-[#8D6E63]">
          No toppings found for this franchise.
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#5D4037]">Toppings</p>

          <div className="grid gap-3">
            {toppings.map((topping) => {
              const firstAvailableSize = topping.sizes.find(
                (size) => size.isAvailable,
              );

              if (!firstAvailableSize) {
                return null;
              }

              const selectedOption = selectedItem.options.find(
                (option) => option.productId === String(topping.productId),
              );
              const quantity = selectedOption?.quantity ?? 0;

              return (
                <div
                  key={String(topping.productId)}
                  className="rounded-2xl border border-[#E8DFD6] bg-white p-3"
                >
                  <div className="flex items-start gap-3">
                    <CartProductImage
                      src={topping.imageUrl}
                      alt={topping.name || "Unnamed topping"}
                      className="h-14 w-14 shrink-0 rounded-xl"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="break-words font-medium leading-5 text-[#3E2723]">
                        {topping.name || "Unnamed topping"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#8D6E63]">
                        <span className="rounded-full bg-[#FAF4EE] px-2 py-1 font-medium text-[#6D4C41]">
                          {getSizeLabel(firstAvailableSize.size)}
                        </span>
                        <span>{formatCartMoney(firstAvailableSize.price)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <div className="flex items-center rounded-full border border-[#E8DFD6] bg-[#FAF8F5] px-1">
                      <button
                        type="button"
                        onClick={() =>
                          onDecrementTopping(
                            selectedItem.id,
                            String(topping.productId),
                          )
                        }
                        disabled={quantity <= 0}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6D4C41] transition-colors hover:bg-[#F3ECE6] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="min-w-8 text-center text-sm font-semibold text-[#3E2723]">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          onIncrementTopping(selectedItem.id, topping)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6D4C41] transition-colors hover:bg-[#F3ECE6]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
