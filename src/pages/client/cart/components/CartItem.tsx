import React from "react";
import { useForm } from "react-hook-form";
import { MessageSquareText, Trash2 } from "lucide-react";
import type { CartItemResponse } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import { formatCurrency } from "../cart.utils";

type CartItemNoteForm = {
  note: string;
};

interface QuantityControlProps {
  quantity: number;
  disabled?: boolean;
  onUpdateQuantity: (quantity: number) => void;
}

interface CartItemProps {
  item: CartItemResponse;
  checked: boolean;
  isPending: boolean;
  resolveProductImage: (
    productFranchiseId: string,
    imageUrl?: string | null,
  ) => string | undefined;
  resolveProductSize: (productFranchiseId: string) => string | undefined;
  onToggle: (checked: boolean) => void;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onSaveNote: (note: string) => Promise<boolean> | void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  disabled = false,
  onUpdateQuantity,
}) => {
  const currentQuantity = Math.max(1, Number(quantity || 1));
  const [draftQuantity, setDraftQuantity] = React.useState(
    String(currentQuantity),
  );

  React.useEffect(() => {
    setDraftQuantity(String(currentQuantity));
  }, [currentQuantity]);

  const commitQuantity = () => {
    const parsedQuantity = Number.parseInt(draftQuantity, 10);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setDraftQuantity(String(currentQuantity));
      return;
    }

    const normalizedQuantity = Math.max(1, parsedQuantity);
    setDraftQuantity(String(normalizedQuantity));

    if (normalizedQuantity !== currentQuantity) {
      onUpdateQuantity(normalizedQuantity);
    }
  };

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-[var(--cart-border)] bg-white shadow-[0_12px_24px_rgba(63,41,33,0.06)]">
      <button
        type="button"
        disabled={disabled || currentQuantity <= 1}
        onClick={() => onUpdateQuantity(Math.max(1, currentQuantity - 1))}
        className="h-11 w-11 text-lg text-[var(--cart-ink)] transition-colors hover:bg-[#fbf3ec] disabled:cursor-not-allowed disabled:text-[#c4b5aa] disabled:hover:bg-white"
      >
        -
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        disabled={disabled}
        value={draftQuantity}
        onChange={(event) => {
          const digitsOnly = event.target.value.replace(/\D/g, "");

          if (!digitsOnly) {
            setDraftQuantity("");
            return;
          }

          const normalizedValue = String(
            Math.max(1, Number.parseInt(digitsOnly, 10) || 1),
          );
          setDraftQuantity(normalizedValue);
        }}
        onBlur={commitQuantity}
        onFocus={(event) => event.currentTarget.select()}
        onKeyDown={(event) => {
          if (["-", "+", ".", ",", "e", "E"].includes(event.key)) {
            event.preventDefault();
          }

          if (event.key === "Enter") {
            event.preventDefault();
            commitQuantity();
          }
        }}
        className="h-11 min-w-16 border-x border-[var(--cart-border)] bg-transparent px-3 text-center text-sm font-medium text-[var(--cart-ink)] outline-none disabled:cursor-not-allowed disabled:text-[#c4b5aa]"
        aria-label="Quantity"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => onUpdateQuantity(currentQuantity + 1)}
        className="h-11 w-11 text-lg text-[var(--cart-ink)] transition-colors hover:bg-[#fbf3ec] disabled:cursor-not-allowed disabled:text-[#c4b5aa] disabled:hover:bg-white"
      >
        +
      </button>
    </div>
  );
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  checked,
  isPending,
  resolveProductImage,
  resolveProductSize,
  onToggle,
  onUpdateQuantity,
  onRemove,
  onSaveNote,
}) => {
  const [isNoteEditorOpen, setIsNoteEditorOpen] = React.useState(false);
  const originalLineTotal = Number(item.lineTotal || 0);
  const finalLineTotal = Number(item.finalLineTotal || 0);
  const currentQuantity = Math.max(1, Number(item.quantity || 1));
  const productName = item.productName || item.productFranchiseId;
  const productSizeLabel = resolveProductSize(item.productFranchiseId);
  const productImage =
    resolveProductImage(item.productFranchiseId, item.productImageUrl) ||
    coffeeCupIcon;

  const noteForm = useForm<CartItemNoteForm>({
    defaultValues: {
      note: item.note ?? "",
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = noteForm;

  React.useEffect(() => {
    reset({
      note: item.note ?? "",
    });
  }, [item.cartItemId, item.note, reset]);

  return (
    <article
      aria-busy={isPending}
      className={`rounded-[1.55rem] border border-transparent bg-white/45 px-4 py-5 transition-all md:px-5 lg:grid lg:grid-cols-[52px_minmax(0,1fr)_140px_156px_150px_170px] lg:items-center lg:gap-4 ${
        isPending ? "opacity-70" : "hover:border-[var(--cart-border-soft)]"
      }`}
    >
      <div className="flex items-start gap-4 lg:contents">
        <div className="flex justify-center pt-1 lg:pt-0">
          <Checkbox
            disabled={isPending}
            checked={checked}
            onCheckedChange={(next) => onToggle(next === true)}
          />
        </div>

        <div className="min-w-0 flex-1 lg:min-w-0">
          <div className="flex gap-4">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1.35rem] border border-[var(--cart-border)] bg-[#fbf7f1] shadow-[0_16px_30px_rgba(63,41,33,0.08)]">
              <img
                src={productImage}
                alt={productName}
                className="h-full w-full object-cover"
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.src = coffeeCupIcon;
                  target.style.objectFit = "contain";
                  target.style.padding = "12px";
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start gap-2">
                <h3 className="line-clamp-2 text-[17px] font-semibold leading-7 text-[var(--cart-ink)]">
                  {productName}
                </h3>

                {productSizeLabel && (
                  <span className="rounded-full border border-[var(--cart-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--cart-ink)] shadow-[0_8px_18px_rgba(63,41,33,0.04)]">
                    Size {productSizeLabel}
                  </span>
                )}

                {!!item.options?.length && (
                  <span className="rounded-full bg-[#fff1e7] px-3 py-1 text-xs font-medium text-[var(--cart-accent)]">
                    + {item.options.length} options
                  </span>
                )}
              </div>

              {!!item.options?.length && (
                <div className="mt-3 space-y-2.5">
                  {item.options.map((option) => {
                    const optionName =
                      option.productName || option.productFranchiseId;
                    const optionSizeLabel = resolveProductSize(
                      option.productFranchiseId,
                    );
                    const optionImage =
                      resolveProductImage(
                        option.productFranchiseId,
                        option.productImageUrl,
                      ) || coffeeCupIcon;

                    return (
                      <div
                        key={`${item.cartItemId}-${option.productFranchiseId}`}
                        className="flex items-center gap-3 rounded-[1.15rem] border border-[var(--cart-border-soft)] bg-[#fcf7f2] px-3 py-2.5"
                      >
                        <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-[0.95rem] border border-[var(--cart-border)] bg-white">
                          <img
                            src={optionImage}
                            alt={optionName}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              const target = event.target as HTMLImageElement;
                              target.src = coffeeCupIcon;
                              target.style.objectFit = "contain";
                              target.style.padding = "6px";
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1 text-sm text-[var(--cart-ink)]">
                          <p className="truncate font-medium">{optionName}</p>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--cart-muted)]">
                            {optionSizeLabel && (
                              <span>Size: {optionSizeLabel}</span>
                            )}
                            <span>Qty: {option.quantity}</span>
                            <span>
                              {formatCurrency(Number(option.finalPrice || 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {item.note && (
                <div className="mt-3 inline-flex max-w-full rounded-full border border-[var(--cart-border)] bg-white/90 px-3 py-1.5 text-xs text-[var(--cart-muted)]">
                  Note: {item.note}
                </div>
              )}

              <div className="mt-4 grid gap-2 rounded-[1.25rem] border border-[var(--cart-border-soft)] bg-[#fbf6f0] px-4 py-3 text-sm lg:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--cart-muted)]">Unit price</span>
                  <span className="font-medium text-[var(--cart-ink)]">
                    {formatCurrency(item.productCartPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--cart-muted)]">Total</span>
                  <span className="font-medium text-[var(--cart-accent)]">
                    {formatCurrency(finalLineTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden text-center lg:block">
          {originalLineTotal > finalLineTotal && (
            <p className="text-sm text-[#aa8f80] line-through">
              {formatCurrency(originalLineTotal)}
            </p>
          )}
          <p className="mt-1 text-base text-[var(--cart-ink)]">
            {formatCurrency(item.productCartPrice)}
          </p>
        </div>

        <div className="mt-4 flex justify-center lg:mt-0">
          <QuantityControl
            quantity={currentQuantity}
            disabled={isPending}
            onUpdateQuantity={onUpdateQuantity}
          />
        </div>

        <div className="hidden text-center lg:block">
          {originalLineTotal > finalLineTotal && (
            <p className="text-sm text-[#aa8f80] line-through">
              {formatCurrency(originalLineTotal)}
            </p>
          )}
          <p className="mt-1 text-lg font-semibold text-[var(--cart-accent)]">
            {formatCurrency(finalLineTotal)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 lg:mt-0 lg:flex-wrap lg:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setIsNoteEditorOpen((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all disabled:cursor-not-allowed disabled:text-[#b7a59a] ${
              isNoteEditorOpen
                ? "border-[#ebc7b5] bg-[#fff3ea] text-[var(--cart-accent)]"
                : "border-[var(--cart-border)] bg-white/88 text-[var(--cart-muted)] hover:border-[#d7b7a4] hover:text-[var(--cart-accent)]"
            }`}
          >
            <MessageSquareText className="h-4 w-4" />
            {isNoteEditorOpen ? "Close note" : "Note"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--cart-border)] bg-white/88 px-3.5 py-2 text-sm text-[var(--cart-muted)] transition-all hover:border-[#e0beb0] hover:text-[var(--cart-accent)] disabled:cursor-not-allowed disabled:text-[#b7a59a]"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>

      {isNoteEditorOpen && (
        <div className="mt-4 min-w-0 lg:col-start-2 lg:col-end-7 lg:mt-5">
          <form
            onSubmit={handleSubmit(async (values) => {
              const wasSaved = await onSaveNote(values.note);
              if (wasSaved !== false) {
                setIsNoteEditorOpen(false);
              }
            })}
            className="rounded-[1.5rem] border border-[var(--cart-border)] bg-[linear-gradient(180deg,#fffdf9_0%,#fbf4ed_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[1rem] bg-white text-[var(--cart-accent)] shadow-[0_10px_24px_rgba(63,41,33,0.05)]">
                <MessageSquareText className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-[var(--cart-ink)]">
                    Note for this item
                  </p>
                  <p className="mt-1 text-xs text-[var(--cart-muted)]">
                    Add a request so the store can prepare it more accurately.
                  </p>
                </div>

                <Textarea
                  disabled={isPending}
                  placeholder="For example: less ice, pack separately, seal carefully..."
                  className="min-h-28 resize-y rounded-[1.2rem] border-[var(--cart-border)] bg-white/95 text-[var(--cart-ink)] placeholder:text-[#a08778]"
                  {...register("note")}
                />

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => {
                      reset({
                        note: item.note ?? "",
                      });
                      setIsNoteEditorOpen(false);
                    }}
                    className="rounded-full border-[var(--cart-border)] bg-white/80 text-[var(--cart-ink)] hover:bg-white"
                  >
                    Close
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending || !isDirty}
                    className="rounded-full bg-[linear-gradient(135deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)] text-white shadow-[0_14px_28px_rgba(183,104,67,0.22)] hover:opacity-95"
                  >
                    {isPending ? "Saving..." : "Save note"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};

export default CartItem;
