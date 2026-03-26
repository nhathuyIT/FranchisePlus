import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ClipboardCopy, RefreshCw, ShoppingBag, ShieldCheck, Clock, Wifi } from "lucide-react";
import { ROUTER_URL } from "@/router/route.const";
import type { ShippingInfo } from "@/types/payment";
import { useConfirmPaymentMutation, usePaymentByOrderId } from "@/hooks/payment";
import { useGetOrderByCartId } from "@/hooks/client/useOrder.hook";
import { useLoadingStore } from "@/stores/loading.store";
import { useQueryClient } from "@tanstack/react-query";
import { usePaymentStatusPoller } from "./hooks/usePaymentStatusPoller";
import QRDisplay from "./components/QRDisplay";

type QRPageLocationState = {
  cartId?: string;
  orderId?: string;
  orderCode?: string;
  paymentId?: string;
  shippingInfo?: ShippingInfo;
  amount?: number;
  itemCount?: number;
  showPaymentLoading?: boolean;
};

type PaymentSuccessLocationState = {
  method: "COD" | "QR";
  amount: number;
  itemCount: number;
  orderId?: string;
  orderCode?: string;
  cartId?: string;
};

type QrDisplayStatus = "CHECKING" | "PAID" | "EXPIRED";

const STATUS_CHECK_TIMEOUT_SECONDS = 120;
const MOCK_AUTO_PAID_AFTER_SECONDS = 5;
const SUCCESS_REDIRECT_DELAY_MS = 900;

