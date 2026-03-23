import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CartResponse } from "@/types/cart";
import {
  formatCartDateTime,
  formatCartMoney,
  formatVoucherValue,
  getCartStatusClassName,
} from "../utils/cartDisplay";
import { CartDetailField } from "./CartDetailField";
import { CartItemCard } from "./CartItemCard";

interface CartDetailContentProps {
  selectedCart: CartResponse | null;
  emptyMessage: string | null;
  actions?: React.ReactNode;
  className?: string;
}

export const CartDetailContent = ({
  selectedCart,
  emptyMessage,
  actions,
  className,
}: CartDetailContentProps) => {
  const promotionValue =
    selectedCart?.promotionType?.toUpperCase() === "PERCENT"
      ? `${selectedCart.promotionValue}%`
      : selectedCart?.promotionType
        ? formatCartMoney(selectedCart.promotionValue)
        : "N/A";
  const voucherValue = formatVoucherValue(
    selectedCart?.voucherType,
    selectedCart?.voucherValue,
  );

  return (
    <section
      className={cn(
        "shrink-0 rounded-2xl border border-[#E8DFD6] bg-[#FFFDFC] p-5 shadow-sm",
        className,
      )}
    >
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
              </div>
              <p className="mt-2 text-sm text-[#5D4037]">
                Updated at {formatCartDateTime(selectedCart.updatedAt)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-[#5D4037]">{emptyMessage}</p>
          )}
        </div>

        {actions}
      </div>

      {selectedCart ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
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
            <CartDetailField
              label="Voucher Code"
              value={selectedCart.voucherCode || "No voucher"}
            />
            <CartDetailField
              label="Voucher Value"
              value={voucherValue || "No voucher"}
            />
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
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
              label="Voucher Discount"
              value={formatCartMoney(selectedCart.voucherDiscount)}
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
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#3E2723]">Cart Items</p>
              <Badge
                variant="outline"
                className="border-[#D7CCC8] bg-white text-[#6D4C41]"
              >
                {selectedCart.cartItems.length} item(s)
              </Badge>
            </div>

            {selectedCart.cartItems.length > 0 ? (
              <div className="rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] p-4 sm:p-5">
                <div className="space-y-4">
                  {selectedCart.cartItems.map((item, index) => (
                    <CartItemCard
                      key={item.cartItemId}
                      item={item}
                      index={index + 1}
                    />
                  ))}
                </div>
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
