import { AlertCircle, CreditCard, ReceiptText, XCircle, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminPayment } from "@/types/admin-payment.type";
import { InfoPair } from "./InfoPair";
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethod,
  getPaymentStatusMeta,
} from "../order-detail.utils";

interface OrderPaymentCardProps {
  payment?: AdminPayment | null;
  isLoading?: boolean;
  errorMessage?: string;
  canPayNow?: boolean;
  canCancelPayment?: boolean;
  canRequestRefund?: boolean;
  isCancelLoading?: boolean;
  onPayNow: () => void;
  onCancelPayment?: () => void;
  onRequestRefund?: () => void;
}

export function OrderPaymentCard({
  payment,
  isLoading = false,
  errorMessage,
  canPayNow = false,
  canCancelPayment = false,
  canRequestRefund = false,
  isCancelLoading = false,
  onPayNow,
  onCancelPayment,
  onRequestRefund,
}: OrderPaymentCardProps) {
  const paymentStatusMeta = getPaymentStatusMeta(payment);

  return (
    <section className="rounded-3xl border border-[#E9DED3] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.35)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7B67]">
            Payment
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#3E2723]">
            Transaction snapshot
          </h2>
        </div>

        {paymentStatusMeta ? (
          <Badge variant="outline" className={paymentStatusMeta.badgeClassName}>
            {paymentStatusMeta.label}
          </Badge>
        ) : null}
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`payment-skeleton-${index}`}
              className="h-20 animate-pulse rounded-2xl border border-[#EEE2D7] bg-[#FCFAF7]"
            />
          ))}
        </div>
      ) : errorMessage ? (
        <div className="mt-5 rounded-2xl border border-[#F5C6CB] bg-[#FFF5F5] p-4 text-sm text-[#9B2C2C]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Payment data could not be loaded.</p>
              <p className="mt-1 leading-6">{errorMessage}</p>
            </div>
          </div>
        </div>
      ) : payment ? (
        <div className="mt-5 grid gap-3">
          <InfoPair
            label="Payment code"
            value={payment.code}
            icon={ReceiptText}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoPair
              label="Method"
              value={formatPaymentMethod(payment.method)}
              icon={CreditCard}
            />
            <InfoPair
              label="Amount"
              value={formatCurrency(payment.amount)}
              helperText={`Status: ${payment.status}`}
            />
            <InfoPair label="Paid at" value={formatDateTime(payment.paidAt)} />

            {payment.refundedAt ? (
              <InfoPair
                label="Refunded at"
                value={formatDateTime(payment.refundedAt)}
              />
            ) : null}
            {payment.refundReason ? (
              <InfoPair
                label="Refund reason"
                value={payment.refundReason}
                className={payment.refundedAt ? "" : "sm:col-span-2"}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-[#E1D5CB] bg-[#FCFAF7] p-4 text-sm leading-6 text-[#8D6E63]">
          Payment data has not been attached to this order yet. If this order is
          still open, you can continue payment below.
        </div>
      )}

      {/* Pay Now CTA */}
      {canPayNow ? (
        <div className="mt-5 rounded-2xl border border-[#F0E1CF] bg-[#FFF7EE] p-4">
          <p className="text-sm leading-6 text-[#6D4C41]">
            This order is still eligible for payment. Continue to the payment
            screen to complete checkout.
          </p>
          <Button
            type="button"
            onClick={onPayNow}
            className="mt-4 w-full bg-[#C97B3D] text-white hover:bg-[#B5692F]"
          >
            <CreditCard className="h-4 w-4" />
            Continue payment
          </Button>
        </div>
      ) : null}

      {/* Refund Payment (PENDING) */}
      {canCancelPayment && onCancelPayment ? (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <p className="text-sm font-semibold leading-5 text-rose-700">Refund pending payment</p>
          <p className="mt-1 text-xs leading-5 text-rose-600">
            This will <strong>refund the payment only</strong>. Your order will remain active
            — contact support if you also need the order cancelled.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onCancelPayment}
            disabled={isCancelLoading}
            className="mt-3 w-full border-rose-300 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
          >
            <XCircle className="h-4 w-4" />
            {isCancelLoading ? "Processing..." : "Refund Payment"}
          </Button>
        </div>
      ) : null}

      {/* Request Refund (PAID) */}
      {canRequestRefund && onRequestRefund ? (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-semibold leading-5 text-amber-800">Request a payment refund</p>
          <p className="mt-1 text-xs leading-5 text-amber-700">
            This will <strong>refund your payment only</strong>. The order status will NOT be
            cancelled — contact support if you need the order cancelled.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onRequestRefund}
            disabled={isCancelLoading}
            className="mt-3 w-full border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <Undo2 className="h-4 w-4" />
            {isCancelLoading ? "Processing..." : "Request Refund"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
