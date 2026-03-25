/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Boxes,
  ClipboardList,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOrderDetailPage } from "../hooks/use-order-detail-page";
import {
  formatCurrency,
  formatDateTime,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
} from "../utils/order-management.utils";
import { ConfirmPaymentDialog } from "./ConfirmPaymentDialog";
import { DeliveryBox } from "./DeliveryBox";
import { ReadyForPickupDialog } from "./ReadyForPickupDialog";

interface OrderDetailScreenProps {
  orderId?: string | null;
  variant?: "panel" | "page";
  onBack?: () => void;
  onOpenFullPage?: (orderId: string) => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[#3E2723]">{value || "-"}</p>
    </div>
  );
}

export function OrderDetailScreen({
  orderId,
  variant = "panel",
  onBack,
  onOpenFullPage,
}: OrderDetailScreenProps) {
  const {
    orderQuery,
    deliveryQuery,
    paymentQuery,
    order,
    delivery,
    deliveryError,
    deliveryEmptyMessage,
    payment,
    deliveryId,
    isMutating,
    deliveryActionMessage,
    canMoveToPreparing,
    canReadyForPickup,
    canPickupDelivery,
    canCompleteDelivery,
    canConfirmPayment,
    handleMoveToPreparing,
    handleReadyForPickup,
    handlePickupDelivery,
    handleCompleteDelivery,
    handleConfirmPayment,
    refetchAll,
  } = useOrderDetailPage(orderId);
  const [isReadyDialogOpen, setIsReadyDialogOpen] = useState(false);
  const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);

  useEffect(() => {
    setIsReadyDialogOpen(false);
    setIsConfirmPaymentOpen(false);
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-6 text-center text-[#8D6E63]">
        Select an order from the list to inspect delivery and payment details.
      </div>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`order-detail-skeleton-${index}`}
            className="h-32 animate-pulse rounded-2xl border border-[#E8DFD6] bg-white"
          />
        ))}
      </div>
    );
  }

  if (orderQuery.error instanceof Error) {
    return (
      <div className="rounded-2xl border border-[#F5C6CB] bg-[#FFF5F5] px-5 py-6 text-sm text-[#9B2C2C]">
        <p className="font-semibold">Failed to load order detail.</p>
        <p className="mt-2">{orderQuery.error.message}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void orderQuery.refetch();
          }}
          className="mt-4 border-[#E8DFD6] text-[#6D4C41]"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-6 text-center text-[#8D6E63]">
        This order is unavailable or no longer accessible in the current admin
        context.
      </div>
    );
  }

  const statusMeta = ORDER_STATUS_META[order.status];
  const paymentStatusMeta = payment
    ? PAYMENT_STATUS_META[payment.status]
    : null;
  const isRefreshing =
    orderQuery.isFetching ||
    deliveryQuery.isFetching ||
    paymentQuery.isFetching;

  return (
    <>
      <NormalLoadingLayout
        forceShow={isMutating || (isRefreshing && !orderQuery.isLoading)}
      />

      <div
        className={cn(
          "space-y-6 rounded-2xl border border-[#E8DFD6] bg-white p-5 shadow-lg",
          variant === "page" && "p-6",
        )}
      >
        <Card className="border-[#E8DFD6] bg-[#FFFDFC] shadow-sm">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                  Order Detail
                </p>
                <CardTitle className="mt-2 text-3xl text-[#3E2723]">
                  {order.code}
                </CardTitle>
                <CardDescription className="mt-2 text-sm text-[#6D4C41]">
                  Created {formatDateTime(order.createdAt)}
                  {order.franchiseName ? ` at ${order.franchiseName}` : ""}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={statusMeta.badgeClassName}>
                  {statusMeta.label}
                </Badge>

                {variant === "page" && onBack ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="border-[#D9CBBF] text-[#6D4C41] hover:bg-[#FFF8F1]"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : null}

                {variant === "panel" && onOpenFullPage ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenFullPage(order.id)}
                    className="border-[#D9CBBF] text-[#6D4C41] hover:bg-[#FFF8F1]"
                  >
                    Open Full Detail
                  </Button>
                ) : null}
              </div>
            </div>
          </CardHeader>
        </Card>

        <DeliveryBox
          status={order.status}
          deliveryId={deliveryId}
          assignedToName={delivery?.assignedToName || order.staffName}
          assignedToEmail={delivery?.assignedToEmail || order.staffEmail}
          assignedAt={delivery?.assignedAt}
          deliveryError={deliveryError}
          deliveryEmptyMessage={deliveryEmptyMessage}
          deliveryActionMessage={deliveryActionMessage}
          isMutating={isMutating}
          isRefreshing={isRefreshing}
          canMoveToPreparing={canMoveToPreparing}
          canReadyForPickup={canReadyForPickup}
          canPickupDelivery={canPickupDelivery}
          canCompleteDelivery={canCompleteDelivery}
          onRefresh={() => {
            void refetchAll();
          }}
          onMoveToPreparing={() => {
            void handleMoveToPreparing();
          }}
          onReadyForPickup={() => setIsReadyDialogOpen(true)}
          onPickupDelivery={() => {
            void handlePickupDelivery();
          }}
          onCompleteDelivery={() => {
            void handleCompleteDelivery();
          }}
        />

        <Card className="border-[#E8DFD6] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#3E2723]">
              <ClipboardList className="h-5 w-5 text-[#8D6E63]" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailRow label="Customer Name" value={order.customerName} />
            <DetailRow
              label="Phone"
              value={order.customerPhone || order.phone}
            />
            <DetailRow label="Email" value={order.customerEmail} />
            <DetailRow label="Address" value={order.address} />
            <DetailRow label="Message" value={order.message} />
          </CardContent>
        </Card>

        <Card className="border-[#E8DFD6] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#3E2723]">
              <Boxes className="h-5 w-5 text-[#8D6E63]" />
              Amount Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                Subtotal
              </p>
              <p className="mt-2 text-lg font-semibold text-[#3E2723]">
                {formatCurrency(order.subtotalAmount)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                Promotion Discount
              </p>
              <p className="mt-2 text-lg font-semibold text-[#A65A00]">
                {formatCurrency(order.promotionDiscount)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                Voucher + Loyalty
              </p>
              <p className="mt-2 text-lg font-semibold text-[#A65A00]">
                {formatCurrency(order.voucherDiscount + order.loyaltyDiscount)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#D9CBBF] bg-[#FFF8F1] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                Final Amount
              </p>
              <p className="mt-2 text-lg font-semibold text-[#6D4C41]">
                {formatCurrency(order.finalAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8DFD6] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3E2723]">Order Items</CardTitle>
            <CardDescription>
              Snapshot items stay read-only here. Each status update should
              happen outside the item list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <div
                  key={item.orderItemId}
                  className="rounded-2xl border border-[#E8DFD6] bg-[#FCFBF9] p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                        Item {index + 1}
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#3E2723]">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-sm text-[#6D4C41]">
                        Quantity {item.quantity} - Snapshot{" "}
                        {formatCurrency(item.priceSnapshot)}
                      </p>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                        Final Line Total
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#A65A00]">
                        {formatCurrency(item.finalLineTotal)}
                      </p>
                    </div>
                  </div>

                  {item.options.length > 0 ? (
                    <div className="mt-4 space-y-2 border-t border-[#E8DFD6] pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                        Options
                      </p>
                      {item.options.map((option, optionIndex) => (
                        <div
                          key={`${item.orderItemId}-option-${optionIndex}`}
                          className="flex flex-col gap-1 rounded-xl border border-[#E8DFD6] bg-white px-3 py-3 text-sm text-[#5D4037] sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span>{option.productName}</span>
                          <span>
                            x{option.quantity} -{" "}
                            {formatCurrency(option.finalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-[#8D6E63]">
                This order has no item snapshots.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#E8DFD6] shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-[#3E2723]">
                  <CreditCard className="h-5 w-5 text-[#8D6E63]" />
                  Payment
                </CardTitle>
                <CardDescription>
                  After confirming payment, the page refetches both payment and
                  order detail to keep UI state aligned.
                </CardDescription>
              </div>

              {paymentStatusMeta ? (
                <Badge
                  variant="outline"
                  className={paymentStatusMeta.badgeClassName}
                >
                  {paymentStatusMeta.label}
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentQuery.error instanceof Error ? (
              <Alert className="border-[#F5C6CB] bg-[#FFF5F5] text-[#9B2C2C]">
                <AlertCircle className="h-4 w-4 text-[#C2410C]" />
                <AlertTitle>Payment load failed</AlertTitle>
                <AlertDescription>
                  {paymentQuery.error.message}
                </AlertDescription>
              </Alert>
            ) : payment ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Payment Code" value={payment.code} />
                  <DetailRow label="Method" value={payment.method} />
                  <DetailRow
                    label="Amount"
                    value={formatCurrency(payment.amount)}
                  />
                  <DetailRow
                    label="Provider Txn ID"
                    value={payment.providerTxnId}
                  />
                  <DetailRow
                    label="Paid At"
                    value={formatDateTime(payment.paidAt)}
                  />
                  <DetailRow
                    label="Refund Reason"
                    value={payment.refundReason}
                  />
                </div>

                <div className="flex flex-wrap gap-3 border-t border-[#F0E7DE] pt-4">
                  <Button
                    type="button"
                    onClick={() => setIsConfirmPaymentOpen(true)}
                    disabled={!canConfirmPayment || isMutating}
                    className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                  >
                    Confirm Payment
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#8D6E63]">
                No payment record was found for this order yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ReadyForPickupDialog
        open={isReadyDialogOpen}
        onOpenChange={setIsReadyDialogOpen}
        franchiseId={order.franchiseId}
        isSubmitting={isMutating}
        onSubmit={handleReadyForPickup}
      />

      <ConfirmPaymentDialog
        open={isConfirmPaymentOpen}
        onOpenChange={setIsConfirmPaymentOpen}
        paymentCode={payment?.code}
        defaultMethod={payment?.method}
        defaultProviderTxnId={payment?.providerTxnId}
        isSubmitting={isMutating}
        onSubmit={handleConfirmPayment}
      />
    </>
  );
}
