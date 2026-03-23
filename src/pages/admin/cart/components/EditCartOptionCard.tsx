import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import type { CartOptionResponse } from "@/types/cart";
import { formatCartMoney } from "../utils/cartDisplay";
import { useCartQuantityController } from "../hooks/useCartQuantityController";
import { CartProductImage } from "./CartProductImage";
import { CartQuantityField } from "./CartQuantityField";

interface EditCartOptionCardProps {
  option: CartOptionResponse;
  sizeLabel?: string;
  isPending: boolean;
  onCommitQuantity: (quantity: number) => Promise<boolean>;
  onRemove: () => Promise<boolean>;
}

export const EditCartOptionCard = ({
  option,
  sizeLabel,
  isPending,
  onCommitQuantity,
  onRemove,
}: EditCartOptionCardProps) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const quantityController = useCartQuantityController({
    serverQuantity: option.quantity,
    onCommit: onCommitQuantity,
    onDelete: onRemove,
  });

  return (
    <>
      <div className="rounded-2xl border border-[#E8DFD6] bg-[#FCF8F3] p-3">
        <div className="flex items-start gap-3">
          <CartProductImage
            src={option.productImageUrl}
            alt={option.productName || "Cart option"}
            className="h-12 w-12 shrink-0 rounded-xl"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[#3E2723]">
              {option.productName || "Unnamed option"}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#8D6E63]">
              {sizeLabel ? (
                <span className="rounded-full bg-white px-2 py-1 text-[#6D4C41]">
                  Size {sizeLabel}
                </span>
              ) : null}
              <span>
                {formatCartMoney(option.finalPrice || option.priceSnapshot)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              quantityController.cancelScheduledCommit();
              setRemoveDialogOpen(true);
            }}
            disabled={isPending}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DFD6] text-[#A65A00] transition-colors hover:bg-[#FFF3E0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex justify-end">
          <CartQuantityField
            controller={quantityController}
            entityLabel={option.productName || "Cart option"}
            entityTypeLabel="option item"
            disabled={isPending}
            compact
            deleteMessage={`Do you want to remove "${option.productName || "this option"}" from the cart item?`}
          />
        </div>
      </div>

      <DeleteDialog<string>
        open={removeDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setRemoveDialogOpen(true);
            return;
          }

          setRemoveDialogOpen(false);
        }}
        entity={option.productName || "Cart option"}
        entityName="option item"
        getDisplayName={(value) => value}
        deleteMessage={`Remove "${option.productName || "this option"}" from the current cart item?`}
        isDeleting={isPending}
        onConfirm={async () => {
          const wasRemoved = await onRemove();
          if (wasRemoved) {
            setRemoveDialogOpen(false);
          }
        }}
      />
    </>
  );
};
