import type { CartResponse } from "@/types/cart";
import type { CartLookupUser } from "../types";
import { CartActionButtons } from "./CartActionButtons";
import { CartDetailContent } from "./CartDetailContent";

interface SelectedCartPanelProps {
  selectedUser: CartLookupUser | null;
  selectedCart: CartResponse | null;
  onViewDetail?: () => void;
  onEditCart?: () => void;
  canEditCart?: boolean;
}

export const SelectedCartPanel = ({
  selectedUser,
  selectedCart,
  onViewDetail,
  onEditCart,
  canEditCart = false,
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
        selectedCart && onViewDetail ? (
          <CartActionButtons
            onViewDetail={onViewDetail}
            onEditCart={onEditCart}
            canEditCart={canEditCart}
          />
        ) : undefined
      }
    />
  );
};
