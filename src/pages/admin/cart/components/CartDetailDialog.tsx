import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartDetailQuery } from "@/hooks/cart/useCart.hook";
import { CartDetailContent } from "./CartDetailContent";

interface CartDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartId: string | null;
}

export const CartDetailDialog = ({
  open,
  onOpenChange,
  cartId,
}: CartDetailDialogProps) => {
  const cartDetailQuery = useCartDetailQuery(cartId ?? "", open && !!cartId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <NormalLoadingLayout forceShow={open && cartDetailQuery.isLoading} />

      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden p-0 sm:max-w-[1100px]">
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-b border-[#E8DFD6] px-6 py-5">
            <DialogTitle className="text-[#3E2723]">Cart Detail</DialogTitle>
            <DialogDescription className="text-[#8D6E63]">
              Read-only detail view for the selected cart.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {cartDetailQuery.isLoading ? (
              <div className="flex min-h-[240px] items-center justify-center text-[#8D6E63]">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading cart detail...
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
            ) : (
              <CartDetailContent
                selectedCart={cartDetailQuery.data ?? null}
                emptyMessage="No cart selected."
              />
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
