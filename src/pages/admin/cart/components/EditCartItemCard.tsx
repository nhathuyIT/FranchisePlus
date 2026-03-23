import { useEffect, useMemo, useState } from "react";
import { MessageSquareText, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CartItemResponse } from "@/types/cart";
import { formatCartMoney } from "../utils/cartDisplay";
import { useCartQuantityController } from "../hooks/useCartQuantityController";
import { CartProductImage } from "./CartProductImage";
import { CartQuantityField } from "./CartQuantityField";
import { EditCartOptionCard } from "./EditCartOptionCard";

interface EditCartItemCardProps {
  item: CartItemResponse;
  sizeLabel?: string;
  isPending: boolean;
  resolveSizeLabel: (productFranchiseId: string) => string | undefined;
  isOptionPending: (optionProductFranchiseId: string) => boolean;
  onCommitQuantity: (quantity: number) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
  onSaveNote: (note: string, quantity: number) => Promise<boolean>;
  onCommitOptionQuantity: (
    optionProductFranchiseId: string,
    quantity: number,
  ) => Promise<boolean>;
  onRemoveOption: (optionProductFranchiseId: string) => Promise<boolean>;
}

export const EditCartItemCard = ({
  item,
  sizeLabel,
  isPending,
  resolveSizeLabel,
  isOptionPending,
  onCommitQuantity,
  onDelete,
  onSaveNote,
  onCommitOptionQuantity,
  onRemoveOption,
}: EditCartItemCardProps) => {
  const [noteDraft, setNoteDraft] = useState(item.note ?? "");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const quantityController = useCartQuantityController({
    serverQuantity: item.quantity,
    onCommit: onCommitQuantity,
    onDelete,
  });

  useEffect(() => {
    setNoteDraft(item.note ?? "");
  }, [item.cartItemId, item.note]);

  const noteChanged = useMemo(
    () => noteDraft !== (item.note ?? ""),
    [item.note, noteDraft],
  );

  return (
    <>
      <article className="rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-4">
            <CartProductImage
              src={item.productImageUrl}
              alt={item.productName || "Cart product"}
              className="h-16 w-16 shrink-0 rounded-2xl"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-base font-semibold text-[#3E2723]">
                  {item.productName || "Unnamed product"}
                </p>
                {sizeLabel ? (
                  <span className="rounded-full bg-[#FAF1E8] px-2.5 py-1 text-xs text-[#6D4C41]">
                    Size {sizeLabel}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#8D6E63]">
                <span>Unit: {formatCartMoney(item.productCartPrice)}</span>
                <span>Discount: {formatCartMoney(item.discountAmount)}</span>
                <span className="font-semibold text-[#3E2723]">
                  Final: {formatCartMoney(item.finalLineTotal)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              quantityController.cancelScheduledCommit();
              setRemoveDialogOpen(true);
            }}
            disabled={isPending}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DFD6] text-[#A65A00] transition-colors hover:bg-[#FFF3E0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
              Quantity
            </p>
            <div className="mt-2">
              <CartQuantityField
                controller={quantityController}
                entityLabel={item.productName || "Cart item"}
                entityTypeLabel="cart item"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
              Line Total
            </p>
            <p className="mt-1 text-lg font-semibold text-[#3E2723]">
              {formatCartMoney(item.finalLineTotal)}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#E8DFD6] bg-[#FFFDFC] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#3E2723]">
            <MessageSquareText className="h-4 w-4" />
            Item Note
          </div>

          <Textarea
            rows={3}
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            disabled={isPending || quantityController.confirmDeleteOpen}
            placeholder="Example: less ice, 30% sugar"
            className="mt-3 border-[#E8DFD6] bg-white"
          />

          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending || isSavingNote || !noteChanged}
              onClick={() => setNoteDraft(item.note ?? "")}
              className="border-[#E8DFD6] text-[#6D4C41]"
            >
              Reset
            </Button>
            <Button
              type="button"
              disabled={isPending || isSavingNote || !noteChanged}
              onClick={() => {
                quantityController.cancelScheduledCommit();

                void (async () => {
                  setIsSavingNote(true);
                  const wasSaved = await onSaveNote(
                    noteDraft,
                    quantityController.currentQuantity,
                  );
                  if (!wasSaved) {
                    setNoteDraft(item.note ?? "");
                  }
                  setIsSavingNote(false);
                })();
              }}
              className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
            >
              {isSavingNote ? "Saving note..." : "Save note"}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#3E2723]">Options</p>
              <p className="mt-1 text-xs text-[#8D6E63]">
                Update quantity or remove existing option items.
              </p>
            </div>
          </div>

          {item.options.length > 0 ? (
            <div className="mt-3 space-y-3">
              {item.options.map((option) => (
                <EditCartOptionCard
                  key={`${item.cartItemId}-${option.productFranchiseId}`}
                  option={option}
                  sizeLabel={resolveSizeLabel(option.productFranchiseId)}
                  isPending={isOptionPending(option.productFranchiseId)}
                  onCommitQuantity={(quantity) =>
                    onCommitOptionQuantity(option.productFranchiseId, quantity)
                  }
                  onRemove={() => onRemoveOption(option.productFranchiseId)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-4 text-sm text-[#8D6E63]">
              This cart item does not have any option rows yet.
            </div>
          )}
        </div>
      </article>

      <DeleteDialog<string>
        open={removeDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setRemoveDialogOpen(true);
            return;
          }

          setRemoveDialogOpen(false);
        }}
        entity={item.productName || "Cart item"}
        entityName="cart item"
        getDisplayName={(value) => value}
        deleteMessage={`Remove "${item.productName || "this cart item"}" from the cart?`}
        isDeleting={isPending}
        onConfirm={async () => {
          const wasRemoved = await onDelete();
          if (wasRemoved) {
            setRemoveDialogOpen(false);
          }
        }}
      />
    </>
  );
};
