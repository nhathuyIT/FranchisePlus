import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CartResponse, CheckoutCartRequest } from "@/types/cart";
import { getCartStatusClassName } from "../utils/cartDisplay";

interface AdminCartCheckoutFormProps {
  cart: CartResponse;
  values: CheckoutCartRequest;
  errors: Partial<Record<"address" | "phone", string>>;
  onChange: (field: keyof CheckoutCartRequest, value: string) => void;
}

export const AdminCartCheckoutForm = ({
  cart,
  values,
  errors,
  onChange,
}: AdminCartCheckoutFormProps) => (
  <section className="rounded-[28px] border border-[#E8DFD6] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)] p-6 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7B67]">
          Checkout Info
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#3E2723]">
          Delivery and contact details
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[#7D6658]">
          Review the cart one more time, confirm the receiving information, and
          finish checkout from the admin flow.
        </p>
      </div>

      <Badge
        variant="outline"
        className={getCartStatusClassName(cart.status)}
      >
        {cart.status}
      </Badge>
    </div>

    <div className="mt-5 grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl border border-[#EADACD] bg-white/80 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-[#9A7B67]">
          Customer
        </p>
        <p className="mt-1 font-semibold text-[#3E2723]">
          {cart.customerName || "Unknown customer"}
        </p>
      </div>
      <div className="rounded-2xl border border-[#EADACD] bg-white/80 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-[#9A7B67]">
          Franchise
        </p>
        <p className="mt-1 font-semibold text-[#3E2723]">
          {cart.franchiseName || "N/A"}
        </p>
      </div>
      <div className="rounded-2xl border border-[#EADACD] bg-white/80 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-[#9A7B67]">
          Staff
        </p>
        <p className="mt-1 font-semibold text-[#3E2723]">
          {cart.staffName || "N/A"}
        </p>
      </div>
    </div>

    <div className="mt-6 grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="admin-cart-checkout-phone" className="text-[#5D4037]">
          Phone number
        </Label>
        <Input
          id="admin-cart-checkout-phone"
          value={values.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          placeholder="Enter receiver phone number"
          className="h-11 rounded-2xl border-[#DCCBBB] bg-white/90 text-[#3E2723] placeholder:text-[#A08A7B]"
          aria-invalid={!!errors.phone}
        />
        {errors.phone ? (
          <p className="text-sm text-[#B42318]">{errors.phone}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="admin-cart-checkout-address" className="text-[#5D4037]">
          Delivery address
        </Label>
        <Input
          id="admin-cart-checkout-address"
          value={values.address}
          onChange={(event) => onChange("address", event.target.value)}
          placeholder="Enter delivery address"
          className="h-11 rounded-2xl border-[#DCCBBB] bg-white/90 text-[#3E2723] placeholder:text-[#A08A7B]"
          aria-invalid={!!errors.address}
        />
        {errors.address ? (
          <p className="text-sm text-[#B42318]">{errors.address}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="admin-cart-checkout-message" className="text-[#5D4037]">
          Checkout message
        </Label>
        <Textarea
          id="admin-cart-checkout-message"
          value={values.message ?? ""}
          onChange={(event) => onChange("message", event.target.value)}
          placeholder="Optional note for delivery or customer handoff"
          className="min-h-28 rounded-3xl border-[#DCCBBB] bg-white/90 text-[#3E2723] placeholder:text-[#A08A7B]"
        />
        <p className="text-xs text-[#8D6E63]">
          This content is stored in the cart checkout message field.
        </p>
      </div>
    </div>
  </section>
);
