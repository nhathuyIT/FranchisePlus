import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import secureLockIcon from "@/assets/icons/secure-lock.svg";
import qrPaymentIcon from "@/assets/icons/qr-payment.svg";
import { ROUTER_URL } from "@/router/route.const";
import type { ShippingInfo } from "@/types/payment";
import { useConfirmPaymentMutation, usePaymentByOrderId } from "@/hooks/payment";
import { useGetOrderByCartId } from "@/hooks/client/useOrder.hook";
import PaymentLayout from "./components/PaymentLayout";
import { usePaymentStatusPoller } from "./hooks/usePaymentStatusPoller";

type QRPageLocationState = {
  cartId?: string;
  orderId?: string;
  paymentId?: string;
  shippingInfo?: ShippingInfo;
  amount?: number;
  itemCount?: number;
};

type PaymentSuccessLocationState = {
  method: "COD" | "QR";
  amount: number;
  itemCount: number;
  orderId?: string;
  cartId?: string;
};

type QrDisplayStatus = "CHECKING" | "PAID" | "EXPIRED";

const STATUS_CHECK_TIMEOUT_SECONDS = 120;
const MOCK_AUTO_PAID_AFTER_SECONDS = 5;
const SUCCESS_REDIRECT_DELAY_MS = 900;

const getClientPath = (path: string) => {
  return `${ROUTER_URL.CLIENT}/${path}`;
};

const getMyOrderPath = () => {
  return `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;
};

const toDataUrl = (value: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="#fff7e6"/><rect x="16" y="16" width="64" height="64" fill="#2c1a0a"/><rect x="176" y="16" width="64" height="64" fill="#2c1a0a"/><rect x="16" y="176" width="64" height="64" fill="#2c1a0a"/><g fill="#5b4037"><rect x="96" y="28" width="12" height="12"/><rect x="112" y="28" width="12" height="12"/><rect x="128" y="28" width="12" height="12"/><rect x="96" y="44" width="12" height="12"/><rect x="128" y="44" width="12" height="12"/><rect x="96" y="60" width="12" height="12"/><rect x="112" y="60" width="12" height="12"/><rect x="128" y="60" width="12" height="12"/><rect x="96" y="96" width="12" height="12"/><rect x="112" y="96" width="12" height="12"/><rect x="144" y="96" width="12" height="12"/><rect x="176" y="96" width="12" height="12"/><rect x="192" y="96" width="12" height="12"/><rect x="208" y="96" width="12" height="12"/><rect x="96" y="112" width="12" height="12"/><rect x="128" y="112" width="12" height="12"/><rect x="160" y="112" width="12" height="12"/><rect x="192" y="112" width="12" height="12"/><rect x="224" y="112" width="12" height="12"/><rect x="96" y="128" width="12" height="12"/><rect x="112" y="128" width="12" height="12"/><rect x="144" y="128" width="12" height="12"/><rect x="176" y="128" width="12" height="12"/><rect x="208" y="128" width="12" height="12"/><rect x="224" y="128" width="12" height="12"/><rect x="96" y="144" width="12" height="12"/><rect x="128" y="144" width="12" height="12"/><rect x="160" y="144" width="12" height="12"/><rect x="176" y="144" width="12" height="12"/><rect x="192" y="144" width="12" height="12"/><rect x="224" y="144" width="12" height="12"/><rect x="96" y="160" width="12" height="12"/><rect x="112" y="160" width="12" height="12"/><rect x="128" y="160" width="12" height="12"/><rect x="144" y="160" width="12" height="12"/><rect x="160" y="160" width="12" height="12"/><rect x="176" y="160" width="12" height="12"/><rect x="208" y="160" width="12" height="12"/><rect x="224" y="160" width="12" height="12"/><rect x="96" y="176" width="12" height="12"/><rect x="112" y="176" width="12" height="12"/><rect x="144" y="176" width="12" height="12"/><rect x="160" y="176" width="12" height="12"/><rect x="192" y="176" width="12" height="12"/><rect x="224" y="176" width="12" height="12"/><rect x="96" y="192" width="12" height="12"/><rect x="128" y="192" width="12" height="12"/><rect x="160" y="192" width="12" height="12"/><rect x="176" y="192" width="12" height="12"/><rect x="208" y="192" width="12" height="12"/><rect x="224" y="192" width="12" height="12"/><rect x="96" y="208" width="12" height="12"/><rect x="112" y="208" width="12" height="12"/><rect x="128" y="208" width="12" height="12"/><rect x="160" y="208" width="12" height="12"/><rect x="192" y="208" width="12" height="12"/><rect x="208" y="208" width="12" height="12"/><rect x="224" y="208" width="12" height="12"/></g><text x="128" y="246" text-anchor="middle" font-family="Arial" font-size="10" fill="#5b4037">${value}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const formatCountdown = (seconds: number) => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mm}:${ss}`;
};

