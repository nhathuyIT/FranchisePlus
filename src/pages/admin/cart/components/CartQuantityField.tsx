import { Loader2 } from "lucide-react";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import type { CartQuantityController } from "../hooks/useCartQuantityController";

interface CartQuantityFieldProps {
  controller: CartQuantityController;
  entityLabel: string;
  entityTypeLabel?: string;
  deleteMessage?: string;
  disabled?: boolean;
  compact?: boolean;
}

export const CartQuantityField = ({
  controller,
  entityLabel,
  entityTypeLabel = "cart item",
  deleteMessage,
  disabled = false,
  compact = false,
}: CartQuantityFieldProps) => {
  const isDisabled = disabled || controller.isSubmitting;
  const buttonClassName = compact ? "h-8 w-8" : "h-10 w-10";
  const inputClassName = compact ? "h-8 min-w-10 px-2" : "h-10 min-w-14 px-3";

  return (
    <>
      <div className="inline-flex items-center overflow-hidden rounded-full border border-[#E8DFD6] bg-white shadow-sm">
        <button
          type="button"
          disabled={isDisabled}
          onClick={controller.handleDecrement}
          className={`${buttonClassName} text-[#6D4C41] transition-colors hover:bg-[#F8F1EA] disabled:cursor-not-allowed disabled:opacity-40`}
        >
          -
        </button>

        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={isDisabled}
            value={controller.draftQuantity}
            onChange={(event) =>
              controller.handleInputChange(event.target.value)
            }
            onBlur={controller.handleInputBlur}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={controller.handleInputKeyDown}
            className={`${inputClassName} border-x border-[#E8DFD6] bg-transparent text-center text-sm font-semibold text-[#3E2723] outline-none disabled:cursor-not-allowed disabled:opacity-60`}
            aria-label={`Quantity for ${entityLabel}`}
          />

          {controller.isSubmitting ? (
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#8D6E63]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </span>
          ) : null}
        </div>

        <button
          type="button"
          disabled={isDisabled}
          onClick={controller.handleIncrement}
          className={`${buttonClassName} text-[#6D4C41] transition-colors hover:bg-[#F8F1EA] disabled:cursor-not-allowed disabled:opacity-40`}
        >
          +
        </button>
      </div>

      <DeleteDialog<string>
        open={controller.confirmDeleteOpen}
        onOpenChange={(open) => {
          if (open) {
            controller.setConfirmDeleteOpen(true);
            return;
          }

          controller.handleCancelDelete();
        }}
        entity={entityLabel}
        entityName={entityTypeLabel}
        getDisplayName={(value) => value}
        deleteMessage={
          deleteMessage ??
          `Do you want to remove "${entityLabel}" from this cart?`
        }
        isDeleting={controller.isSubmitting}
        onConfirm={controller.handleConfirmDelete}
      />
    </>
  );
};
