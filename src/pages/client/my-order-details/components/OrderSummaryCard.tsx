import { ReceiptText, Sparkles, Tag, Wallet } from "lucide-react";
import type { OrderDetail } from "@/pages/admin/orders/models/order-management.type";
import { formatCurrency, getOrderDiscountTotal } from "../order-detail.utils";

interface OrderSummaryCardProps {
  order: OrderDetail;
}

const SUMMARY_ICONS = [ReceiptText, Tag, Sparkles, Wallet] as const;

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const savings = getOrderDiscountTotal(order);
  const summaryItems = [
    {
      label: "Subtotal",
      value: formatCurrency(order.subtotalAmount),
      tone: "text-[#3E2723]",
    },
    {
      label: "Promotion discount",
      value: formatCurrency(order.promotionDiscount),
      tone: "text-[#A65A00]",
    },
    {
      label: "Voucher + loyalty",
      value: formatCurrency(order.voucherDiscount + order.loyaltyDiscount),
      tone: "text-[#A65A00]",
    },
    {
      label: "Final amount",
      value: formatCurrency(order.finalAmount),
      tone: "text-[#6D4C41]",
    },
  ];

  return (
    <section className="rounded-3xl border border-[#E9DED3] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.35)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7B67]">
          Amount Summary
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#3E2723]">
          Payment breakdown
        </h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {summaryItems.map((item, index) => {
          const Icon = SUMMARY_ICONS[index];

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#EEE2D7] bg-[#FFFCF9] p-4"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7B67]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6ECE1] text-[#A05A2C]">
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </div>
              <p className={`mt-3 text-lg font-semibold ${item.tone}`}>
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-[#F0E1CF] bg-[#FFF7EE] p-4">
        <div className="flex items-center justify-between gap-3 text-sm text-[#6D4C41]">
          <span>Total savings</span>
          <span className="font-semibold text-[#A65A00]">
            {formatCurrency(savings)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#ECD9C4] pt-3 text-sm text-[#6D4C41]">
          <span>Amount to pay</span>
          <span className="text-base font-semibold text-[#3E2723]">
            {formatCurrency(order.finalAmount)}
          </span>
        </div>
      </div>
    </section>
  );
}
