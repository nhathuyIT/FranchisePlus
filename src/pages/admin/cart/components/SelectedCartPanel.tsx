import type { CartResponse } from "@/types/cart";
import type { CartLookupUser } from "../types";
import { CartActionButtons } from "./CartActionButtons";
import { CartDetailContent } from "./CartDetailContent";

interface SelectedCartPanelProps {
  selectedUser: CartLookupUser | null;
  selectedCart: CartResponse | null;
  onEditCart?: () => void;
  onCheckoutCart?: () => void;
  onCancelCart?: () => void;
  canEditCart?: boolean;
  canCheckoutCart?: boolean;
  canCancelCart?: boolean;
  isCancellingCart?: boolean;
}

export const SelectedCartPanel = ({
  selectedUser,
  selectedCart,
  onEditCart,
  onCheckoutCart,
  onCancelCart,
  canEditCart = false,
  canCheckoutCart = false,
  canCancelCart = false,
  isCancellingCart = false,
}: SelectedCartPanelProps) => {
  const emptyMessage = !selectedUser
    ? "Select a user to inspect cart details."
    : !selectedCart
      ? "This user doesnt have any cart"
      : null;

  return (
    <CartDetailContent
      selectedCart={selectedCart}
      emptyMessage={emptyMessage}
      actions={
        selectedCart ? (
          <CartActionButtons
            onEditCart={onEditCart}
            onCheckoutCart={onCheckoutCart}
            onCancelCart={onCancelCart}
            canEditCart={canEditCart}
            canCheckoutCart={canCheckoutCart}
            canCancelCart={canCancelCart}
            isCancellingCart={isCancellingCart}
          />
        ) : undefined
      }
    />
  );
};