const getClientPath = (path: string) => `${ROUTER_URL.CLIENT}/${path}`;
const getMyOrderPath = () =>
  `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;

const formatCountdown = (seconds: number) => {
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
};

const QRTransactionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const queryClient = useQueryClient();

  const handleBackToOrders = async () => {
    setLoading(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["client-my-orders"] }),
      queryClient.invalidateQueries({ queryKey: ["client-order-detail"] }),
    ]);
    navigate(getMyOrderPath());
  };

  const state = (location.state || {}) as QRPageLocationState;
  const cartId = state.cartId?.trim() || "";
  const orderIdFromState = state.orderId?.trim() || "";
  const orderCodeFromState = state.orderCode?.trim() || "";
  const paymentIdFromState = state.paymentId?.trim() || "";

  const { data: orderFromCart, isLoading: isLoadingOrder } = useGetOrderByCartId(cartId);
  const orderId = orderIdFromState || orderFromCart?.rawId || "";

  const amount = state.amount ?? 0;
  const itemCount = state.itemCount ?? 0;
  const shippingInfo = state.shippingInfo;

  const { mutateAsync: confirmPayment } = useConfirmPaymentMutation();
  const {
    data: paymentByOrder,
    isFetched: isPaymentByOrderFetched,
    isLoading: isLoadingPayment,
  } = usePaymentByOrderId(orderId, !paymentIdFromState && !!orderId);

  const hasValidContext = useMemo(() => {
    const hasOrderReference = !!(orderId || cartId);
    const hasAmount = typeof state.amount === "number" && state.amount > 0;
    const hasItemCount = typeof state.itemCount === "number" && state.itemCount > 0;
    return hasOrderReference || (hasAmount && hasItemCount);
  }, [cartId, orderId, state.amount, state.itemCount]);

  const canCreateTransaction = useMemo(
    () => amount > 0 && itemCount > 0 && Boolean(orderId || cartId),
    [amount, itemCount, orderId, cartId],
  );

  const { status, elapsedSeconds, isPolling, lastUpdatedAt, retry } =
    usePaymentStatusPoller({
      enabled: canCreateTransaction,
      autoPaidAfterSeconds: MOCK_AUTO_PAID_AFTER_SECONDS,
    });

  const hasShownPaidToast = useRef(false);
  const hasShownExpiredToast = useRef(false);
  const hasNavigatedSuccess = useRef(false);
  const hasProcessedPaidStatus = useRef(false);

  const [tail] = useState(() => String(Date.now()).slice(-6));

  const transactionCode = useMemo(() => {
    const baseRef = orderId || cartId || "GUEST";
    return `MOCK-${baseRef}-${tail}`;
  }, [cartId, orderId, tail]);

  const remainingSeconds = Math.max(0, STATUS_CHECK_TIMEOUT_SECONDS - elapsedSeconds);

  const displayStatus = useMemo<QrDisplayStatus>(() => {
    if (status === "PAID") return "PAID";
    if (elapsedSeconds >= STATUS_CHECK_TIMEOUT_SECONDS) return "EXPIRED";
    return "CHECKING";
  }, [elapsedSeconds, status]);

  const resolvedPaymentId = paymentIdFromState || paymentByOrder?.id || "";
  const isPaymentAlreadyPaid = paymentByOrder?.status === "PAID";
  const orderCodeFromPayment =
    typeof paymentByOrder?.orderId === "object" && paymentByOrder.orderId !== null
      ? paymentByOrder.orderId.code || ""
      : "";
  const orderCode = orderCodeFromState || orderFromCart?.code || orderCodeFromPayment;

  const shouldWaitContext =
    displayStatus === "PAID" &&
    !paymentIdFromState &&
    (isLoadingOrder || isLoadingPayment || (!!orderId && !isPaymentByOrderFetched));

  useEffect(() => {
    if (!state.showPaymentLoading) return;
    const timeoutId = window.setTimeout(() => setLoading(false), 800);
    return () => {
      setLoading(false);
      window.clearTimeout(timeoutId);
    };
  }, [setLoading, state.showPaymentLoading]);

  useEffect(() => {
    if (displayStatus !== "PAID" || hasShownPaidToast.current || shouldWaitContext) return;
    if (hasProcessedPaidStatus.current) return;

    hasProcessedPaidStatus.current = true;

    const processPaidStatus = async () => {
      if (resolvedPaymentId && !isPaymentAlreadyPaid) {
        try {
          await confirmPayment({
            paymentId: resolvedPaymentId,
            data: { method: "QR", providerTxnId: transactionCode },
          });
        } catch {
          toast.error("Payment reached PAID but backend update failed.", {
            description: "Please check your order payment status again in My Orders.",
          });
        }
      }

      if (!resolvedPaymentId) {
        toast.error("Cannot find payment record to update status.", {
          description: "Please retry from My Orders with a valid payment record.",
        });
      }

      hasShownPaidToast.current = true;
      toast.success("Payment status is PAID", {
        description: "Redirecting to success confirmation...",
      });

      if (hasNavigatedSuccess.current) return;
      hasNavigatedSuccess.current = true;

      const successState: PaymentSuccessLocationState = {
        method: "QR",
        amount,
        itemCount,
        orderId,
        orderCode,
        cartId,
      };

      setTimeout(() => {
        navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.PAYMENT_SUCCESS), {
          state: successState,
          replace: true,
        });
      }, SUCCESS_REDIRECT_DELAY_MS);
    };

    void processPaidStatus();
  }, [
    amount,
    cartId,
    confirmPayment,
    displayStatus,
    isPaymentAlreadyPaid,
    itemCount,
    navigate,
    orderCode,
    orderId,
    resolvedPaymentId,
    shouldWaitContext,
    transactionCode,
  ]);

  useEffect(() => {
    if (displayStatus !== "EXPIRED" || hasShownExpiredToast.current) return;
    hasShownExpiredToast.current = true;
    toast.error("QR status check expired", {
      description: "Please regenerate QR and continue payment.",
    });
  }, [displayStatus]);

  if (!hasValidContext) {
    toast.error("Missing payment context", {
      description: "Please return to checkout and try again.",
    });
    navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.CART), { replace: true });
    return <div className="min-h-screen" />;
  }

  const handleRetryMock = () => {
    hasNavigatedSuccess.current = false;
    hasShownExpiredToast.current = false;
    hasShownPaidToast.current = false;
    hasProcessedPaidStatus.current = false;
    retry();
    toast.info("QR session regenerated.", {
      description: "System resumed payment status polling.",
    });
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(transactionCode);
      toast.success("Transaction ID copied to clipboard.");
    } catch {
      toast.error("Unable to copy.");
    }
  };

  // Status config
  const statusConfig = {
    CHECKING: {
      label: "Awaiting Payment",
      dot: "bg-amber-400 animate-pulse",
      badge: "bg-amber-50 border-amber-200 text-amber-700",
      bar: "bg-amber-400",
      barWidth: `${(elapsedSeconds / STATUS_CHECK_TIMEOUT_SECONDS) * 100}%`,
    },
    PAID: {
      label: "Payment Received",
      dot: "bg-emerald-500",
      badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
      bar: "bg-emerald-400",
      barWidth: "100%",
    },
    EXPIRED: {
      label: "Session Expired",
      dot: "bg-rose-500",
      badge: "bg-rose-50 border-rose-200 text-rose-600",
      bar: "bg-rose-400",
      barWidth: "100%",
    },
  }[displayStatus];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FDF6EE] to-[#F5EDE0]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#E8DFD6] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={handleBackToOrders}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#8D6E63] transition-colors hover:bg-[#F5EDE0] hover:text-[#5B4037]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-[#8D6E63]">Secured Transaction</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="font-coffee text-2xl font-bold italic text-[#3E2723] md:text-3xl">
            QR Payment
          </h1>
          <p className="mt-1 text-sm text-[#8D6E63]">
            Scan the QR code below with your banking app to complete payment
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Left – QR + Status */}
          <div className="space-y-4 lg:col-span-3">
            {/* Status banner */}
            <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${statusConfig.badge}`}>
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${statusConfig.dot}`} />
                <span className="text-sm font-semibold">{statusConfig.label}</span>
              </div>
              {displayStatus === "CHECKING" && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <Wifi className="h-3.5 w-3.5" />
                  Polling active
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDE0D4]">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${statusConfig.bar}`}
                style={{ width: statusConfig.barWidth }}
              />
            </div>

            {/* QR Card */}
            <div className="rounded-3xl border border-[#E8DFD6] bg-white p-6 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.25)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7B67]">
                    Scan to Pay
                  </p>
                  <p className="mt-0.5 text-base font-bold text-[#3E2723]">
                    FranchisePlus QR
                  </p>
                </div>
                {displayStatus === "CHECKING" && (
                  <div className="flex items-center gap-1.5 rounded-full bg-[#FFF7EE] px-3 py-1.5 border border-[#EDE0D4]">
                    <Clock className="h-3.5 w-3.5 text-[#C97B3D]" />
                    <span className="font-mono text-sm font-bold text-[#C97B3D]">
                      {formatCountdown(remainingSeconds)}
                    </span>
                  </div>
                )}
                {displayStatus === "EXPIRED" && (
                  <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600">
                    Expired
                  </span>
                )}
                {displayStatus === "PAID" && (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-600">
                    ✓ Paid
                  </span>
                )}
              </div>

              <div className={`transition-opacity duration-300 ${displayStatus !== "CHECKING" ? "opacity-50" : ""}`}>
                <QRDisplay
                  amount={amount}
                  transactionCode={transactionCode}
                />
              </div>

              {displayStatus === "PAID" && (
                <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <p className="text-sm font-semibold text-emerald-700">
                    🎉 Payment confirmed! Redirecting...
                  </p>
                </div>
              )}
              {displayStatus === "EXPIRED" && (
                <div className="mt-5 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-center">
                  <p className="text-sm text-rose-600">
                    Session expired. Please regenerate the QR to try again.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right – Order Info + Actions */}
          <div className="space-y-4 lg:col-span-2">
            {/* Order Summary */}
            <div className="rounded-3xl border border-[#E8DFD6] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.15)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7B67]">
                Order Summary
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[#FAF6F0] px-4 py-3">
                  <span className="text-sm text-[#6D4C41]">Items</span>
                  <span className="text-sm font-bold text-[#3E2723]">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#FAF6F0] px-4 py-3">
                  <span className="text-sm text-[#6D4C41]">Total</span>
                  <span className="text-base font-bold text-[#C97B3D]">
                    {amount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                {shippingInfo?.fullName && (
                  <div className="flex items-center justify-between rounded-xl bg-[#FAF6F0] px-4 py-3">
                    <span className="text-sm text-[#6D4C41]">Receiver</span>
                    <span className="text-sm font-semibold text-[#3E2723] text-right max-w-[60%] truncate">
                      {shippingInfo.fullName}
                    </span>
                  </div>
                )}
                {orderCode && (
                  <div className="rounded-xl bg-[#FAF6F0] px-4 py-3">
                    <p className="text-xs text-[#9A7B67]">Order Code</p>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-[#5B4037] break-all">
                      {orderCode}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Monitor */}
            <div className="rounded-3xl border border-[#E8DFD6] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7B67] mb-3">
                Monitor
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8D6E63]">Polling</span>
                  <span className={`font-medium ${displayStatus === "CHECKING" && isPolling ? "text-emerald-600" : "text-[#BCAAA4]"}`}>
                    {displayStatus === "CHECKING" && isPolling ? "Active" : "Stopped"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8D6E63]">Elapsed</span>
                  <span className="font-mono font-medium text-[#5B4037]">{elapsedSeconds}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8D6E63]">Last update</span>
                  <span className="font-mono text-xs text-[#5B4037]">
                    {lastUpdatedAt.toLocaleTimeString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleCopyPayload}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#E8DFD6] bg-white px-4 py-3 text-sm font-semibold text-[#5B4037] transition-all hover:border-[#C97B3D] hover:text-[#C97B3D]"
              >
                <ClipboardCopy className="h-4 w-4" />
                Copy Transaction ID
              </button>

              <button
                type="button"
                onClick={handleRetryMock}
                disabled={displayStatus !== "EXPIRED"}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition-all enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate QR
              </button>

              <button
                type="button"
                onClick={handleBackToOrders}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C97B3D] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#B5692F] hover:shadow-md"
              >
                <ShoppingBag className="h-4 w-4" />
                Go to My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRTransactionPage;
