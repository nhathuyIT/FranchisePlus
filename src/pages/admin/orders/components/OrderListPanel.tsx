import { ArrowRight, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FranchiseOrderListItem } from "../models/order-management.type";
import {
  formatCurrency,
  formatDateTime,
  ORDER_STATUS_META,
} from "../utils/order-management.utils";

interface OrderListPanelProps {
  orders: FranchiseOrderListItem[];
  selectedOrderId: string | null;
  isLoading: boolean;
  error: Error | null;
  emptyMessage: string;
  onRetry: () => void;
  onSelectOrder: (orderId: string) => void;
  onOpenOrderPage: (orderId: string) => void;
}

export function OrderListPanel({
  orders,
  selectedOrderId,
  isLoading,
  error,
  emptyMessage,
  onRetry,
  onSelectOrder,
  onOpenOrderPage,
}: OrderListPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`order-skeleton-${index}`}
            className="h-32 animate-pulse rounded-2xl border border-[#E8DFD6] bg-white"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#F5C6CB] bg-[#FFF5F5] px-5 py-6 text-sm text-[#9B2C2C]">
        <p className="font-semibold">Failed to load order list.</p>
        <p className="mt-2">{error.message}</p>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-4 border-[#E8DFD6] text-[#6D4C41]"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-6 text-center text-[#8D6E63]">
        <PackageSearch className="h-10 w-10 text-[#BCA08A]" />
        <p className="mt-4 text-lg font-semibold text-[#5D4037]">No orders found</p>
        <p className="mt-2 max-w-sm text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const statusMeta = ORDER_STATUS_META[order.status];
        const isSelected = order.id === selectedOrderId;

        return (
          <article
            key={order.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
              isSelected
                ? "border-[#C8B7A7] bg-[#FFF8F1]"
                : "border-[#E8DFD6] hover:bg-[#FCFBF9]"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectOrder(order.id)}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                    Order Code
                  </p>
                  <h3 className="mt-1 truncate text-lg font-semibold text-[#3E2723]">
                    {order.code}
                  </h3>
                </div>

                <Badge variant="outline" className={statusMeta.badgeClassName}>
                  {statusMeta.label}
                </Badge>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                    Customer
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#3E2723]">
                    {order.customerName || "Walk-in customer"}
                  </p>
                  <p className="text-sm text-[#6D4C41]">{order.phone || "-"}</p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                    Final Amount
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#A65A00]">
                    {formatCurrency(order.finalAmount)}
                  </p>
                  <p className="text-sm text-[#6D4C41]">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>
            </button>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F0E7DE] pt-4">
              <span className="text-xs text-[#8D6E63]">
                Subtotal {formatCurrency(order.subtotalAmount)}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenOrderPage(order.id)}
                className="border-[#D9CBBF] text-[#6D4C41] hover:bg-[#FFF8F1]"
              >
                Open Detail
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