const getStatusMeta = (status: QrDisplayStatus) => {
  if (status === "PAID") {
    return {
      label: "PAID",
      badgeClass: "border-emerald-300 bg-emerald-50 text-emerald-700",
      description: "Payment received. Redirecting to confirmation page...",
    };
  }

  if (status === "EXPIRED") {
    return {
      label: "EXPIRED",
      badgeClass: "border-rose-300 bg-rose-50 text-rose-700",
      description: "Status check timeout reached. Please regenerate QR to retry.",
    };
  }

  return {
    label: "CHECKING",
    badgeClass: "border-amber-300 bg-amber-50 text-amber-700",
    description: "System is checking payment status every second.",
  };
};

const QRTransactionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as QRPageLocationState;
  const cartId = state.cartId?.trim() || "";
  const orderIdFromState = state.orderId?.trim() || "";
  const paymentIdFromState = state.paymentId?.trim() || "";
  
  const { data: orderFromCart, isLoading: isLoadingOrder } = useGetOrderByCartId(cartId);
  const orderId = orderIdFromState || orderFromCart?.rawId || "";
  
  const amount = state.amount ?? 0;
  const itemCount = state.itemCount ?? 0;
  const shippingInfo = state.shippingInfo;

  const { mutateAsync: confirmPayment } = useConfirmPaymentMutation();
  const { data: paymentByOrder, isFetched: isPaymentByOrderFetched, isLoading: isLoadingPayment } =
    usePaymentByOrderId(orderId, !paymentIdFromState && !!orderId);

  const hasValidContext = useMemo(() => {
    const hasOrderReference = !!(orderId || cartId);
    const hasAmount = typeof state.amount === "number" && state.amount > 0;
    const hasItemCount =
      typeof state.itemCount === "number" && state.itemCount > 0;

    return hasOrderReference || (hasAmount && hasItemCount);
  }, [cartId, orderId, state.amount, state.itemCount]);

  const canCreateTransaction = useMemo(() => {
    return amount > 0 && itemCount > 0 && Boolean(orderId || cartId);
  }, [amount, itemCount, orderId, cartId]);

  const { status, elapsedSeconds, isPolling, lastUpdatedAt, retry } =
    usePaymentStatusPoller({
      enabled: canCreateTransaction,
      autoPaidAfterSeconds: MOCK_AUTO_PAID_AFTER_SECONDS,
    });

  const hasShownPaidToast = useRef(false);
  const hasShownExpiredToast = useRef(false);
  const hasNavigatedSuccess = useRef(false);
  const hasProcessedPaidStatus = useRef(false);

  const transactionCode = useMemo(() => {
    const baseRef = orderId || cartId || "GUEST";
    const tail = String(Date.now()).slice(-6);
    return `MOCK-${baseRef}-${tail}`;
  }, [cartId, orderId]);

  const qrDataUrl = useMemo(() => toDataUrl(transactionCode), [transactionCode]);

  const remainingSeconds = Math.max(
    0,
    STATUS_CHECK_TIMEOUT_SECONDS - elapsedSeconds,
  );

  const displayStatus = useMemo<QrDisplayStatus>(() => {
    if (status === "PAID") {
      return "PAID";
    }

    if (elapsedSeconds >= STATUS_CHECK_TIMEOUT_SECONDS) {
      return "EXPIRED";
    }

    return "CHECKING";
  }, [elapsedSeconds, status]);

  const statusMeta = getStatusMeta(displayStatus);
  const resolvedPaymentId = paymentIdFromState || paymentByOrder?.id || "";
  const isPaymentAlreadyPaid = paymentByOrder?.status === "PAID";
  
  const shouldWaitContext =
    displayStatus === "PAID" &&
    !paymentIdFromState &&
    (isLoadingOrder || isLoadingPayment || (!!orderId && !isPaymentByOrderFetched));

  useEffect(() => {
    if (displayStatus !== "PAID" || hasShownPaidToast.current || shouldWaitContext) {
      return;
    }

    if (hasProcessedPaidStatus.current) {
      return;
    }

    hasProcessedPaidStatus.current = true;

    const processPaidStatus = async () => {
      if (resolvedPaymentId && !isPaymentAlreadyPaid) {
        try {
          await confirmPayment({
            paymentId: resolvedPaymentId,
            data: {
              method: "QR",
              providerTxnId: transactionCode,
            },
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

      if (hasNavigatedSuccess.current) {
        return;
      }

      hasNavigatedSuccess.current = true;
      const successState: PaymentSuccessLocationState = {
        method: "QR",
        amount,
        itemCount,
        orderId,
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
    orderId,
    resolvedPaymentId,
    shouldWaitContext,
    transactionCode,
  ]);

  useEffect(() => {
    if (displayStatus !== "EXPIRED" || hasShownExpiredToast.current) {
      return;
    }

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
    return <div className="min-h-screen bg-gray-50" />;
  }

  const handleRetryMock = () => {
    hasNavigatedSuccess.current = false;
    hasShownExpiredToast.current = false;
    hasShownPaidToast.current = false;
    hasProcessedPaidStatus.current = false;
    retry();

    toast.info("Regenerated QR checking session.", {
      description: "System resumed payment status polling.",
    });
  };

  const handleCopyPayload = async () => {
    const payload = JSON.stringify(
      {
        transactionCode,
        orderId,
        cartId,
        amount,
        itemCount,
        status: displayStatus,
      },
      null,
      2,
    );

    try {
      await navigator.clipboard.writeText(payload);
      toast.success("Copied QR payload.");
    } catch {
      toast.error("Unable to copy QR payload.");
    }
  };

  return (
    <PaymentLayout
      title="QR Payment Mock"
      subtitle="Real-time QR payment simulation with automatic status checking"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={qrPaymentIcon} alt="QR Payment" className="h-10 w-10" />
                <p className="text-sm font-semibold text-[#5B4037]">QR transaction</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}
              >
                {statusMeta.label}
              </span>
            </div>

            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-800">{statusMeta.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-amber-200 bg-[#FFF9ED] p-5">
                <p className="text-sm font-semibold text-[#5B4037]">Scan to pay</p>
                <p className="mt-1 text-xs text-gray-600">
                  Payment QR is mocked while waiting backend integration.
                </p>

                <div className="mt-4 flex justify-center">
                  <img
                    src={qrDataUrl}
                    alt="Mock QR code"
                    className="h-56 w-56 rounded-xl border border-amber-200 bg-white p-3"
                  />
                </div>

                <div className="mt-4 rounded-lg border border-amber-200 bg-white p-3 text-sm">
                  <p>
                    <span className="font-medium text-gray-700">Transaction:</span>{" "}
                    <span className="font-semibold text-[#5B4037]">{transactionCode}</span>
                  </p>
                  <p className="mt-1">
                    <span className="font-medium text-gray-700">Amount:</span>{" "}
                    <span className="font-semibold text-[#B8860B]">
                      {amount.toLocaleString("vi-VN")} VND
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-semibold text-[#5B4037]">Payment monitor</p>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Time left:</span>{" "}
                    <span className="font-semibold text-[#B8860B]">
                      {formatCountdown(remainingSeconds)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Polling:</span>{" "}
                    {displayStatus === "CHECKING" && isPolling ? "Active" : "Stopped"}
                  </p>
                  <p>
                    <span className="font-medium">Elapsed:</span> {elapsedSeconds}s
                  </p>
                  <p>
                    <span className="font-medium">Last update:</span>{" "}
                    {lastUpdatedAt.toLocaleTimeString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Items:</span> {itemCount}
              </p>
              <p>
                <span className="font-medium">Order ID:</span> {orderId || "N/A"}
              </p>
              <p>
                <span className="font-medium">Cart ID:</span> {cartId || "N/A"}
              </p>
              <p>
                <span className="font-medium">Receiver:</span>{" "}
                {shippingInfo?.fullName || "N/A"}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {shippingInfo?.phone || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {shippingInfo?.address || "N/A"}
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
            <button
              type="button"
              onClick={handleCopyPayload}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Copy QR payload
            </button>

            <button
              type="button"
              onClick={handleRetryMock}
              disabled={displayStatus !== "EXPIRED"}
              className="w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition-colors enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Regenerate QR and check again
            </button>

            <button
              type="button"
              onClick={() => navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.PAYMENT_NEW))}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Back to payment method
            </button>

            <button
              type="button"
              onClick={() => navigate(getMyOrderPath())}
              className="w-full rounded-lg bg-[#B8860B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Go to My Orders
            </button>
          </section>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-600">
            <img src={secureLockIcon} alt="Secure" className="h-4 w-4" />
            <span>
              QR session auto-checks every second and redirects when PAID is detected.
            </span>
          </div>
        </div>
      </div>
    </PaymentLayout>
  );
};

export default QRTransactionPage;
