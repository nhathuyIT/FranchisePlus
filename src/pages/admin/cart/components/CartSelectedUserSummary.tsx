import type { CartLookupUser } from "../types";
import { CartDetailField } from "./CartDetailField";

interface CartSelectedUserSummaryProps {
  selectedUser: CartLookupUser;
  cartCount: number;
}

export const CartSelectedUserSummary = ({
  selectedUser,
  cartCount,
}: CartSelectedUserSummaryProps) => (
  <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <CartDetailField label="Selected User" value={selectedUser.name} />
    <CartDetailField label="Email" value={selectedUser.email} />
    <CartDetailField label="Phone" value={selectedUser.phone || "N/A"} />
    <CartDetailField label="Cart Count" value={`${cartCount} cart(s)`} />
  </div>
);
