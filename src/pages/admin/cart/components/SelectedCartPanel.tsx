import { Badge } from "@/components/ui/badge";
import type { CartResponse } from "@/types/cart";
import type { CartLookupUser } from "../types";
import {
  formatCartDateTime,
  formatCartMoney,
  getCartStatusClassName,
} from "../utils/cartDisplay";
import { CartDetailField } from "./CartDetailField";
import { CartItemCard } from "./CartItemCard";

interface SelectedCartPanelProps {
  selectedUser: CartLookupUser | null;
  selectedCart: CartResponse | null;
}

export const SelectedCartPanel = ({
  selectedUser,
  selectedCart,
}: SelectedCartPanelProps) => {
  const promotionValue =
    selectedCart?.promotionType?.toUpperCase() === "PERCENT"
      ? `${selectedCart.promotionValue}%`
      : selectedCart?.promotionType
        ? formatCartMoney(selectedCart.promotionValue)
        : "N/A";

  const emptyMessage = !selectedUser
    ? "Select a user to inspect cart details."
    : !selectedCart
      ? "This user doesnt have any cart"
      : null;

  return (
    <section className="shrink-0 rounded-2xl border border-[#E8DFD6] bg-[#FFFDFC] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
            Cart Details
          </p>
          {selectedCart ? (
            <>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={getCartStatusClassName(selectedCart.status)}
                >
                  {selectedCart.status}
                </Badge>
                <span className="rounded-full bg-[#F7F1EB] px-3 py-1 text-xs font-medium text-[#8D6E63]">
                  Cart ID: {selectedCart.id}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#5D4037]">
                Updated at {formatCartDateTime(selectedCart.updatedAt)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-[#5D4037]">{emptyMessage}</p>
          )}
        </div>

        {selectedCart ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CartDetailField
              label="Items"
              value={`${selectedCart.cartItems.length} item(s)`}
            />
            <CartDetailField
              label="Subtotal Amount"
              value={formatCartMoney(selectedCart.subtotalAmount)}
            />
            <CartDetailField
              label="Promotion Type"
              value={selectedCart.promotionType || "No promotion"}
            />
            <CartDetailField
              label="Promotion Value"
              value={promotionValue || "No promotion"}
            />
          </div>
        ) : null}
      </div>

      {selectedCart ? (
        <>
          <div className="mt-5 grid gap-3 lg:grid-cols-3 xl:grid-cols-5">
            <CartDetailField
              label="Customer"
              value={selectedCart.customerName}
            />
            <CartDetailField
              label="Franchise"
              value={selectedCart.franchiseName}
            />
            <CartDetailField
              label="Phone"
              value={selectedCart.phone || "N/A"}
            />
            <CartDetailField
              label="Address"
              value={selectedCart.address || "N/A"}
            />
            <CartDetailField
              label="Final Amount"
              value={formatCartMoney(selectedCart.finalAmount)}
            />
          </div>

          {(selectedCart.note || selectedCart.message) && (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <CartDetailField
                label="Note"
                value={selectedCart.note || "No note"}
              />
              <CartDetailField
                label="Message"
                value={selectedCart.message || "No message"}
              />
            </div>
          )}

          <div className="mt-6">
            <div className="mb-3">
              <p className="text-sm font-semibold text-[#3E2723]">Cart Items</p>
            </div>

            {selectedCart.cartItems.length > 0 ? (
              <div className="space-y-3">
                {selectedCart.cartItems.map((item) => (
                  <CartItemCard key={item.cartItemId} item={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#D7CCC8] bg-white px-4 py-6 text-sm text-[#5D4037]">
                This cart has no items.
              </div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
};
