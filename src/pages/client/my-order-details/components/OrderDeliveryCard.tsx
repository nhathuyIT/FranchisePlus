import { Mail, MapPin, MessageSquareText, Phone, Store } from "lucide-react";
import type { OrderDetail } from "@/pages/admin/orders/models/order-management.type";
import { InfoPair } from "./InfoPair";

interface OrderDeliveryCardProps {
  order: OrderDetail;
}

export function OrderDeliveryCard({ order }: OrderDeliveryCardProps) {
  return (
    <section className="rounded-3xl border border-[#E9DED3] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.35)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7B67]">
          Delivery & Contact
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#3E2723]">
          Where this order should arrive
        </h2>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoPair
            label="Franchise"
            value={order.franchiseName || "Updating"}
            icon={Store}
          />

          <InfoPair
            label="Phone"
            value={order.customerPhone || order.phone || "Updating"}
            icon={Phone}
          />
          <InfoPair
            label="Email"
            value={order.customerEmail || "Updating"}
            icon={Mail}
          />
        </div>

        <InfoPair
          label="Address"
          value={
            order.address ||
            "No address was stored. This order may be pickup-oriented."
          }
          icon={MapPin}
        />

        {order.message ? (
          <InfoPair
            label="Customer note"
            value={order.message}
            icon={MessageSquareText}
          />
        ) : null}
      </div>
    </section>
  );
}
