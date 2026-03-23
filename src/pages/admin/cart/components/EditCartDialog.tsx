import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCartDetailQuery,
  useDeleteCartItemMutation,
  useRemoveCartOptionItemMutation,
  useUpdateCartItemMutation,
  useUpdateCartMutation,
  useUpdateCartOptionItemMutation,
} from "@/hooks/cart/useCart.hook";
import { useGetMenuByFranchise } from "@/hooks/product/useMenu.hook";
import { getSizeLabel } from "@/pages/client/menu/lib/helpers";
import type { UpdateCartRequest } from "@/types/cart";
import { EditCartCartForm } from "./EditCartCartForm";
import { EditCartItemCard } from "./EditCartItemCard";

interface EditCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartId: string | null;
}

const buildOptionKey = (cartItemId: string, productFranchiseId: string) =>
  `${cartItemId}:${productFranchiseId}`;

export const EditCartDialog = ({
  open,
  onOpenChange,
  cartId,
}: EditCartDialogProps) => {
  const cartDetailQuery = useCartDetailQuery(cartId ?? "", open && !!cartId);
  const cart = cartDetailQuery.data ?? null;

  const updateCartMutation = useUpdateCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const deleteCartItemMutation = useDeleteCartItemMutation();
  const updateOptionMutation = useUpdateCartOptionItemMutation();
  const removeOptionMutation = useRemoveCartOptionItemMutation();

  const [isSavingCartInfo, setIsSavingCartInfo] = useState(false);
  const [pendingItemIds, setPendingItemIds] = useState<string[]>([]);
  const [pendingOptionKeys, setPendingOptionKeys] = useState<string[]>([]);

  const { data: menuData = [] } = useGetMenuByFranchise(cart?.franchiseId ?? "");

  const sizeLabelByProductFranchiseId = useMemo(() => {
    const sizeMap = new Map<string, string>();

    menuData.forEach((category) => {
      category.products.forEach((product) => {
        product.sizes.forEach((size) => {
          sizeMap.set(String(size.productFranchiseId), getSizeLabel(size.size));
        });
      });
    });

    return sizeMap;
  }, [menuData]);

  const setItemPendingState = (cartItemId: string, pending: boolean) => {
    setPendingItemIds((current) => {
      if (pending) {
        return current.includes(cartItemId)
          ? current
          : [...current, cartItemId];
      }

      return current.filter((id) => id !== cartItemId);
    });
  };

  const setOptionPendingState = (
    cartItemId: string,
    optionProductFranchiseId: string,
    pending: boolean,
  ) => {
    const optionKey = buildOptionKey(cartItemId, optionProductFranchiseId);

    setPendingOptionKeys((current) => {
      if (pending) {
        return current.includes(optionKey) ? current : [...current, optionKey];
      }

      return current.filter((key) => key !== optionKey);
    });
  };

  const isItemPending = (cartItemId: string) =>
    pendingItemIds.includes(cartItemId);

  const isOptionPending = (
    cartItemId: string,
    optionProductFranchiseId: string,
  ) =>
    pendingOptionKeys.includes(
      buildOptionKey(cartItemId, optionProductFranchiseId),
    );

  const resolveSizeLabel = (productFranchiseId: string) =>
    sizeLabelByProductFranchiseId.get(String(productFranchiseId));

  const handleSaveCartInfo = async (data: UpdateCartRequest) => {
    if (!cartId || isSavingCartInfo) return false;

    setIsSavingCartInfo(true);

    try {
      await updateCartMutation.mutateAsync({
        cartId,
        data,
      });
      return true;
    } catch {
      return false;
    } finally {
      setIsSavingCartInfo(false);
    }
  };

  const handleCommitItemQuantity = async (
    cartItemId: string,
    quantity: number,
  ) => {
    if (isItemPending(cartItemId)) return false;

    setItemPendingState(cartItemId, true);

    try {
      await updateCartItemMutation.mutateAsync({
        cartItemId,
        quantity,
      });
      return true;
    } catch {
      return false;
    } finally {
      setItemPendingState(cartItemId, false);
    }
  };

  const handleSaveItemNote = async (
    cartItemId: string,
    note: string,
    quantity: number,
  ) => {
    if (isItemPending(cartItemId)) return false;

    setItemPendingState(cartItemId, true);

    try {
      await updateCartItemMutation.mutateAsync({
        cartItemId,
        quantity,
        note: note.trim(),
      });
      return true;
    } catch {
      return false;
    } finally {
      setItemPendingState(cartItemId, false);
    }
  };

  const handleDeleteItem = async (cartItemId: string) => {
    if (isItemPending(cartItemId)) return false;

    setItemPendingState(cartItemId, true);

    try {
      await deleteCartItemMutation.mutateAsync(cartItemId);
      return true;
    } catch {
      return false;
    } finally {
      setItemPendingState(cartItemId, false);
    }
  };

  const handleCommitOptionQuantity = async (
    cartItemId: string,
    optionProductFranchiseId: string,
    quantity: number,
  ) => {
    if (isOptionPending(cartItemId, optionProductFranchiseId)) return false;

    setOptionPendingState(cartItemId, optionProductFranchiseId, true);

    try {
      await updateOptionMutation.mutateAsync({
        cartItemId,
        optionProductFranchiseId,
        quantity,
      });
      return true;
    } catch {
      return false;
    } finally {
      setOptionPendingState(cartItemId, optionProductFranchiseId, false);
    }
  };

  const handleRemoveOption = async (
    cartItemId: string,
    optionProductFranchiseId: string,
  ) => {
    if (isOptionPending(cartItemId, optionProductFranchiseId)) return false;

    setOptionPendingState(cartItemId, optionProductFranchiseId, true);

    try {
      await removeOptionMutation.mutateAsync({
        cartItemId,
        optionProductFranchiseId,
      });
      return true;
    } catch {
      return false;
    } finally {
      setOptionPendingState(cartItemId, optionProductFranchiseId, false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden p-0 sm:max-w-[1280px]">
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-b border-[#E8DFD6] px-6 py-5">
            <DialogTitle className="text-[#3E2723]">Edit Cart</DialogTitle>
            <DialogDescription className="text-[#8D6E63]">
              Update cart info, item quantities, notes, and existing option rows.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {cartDetailQuery.isLoading ? (
              <div className="flex min-h-[280px] items-center justify-center text-[#8D6E63]">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading editable cart...
              </div>
            ) : cartDetailQuery.error instanceof Error ? (
              <div className="rounded-2xl border border-[#F5C6CB] bg-[#FFF5F5] px-4 py-5 text-sm text-[#9B2C2C]">
                <p className="font-semibold">Failed to load cart detail.</p>
                <p className="mt-1">{cartDetailQuery.error.message}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void cartDetailQuery.refetch();
                  }}
                  className="mt-4 border-[#E8DFD6] text-[#6D4C41]"
                >
                  Try again
                </Button>
              </div>
            ) : !cart ? (
              <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-6 text-sm text-[#8D6E63]">
                No cart selected for editing.
              </div>
            ) : (
              <div className="space-y-5">
                <EditCartCartForm
                  cart={cart}
                  isSaving={isSavingCartInfo}
                  onSave={handleSaveCartInfo}
                />

                <section className="rounded-2xl border border-[#E8DFD6] bg-[#FFFDFC] p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#3E2723]">
                        Cart Items
                      </p>
                      <p className="mt-1 text-sm text-[#8D6E63]">
                        Quantity buttons use debounced sync. Manual input saves on blur or Enter.
                      </p>
                    </div>

                    <div className="rounded-full bg-[#FAF1E8] px-3 py-1.5 text-sm text-[#6D4C41]">
                      {cart.cartItems.length} item(s)
                    </div>
                  </div>

                  {cart.cartItems.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {cart.cartItems.map((item) => (
                        <EditCartItemCard
                          key={item.cartItemId}
                          item={item}
                          sizeLabel={resolveSizeLabel(item.productFranchiseId)}
                          isPending={isItemPending(item.cartItemId)}
                          resolveSizeLabel={resolveSizeLabel}
                          isOptionPending={(optionProductFranchiseId) =>
                            isOptionPending(
                              item.cartItemId,
                              optionProductFranchiseId,
                            )
                          }
                          onCommitQuantity={(quantity) =>
                            handleCommitItemQuantity(item.cartItemId, quantity)
                          }
                          onDelete={() => handleDeleteItem(item.cartItemId)}
                          onSaveNote={(note, quantity) =>
                            handleSaveItemNote(
                              item.cartItemId,
                              note,
                              quantity,
                            )
                          }
                          onCommitOptionQuantity={(
                            optionProductFranchiseId,
                            quantity,
                          ) =>
                            handleCommitOptionQuantity(
                              item.cartItemId,
                              optionProductFranchiseId,
                              quantity,
                            )
                          }
                          onRemoveOption={(optionProductFranchiseId) =>
                            handleRemoveOption(
                              item.cartItemId,
                              optionProductFranchiseId,
                            )
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-[#D7CCC8] bg-white px-4 py-6 text-sm text-[#8D6E63]">
                      This cart does not contain any items yet.
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-[#E8DFD6] px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#E8DFD6] text-[#6D4C41]"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
