import React from "react";
import { PencilLine, Trash2 } from "lucide-react";
import type {
  CartItemEditConfig,
  CartItemOptionRequest,
  CartItemResponse,
} from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import { formatCurrency } from "../cart.utils";

interface QuantityControlProps {
  quantity: number;
  disabled?: boolean;
  fullWidth?: boolean;
  onUpdateQuantity: (quantity: number) => void;
}

interface CartItemProps {
  item: CartItemResponse;
  checked: boolean;
  isPending: boolean;
  editConfig?: CartItemEditConfig;
  resolveProductImage: (
    productFranchiseId: string,
    imageUrl?: string | null,
  ) => string | undefined;
  resolveProductSize: (productFranchiseId: string) => string | undefined;
  onToggle: (checked: boolean) => void;
  onSaveEdit: (
    options: CartItemOptionRequest[],
  ) => Promise<boolean> | void;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function normalizeCartItemOptions(options?: CartItemOptionRequest[]) {
  if (!Array.isArray(options)) return [];

  return options
    .filter(
      (option) =>
        !!option?.productFranchiseId && Number(option.quantity || 0) > 0,
    )
    .map((option) => ({
      productFranchiseId: String(option.productFranchiseId),
      quantity: Math.max(1, Number(option.quantity || 1)),
    }))
    .sort((left, right) =>
      left.productFranchiseId.localeCompare(right.productFranchiseId),
    );
}

function areCartItemOptionsEqual(
  left: CartItemOptionRequest[],
  right: CartItemOptionRequest[],
) {
  return (
    JSON.stringify(normalizeCartItemOptions(left)) ===
    JSON.stringify(normalizeCartItemOptions(right))
  );
}

function buildInitialSelectedToppings(
  item: CartItemResponse,
  editConfig?: CartItemEditConfig,
) {
  const selectedToppings: Record<string, string> = {};

  if (!editConfig) return selectedToppings;

  editConfig.toppingOptions.forEach((topping) => {
    const matchedOption = (item.options ?? []).find((option) =>
      topping.sizes.some(
        (size) =>
          String(size.productFranchiseId) === String(option.productFranchiseId),
      ),
    );

    if (matchedOption) {
      selectedToppings[String(topping.productId)] = String(
        matchedOption.productFranchiseId,
      );
    }
  });

  return selectedToppings;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  disabled = false,
  fullWidth = false,
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
    <div
      className={`items-center overflow-hidden rounded-full border border-[var(--cart-border)] bg-white shadow-[0_12px_24px_rgba(63,41,33,0.06)] ${
        fullWidth ? "flex w-full" : "inline-flex"
      }`}
    >
      <button
        type="button"
        disabled={disabled || currentQuantity <= 1}
        onClick={() => onUpdateQuantity(Math.max(1, currentQuantity - 1))}
        className="h-9 w-9 text-base text-[var(--cart-ink)] transition-colors hover:bg-[#fbf3ec] disabled:cursor-not-allowed disabled:text-[#c4b5aa] disabled:hover:bg-white sm:h-11 sm:w-11 sm:text-lg"
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
        className={`h-9 border-x border-[var(--cart-border)] bg-transparent px-2 text-center text-sm font-medium text-[var(--cart-ink)] outline-none disabled:cursor-not-allowed disabled:text-[#c4b5aa] sm:h-11 sm:px-3 ${
          fullWidth ? "min-w-0 flex-1" : "min-w-12 sm:min-w-16"
        }`}
        aria-label="Quantity"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => onUpdateQuantity(currentQuantity + 1)}
        className="h-9 w-9 text-base text-[var(--cart-ink)] transition-colors hover:bg-[#fbf3ec] disabled:cursor-not-allowed disabled:text-[#c4b5aa] disabled:hover:bg-white sm:h-11 sm:w-11 sm:text-lg"
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
  editConfig,
  resolveProductImage,
  resolveProductSize,
  onToggle,
  onSaveEdit,
  onUpdateQuantity,
  onRemove,
}) => {
  const [isEditEditorOpen, setIsEditEditorOpen] = React.useState(false);
  const originalLineTotal = Number(item.lineTotal || 0);
  const finalLineTotal = Number(item.finalLineTotal || 0);
  const currentQuantity = Math.max(1, Number(item.quantity || 1));
  const productName = item.productName || item.productFranchiseId;
  const productSizeLabel = resolveProductSize(item.productFranchiseId);
  const productImage =
    resolveProductImage(item.productFranchiseId, item.productImageUrl) ||
    coffeeCupIcon;
  const canEdit = Boolean(editConfig && editConfig.toppingOptions.length > 0);

  const createEditDraft = React.useCallback(
    () => buildInitialSelectedToppings(item, editConfig),
    [editConfig, item],
  );

  const [selectedEditToppings, setSelectedEditToppings] = React.useState<
    Record<string, string>
  >(() => createEditDraft());

  const currentItemOptions = React.useMemo(
    () =>
      normalizeCartItemOptions(
        (item.options ?? []).map((option) => ({
          productFranchiseId: option.productFranchiseId,
          quantity: Math.max(1, Number(option.quantity || 1)),
        })),
      ),
    [item.options],
  );

  const selectedEditOptions = React.useMemo(
    () =>
      normalizeCartItemOptions(
        Object.values(selectedEditToppings)
          .filter(Boolean)
          .map((productFranchiseId) => ({
            productFranchiseId: String(productFranchiseId),
            quantity: 1,
          })),
      ),
    [selectedEditToppings],
  );

  const compactOptionSummary = React.useMemo(() => {
    const optionSummaryMap = new Map<string, number>();

    (item.options ?? []).forEach((option) => {
      const optionName = String(
        option.productName || option.productFranchiseId || "",
      ).trim();

      if (!optionName) return;

      optionSummaryMap.set(
        optionName,
        (optionSummaryMap.get(optionName) ?? 0) +
          Math.max(1, Number(option.quantity || 1)),
      );
    });

    return Array.from(optionSummaryMap.entries())
      .map(([name, quantity]) =>
        quantity > 1 ? `+ ${name} (${quantity})` : `+ ${name}`,
      )
      .join(", ");
  }, [item.options]);

  const itemNote = String(item.note || "").trim();

  const hasEditChanges = !areCartItemOptionsEqual(
    selectedEditOptions,
    currentItemOptions,
  );

  const resetEditDraft = React.useCallback(() => {
    setSelectedEditToppings(createEditDraft());
  }, [createEditDraft]);

  React.useEffect(() => {
    resetEditDraft();
  }, [resetEditDraft]);

  return (
    <article
      aria-busy={isPending}
      className={`rounded-[1.3rem] border border-transparent bg-white/45 px-3.5 py-4 transition-all sm:rounded-[1.55rem] sm:px-5 sm:py-5 min-[1180px]:grid min-[1180px]:grid-cols-[52px_minmax(0,1fr)_120px_156px_140px_200px] min-[1180px]:items-center min-[1180px]:gap-4 ${
        isPending ? "opacity-70" : "hover:border-[var(--cart-border-soft)]"
      }`}
    >
      <div className="flex flex-col gap-4 min-[1180px]:contents">
        <div className="flex items-start gap-3.5 sm:gap-4 min-[1180px]:contents">
          <div className="flex justify-center pt-0.5 sm:pt-1 min-[1180px]:pt-0">
            <Checkbox
              disabled={isPending}
              checked={checked}
              onCheckedChange={(next) => onToggle(next === true)}
            />
          </div>

          <div className="min-w-0 flex-1 min-[1180px]:min-w-0">
            <div className="flex min-w-0 gap-3 sm:gap-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.15rem] border border-[var(--cart-border)] bg-[#fbf7f1] shadow-[0_16px_30px_rgba(63,41,33,0.08)] sm:h-24 sm:w-24 sm:rounded-[1.35rem]">
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
                  <h3 className="line-clamp-2 text-base font-semibold leading-6 text-[var(--cart-ink)] sm:text-[17px] sm:leading-7">
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
                {!!item.options?.length && !isEditEditorOpen && (
                  <div className="mt-3 rounded-[1.15rem] border border-[var(--cart-border-soft)] bg-[#fcf7f2] px-3.5 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cart-muted)]">
                      Options
                    </p>
                    <p className="mt-1.5 text-sm text-[var(--cart-ink)]">
                      {compactOptionSummary}
                    </p>
                  </div>
                )}

                {!!item.options?.length && isEditEditorOpen && (
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

                {itemNote && (
                  <div className="mt-3 rounded-[1.15rem] border border-[var(--cart-border-soft)] bg-white/85 px-3.5 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cart-muted)]">
                      Note
                    </p>
                    <p className="mt-1.5 text-sm text-[var(--cart-ink)] break-words whitespace-pre-line">
                      {itemNote}
                    </p>
                  </div>
                )}

                <div className="mt-3.5 grid gap-2 rounded-[1.15rem] border border-[var(--cart-border-soft)] bg-[#fbf6f0] px-3.5 py-3 text-sm min-[1180px]:hidden sm:mt-4 sm:rounded-[1.25rem] sm:px-4">
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

                <div className="mt-3.5 min-[1180px]:hidden">
                  <QuantityControl
                    quantity={currentQuantity}
                    disabled={isPending}
                    fullWidth
                    onUpdateQuantity={onUpdateQuantity}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden text-center min-[1180px]:block">
          {originalLineTotal > finalLineTotal && (
            <p className="text-sm text-[#aa8f80] line-through">
              {formatCurrency(originalLineTotal)}
            </p>
          )}
          <p className="mt-1 text-base text-[var(--cart-ink)]">
            {formatCurrency(item.productCartPrice)}
          </p>
        </div>

        <div className="hidden min-[1180px]:mt-0 min-[1180px]:flex min-[1180px]:justify-center">
          <QuantityControl
            quantity={currentQuantity}
            disabled={isPending}
            onUpdateQuantity={onUpdateQuantity}
          />
        </div>

        <div className="hidden text-center min-[1180px]:block">
          {originalLineTotal > finalLineTotal && (
            <p className="text-sm text-[#aa8f80] line-through">
              {formatCurrency(originalLineTotal)}
            </p>
          )}
          <p className="mt-1 text-lg font-semibold text-[var(--cart-accent)]">
            {formatCurrency(finalLineTotal)}
          </p>
        </div>

        <div className="mt-4 flex flex-col items-end gap-2.5 sm:flex-row sm:items-center sm:justify-end min-[1180px]:mt-0 min-[1180px]:flex-wrap min-[1180px]:justify-end">
          {canEdit && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (isEditEditorOpen) {
                  resetEditDraft();
                  setIsEditEditorOpen(false);
                  return;
                }

                resetEditDraft();
                setIsEditEditorOpen(true);
              }}
              className={`inline-flex w-auto min-w-28 items-center justify-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all disabled:cursor-not-allowed disabled:text-[#b7a59a] ${
                isEditEditorOpen
                  ? "border-[#ebc7b5] bg-[#fff3ea] text-[var(--cart-accent)]"
                  : "border-[var(--cart-border)] bg-white/88 text-[var(--cart-muted)] hover:border-[#d7b7a4] hover:text-[var(--cart-accent)]"
              }`}
            >
              <PencilLine className="h-4 w-4" />
              {isEditEditorOpen ? "Close edit" : "Edit"}
            </button>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={onRemove}
            className="inline-flex w-auto min-w-28 items-center justify-center gap-2 rounded-full border border-[var(--cart-border)] bg-white/88 px-3.5 py-2 text-sm text-[var(--cart-muted)] transition-all hover:border-[#e0beb0] hover:text-[var(--cart-accent)] disabled:cursor-not-allowed disabled:text-[#b7a59a]"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
      {isEditEditorOpen && editConfig && (
        <div className="mt-4 min-w-0 min-[1180px]:col-start-2 min-[1180px]:col-end-7 lg:mt-5">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const wasSaved = await onSaveEdit(selectedEditOptions);
              if (wasSaved !== false) {
                setIsEditEditorOpen(false);
              }
            }}
            className="rounded-[1.25rem] border border-[var(--cart-border)] bg-[linear-gradient(180deg,#fffdf9_0%,#fbf4ed_100%)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:rounded-[1.5rem] sm:p-4"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[var(--cart-ink)]">
                  Edit this item
                </p>
                <p className="mt-1 text-xs text-[var(--cart-muted)]">
                  Update the toppings directly in your cart.
                </p>
              </div>

              {!!editConfig.toppingOptions.length && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--cart-muted)]">
                    Toppings
                  </p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {editConfig.toppingOptions.map((topping) => {
                      const selectedSizeProductFranchiseId =
                        selectedEditToppings[String(topping.productId)] || "";
                      const isSelected = !!selectedSizeProductFranchiseId;
                      const defaultSizeProductFranchiseId = String(
                        topping.sizes[0]?.productFranchiseId || "",
                      );
                      const selectedSize = topping.sizes.find(
                        (size) =>
                          String(size.productFranchiseId) ===
                          String(selectedSizeProductFranchiseId),
                      );

                      return (
                        <div
                          key={topping.productId}
                          className={`rounded-[1.15rem] border p-3 transition-all ${
                            isSelected
                              ? "border-[#e2b79d] bg-[#fff6ef]"
                              : "border-[var(--cart-border-soft)] bg-white/85"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[0.95rem] border border-[var(--cart-border)] bg-white">
                              <img
                                src={topping.imageUrl || coffeeCupIcon}
                                alt={topping.name}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  const target = event.target as HTMLImageElement;
                                  target.src = coffeeCupIcon;
                                  target.style.objectFit = "contain";
                                  target.style.padding = "8px";
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-[var(--cart-ink)]">
                                    {topping.name}
                                  </p>
                                  <p className="mt-1 text-xs text-[var(--cart-muted)]">
                                    {isSelected && selectedSize
                                      ? `Selected: ${selectedSize.label} - ${formatCurrency(selectedSize.price)}`
                                      : "Not selected"}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => {
                                    setSelectedEditToppings((current) => {
                                      const next = { ...current };

                                      if (next[String(topping.productId)]) {
                                        delete next[String(topping.productId)];
                                      } else if (defaultSizeProductFranchiseId) {
                                        next[String(topping.productId)] =
                                          defaultSizeProductFranchiseId;
                                      }

                                      return next;
                                    });
                                  }}
                                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                    isSelected
                                      ? "border-[#ebc8b6] bg-[#fff4eb] text-[var(--cart-accent)]"
                                      : "border-[var(--cart-border)] bg-white text-[var(--cart-ink)] hover:border-[#d7b7a4]"
                                  }`}
                                >
                                  {isSelected ? "Remove" : "Add"}
                                </button>
                              </div>

                              {isSelected && topping.sizes.length > 1 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {topping.sizes.map((size) => {
                                    const sizeSelected =
                                      String(size.productFranchiseId) ===
                                      String(selectedSizeProductFranchiseId);

                                    return (
                                      <button
                                        key={size.productFranchiseId}
                                        type="button"
                                        disabled={isPending}
                                        onClick={() =>
                                          setSelectedEditToppings((current) => ({
                                            ...current,
                                            [String(topping.productId)]: String(
                                              size.productFranchiseId,
                                            ),
                                          }))
                                        }
                                        className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                                          sizeSelected
                                            ? "border-[#dfb29a] bg-[#fff1e7] text-[var(--cart-accent)]"
                                            : "border-[var(--cart-border)] bg-white text-[var(--cart-ink)] hover:border-[#d7b7a4]"
                                        }`}
                                      >
                                        {size.label} - {formatCurrency(size.price)}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    resetEditDraft();
                    setIsEditEditorOpen(false);
                  }}
                  className="rounded-full border-[var(--cart-border)] bg-white/80 text-[var(--cart-ink)] hover:bg-white"
                >
                  Close
                </Button>

                <Button
                  type="submit"
                  disabled={isPending || !hasEditChanges}
                  className="rounded-full bg-[linear-gradient(135deg,var(--cart-accent)_0%,var(--cart-accent-deep)_100%)] text-white shadow-[0_14px_28px_rgba(183,104,67,0.22)] hover:opacity-95"
                >
                  {isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};

export default CartItem;