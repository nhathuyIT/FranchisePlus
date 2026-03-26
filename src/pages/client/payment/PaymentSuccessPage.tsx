import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTER_URL } from "@/router/route.const";
import { paymentKeys } from "@/hooks/payment";
import { useLoadingStore } from "@/stores/loading.store";
import { useGetOrderByCartId, useGetOrderById } from "@/hooks/client/useOrder.hook";

type PaymentSuccessLocationState = {
  method?: "COD" | "QR";
  amount?: number;
  itemCount?: number;
  orderId?: string;
  orderCode?: string;
  cartId?: string;
  showPaymentLoading?: boolean;
};

type MyOrdersLocationState = {
  showMyOrdersLoading?: boolean;
};

const getClientPath = (path: string) => `${ROUTER_URL.CLIENT}/${path}`;
const getMyOrderPath = () =>
  `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as PaymentSuccessLocationState;
  const queryClient = useQueryClient();
  const setLoading = useLoadingStore((loadingState) => loadingState.setLoading);
  const normalizedCartId = state.cartId?.trim() || "";
  const normalizedOrderId = state.orderId?.trim() || "";
  const orderIdForQuery = normalizedOrderId && !normalizedCartId ? normalizedOrderId : undefined;
  const orderCodeFromState = state.orderCode?.trim() || "";

  const { data: orderFromCart } = useGetOrderByCartId(normalizedCartId);
  const { data: orderFromId } = useGetOrderById(orderIdForQuery);
  const resolvedOrderCode =
    orderCodeFromState || orderFromCart?.code || orderFromId?.code || "";

  useEffect(() => {
    if (!state.showPaymentLoading) return;
    const timeoutId = window.setTimeout(() => setLoading(false), 800);
    return () => {
      setLoading(false);
      window.clearTimeout(timeoutId);
    };
  }, [setLoading, state.showPaymentLoading]);

  const hasValidContext = useMemo(
    () =>
      (state.method === "COD" || state.method === "QR") &&
      typeof state.amount === "number" &&
      state.amount > 0 &&
      typeof state.itemCount === "number" &&
      state.itemCount > 0,
    [state.amount, state.itemCount, state.method],
  );

  if (!hasValidContext) {
    toast.error("Missing payment confirmation context", {
      description: "Please restart payment flow from checkout.",
    });
    navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.CART), { replace: true });
    return <div className="min-h-screen" />;
  }

  const handleGoToMyOrders = async () => {
    setLoading(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["client-my-orders"] }),
      queryClient.invalidateQueries({ queryKey: paymentKeys.all }),
    ]);
    const myOrdersState: MyOrdersLocationState = { showMyOrdersLoading: true };
    navigate(getMyOrderPath(), { state: myOrdersState });
  };

  const methodLabel = state.method === "COD" ? "Cash on Delivery" : "QR Payment";
  // const methodIcon = state.method === "COD" ? "💵" : "📱";

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0FDF4] to-[#ECFDF5]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-emerald-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={handleGoToMyOrders}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#8D6E63] transition-colors hover:bg-[#F5EDE0] hover:text-[#5B4037]"
          >
            <ArrowLeft className="h-4 w-4" />
            My Orders
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">Payment Verified</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Success Hero */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-[0_0_0_12px_rgba(52,211,153,0.15)]">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="font-coffee text-3xl font-bold italic text-[#3E2723]">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm text-[#8D6E63]">
            Your order has been confirmed and is now being processed.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_18px_40px_-32px_rgba(52,211,153,0.3)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Payment Receipt
          </p>

          <div className="space-y-3">
            {/* Method */}
            <div className="flex items-center justify-between rounded-2xl bg-[#F0FDF4] px-4 py-3">
              <span className="text-sm text-[#6D4C41]">Payment Method</span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-[#3E2723]">
                {/* <span>{methodIcon}</span> */}
                {methodLabel}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between rounded-2xl bg-[#F0FDF4] px-4 py-3">
              <span className="text-sm text-[#6D4C41]">Amount Paid</span>
              <span className="text-lg font-bold text-emerald-600">
                {Number(state.amount || 0).toLocaleString("vi-VN")}₫
              </span>
            </div>

            {/* Items */}
            <div className="flex items-center justify-between rounded-2xl bg-[#F0FDF4] px-4 py-3">
              <span className="text-sm text-[#6D4C41]">Items</span>
              <span className="text-sm font-bold text-[#3E2723]">{state.itemCount}</span>
            </div>

            {/* Order Code */}
            {resolvedOrderCode && (
              <div className="rounded-2xl bg-[#F0FDF4] px-4 py-3">
                <p className="text-xs text-[#9A7B67]">Order Code</p>
                <p className="mt-0.5 font-mono text-xs font-semibold text-[#5B4037] break-all">
                  {resolvedOrderCode}
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-dashed border-emerald-100" />

          {state.method === "COD" && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">COD Reminder</p>
              <p className="mt-1 text-xs leading-5">
                Please prepare the exact amount of{" "}
                <strong>{Number(state.amount || 0).toLocaleString("vi-VN")}₫</strong> when
                receiving your order. Our delivery team will collect payment on arrival.
              </p>
            </div>
          )}
          {state.method === "QR" && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <p className="font-semibold">Payment Confirmed</p>
              <p className="mt-1 text-xs leading-5">
                Your QR payment has been verified and recorded. You'll receive updates as
                your order progresses.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={() => { void handleGoToMyOrders(); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C97B3D] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B5692F] hover:shadow-md"
          >
            <ShoppingBag className="h-4 w-4" />
            Track My Order
          </button>

          <button
            type="button"
            onClick={() => navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.CART))}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#E8DFD6] bg-white px-4 py-3 text-sm font-semibold text-[#6D4C41] transition-all hover:border-[#D9C1AE] hover:text-[#3E2723]"
          >
            <Package className="h-4 w-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
