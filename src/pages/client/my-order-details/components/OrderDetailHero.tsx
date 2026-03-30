import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Package2,
  RefreshCw,
  Sparkles,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderDetail } from "@/pages/admin/orders/models/order-management.type";
import type { AdminPayment } from "@/types/admin-payment.type";
import {
  ORDER_STATUS_META,
  formatCurrency,
  formatDateTime,
  formatStaffInfo,
  getOrderDiscountTotal,
  getOrderStatusNarrative,
  getPaymentStatusMeta,
} from "../order-detail.utils";

interface OrderDetailHeroProps {
  order: OrderDetail;
  payment?: AdminPayment | null;
  itemCount: number;
  isRefreshing?: boolean;
  canPayNow?: boolean;
  onBack: () => void;
  onRefresh: () => void;
  onPayNow: () => void;
}

export function OrderDetailHero({
  order,
  payment,
  itemCount,
  isRefreshing = false,
  canPayNow = false,
  onBack,
  onRefresh,
  onPayNow,
}: OrderDetailHeroProps) {
  const statusMeta = ORDER_STATUS_META[order.status];
  const paymentStatusMeta = getPaymentStatusMeta(payment);
  const discountTotal = getOrderDiscountTotal(order);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#E8DDD2] bg-[radial-gradient(circle_at_top_left,_rgba(255,248,239,0.98),_rgba(255,255,255,0.98)_46%),linear-gradient(135deg,#FFF5EA_0%,#FFFFFF_58%,#F9F1E8_100%)] p-6 shadow-[0_28px_90px_-48px_rgba(118,79,43,0.5)]">
      <div className="pointer-events-none absolute -left-10 top-0 h-44 w-44 rounded-full bg-[#F8E1CC]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-6 bottom-0 h-56 w-56 rounded-full bg-white/80 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusMeta.badgeClassName}>
              {statusMeta.label}
            </Badge>
            {paymentStatusMeta ? (
              <Badge
                variant="outline"
                className={paymentStatusMeta.badgeClassName}
              >
                Payment {paymentStatusMeta.label}
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-[#D8C2AF] bg-white/90 text-[#6D4C41] hover:bg-[#FFF8F1]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to orders
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-[#D8C2AF] bg-white/90 text-[#6D4C41] hover:bg-[#FFF8F1]"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
            {canPayNow ? (
              <Button
                type="button"
                onClick={onPayNow}
                className="bg-[#C97B3D] text-white shadow-sm hover:bg-[#B5692F]"
              >
                <CreditCard className="h-4 w-4" />
                Pay now
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#9A7B67]">
              Order Snapshot
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#2F241F] md:text-4xl">
              {order.code}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6D4C41] md:text-base">
              {getOrderStatusNarrative(order.status)}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/80 bg-white/75 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7B67]">
                  <Store className="h-4 w-4 text-[#C97B3D]" />
                  Franchise
                </div>
                <p className="mt-3 text-sm font-medium text-[#3E2723]">
                  {order.franchiseName || "Store is updating"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/75 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7B67]">
                  <CalendarDays className="h-4 w-4 text-[#C97B3D]" />
                  {order.staffName || order.staffEmail ? "Created by" : "Created"}
                </div>
                <p className="mt-3 text-sm font-medium text-[#3E2723]">
                  {order.staffName || order.staffEmail
                    ? formatStaffInfo(order.staffName, order.staffEmail)
                    : formatDateTime(order.createdAt)
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/75 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7B67]">
                  <Package2 className="h-4 w-4 text-[#C97B3D]" />
                  Items
                </div>
                <p className="mt-3 text-sm font-medium text-[#3E2723]">
                  {itemCount} items in this order
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-85 xl:grid-cols-1">
            <div className="rounded-2xl border border-[#F0DCC6] bg-[#FFF7EE] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A7B67]">
                Final Amount
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#6D4C41]">
                {formatCurrency(order.finalAmount)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#F3E4D4] bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A7B67]">
                Total Savings
              </p>
              <p className="mt-2 text-lg font-semibold text-[#A65A00]">
                {formatCurrency(discountTotal)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#F3E4D4] bg-white/90 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A7B67]">
                <Sparkles className="h-4 w-4 text-[#C97B3D]" />
                Payment signal
              </div>
              <p className="mt-2 text-sm font-medium text-[#3E2723]">
                {paymentStatusMeta
                  ? `Payment is currently ${paymentStatusMeta.label.toLowerCase()}.`
                  : "Payment data is syncing with this order."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
