import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { ROUTER_URL } from "@/router/route.const";
import type { ShippingInfo } from "@/types/payment";
import { useGetOrderByCartId } from "@/hooks/client/useOrder.hook";
import { useQueryClient } from "@tanstack/react-query";
import { paymentKeys } from "@/hooks/payment";
import { useLoadingStore } from "@/stores/loading.store";

type PaymentLocationState = {
  cartId?: string;
  orderId?: string;
  orderCode?: string;
  amount?: number;
  itemCount?: number;
  shippingInfo?: ShippingInfo;
};

type PaymentSuccessLocationState = {
  method: "COD" | "QR";
  amount: number;
  itemCount: number;
  orderId?: string;
  orderCode?: string;
  cartId?: string;
  showPaymentLoading?: boolean;
};

type PaymentMethod = "COD" | "QR";

const getMyOrderPath = () =>
  `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;

const getClientPath = (path: string) => `${ROUTER_URL.CLIENT}/${path}`;

const PAYMENT_OPTIONS: {
  method: PaymentMethod;
  icon: typeof Banknote;
  label: string;
  sublabel: string;
  description: string;
}[] = [
  {
    method: "COD",
    icon: Banknote,
    label: "Cash on Delivery",
    sublabel: "COD",
    description: "Pay with cash when your order arrives",
  },
  {
    method: "QR",
    icon: QrCode,
    label: "QR Payment",
    sublabel: "QR",
    description: "Scan & pay instantly via banking app",
  },
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const state = (location.state || {}) as PaymentLocationState;

  useEffect(() => {
    // If we're coming from another screen with loading on, ensure it's cleared eventually
    // But typically this page renders fast.
    return () => setLoading(false);
  }, [setLoading]);

  const cartId = state.cartId?.trim() || "";
  const orderIdFromState = state.orderId?.trim() || "";
  const orderCodeFromState = state.orderCode?.trim() || "";

  const { data: orderFromCart } = useGetOrderByCartId(cartId);
  const orderId = orderIdFromState || orderFromCart?.rawId || "";
  const orderCode = orderCodeFromState || orderFromCart?.code || "";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const hasValidContext = useMemo(() => {
    const hasOrderReference = !!(orderId || cartId);
    const hasAmount = typeof state.amount === "number" && state.amount > 0;
    const hasItemCount = typeof state.itemCount === "number" && state.itemCount > 0;
    return hasOrderReference || (hasAmount && hasItemCount);
  }, [cartId, orderId, state.amount, state.itemCount]);

  const amount = state.amount ?? 0;
  const itemCount = state.itemCount ?? 0;
  const shippingInfo = state.shippingInfo;

  if (!hasValidContext) {
    toast.error("Missing payment context", {
      description: "Please return to checkout and try again.",
    });
    navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.CART), { replace: true });
    return <div className="min-h-screen" />;
  }

  const handleBackToOrders = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["client-my-orders"] }),
      queryClient.invalidateQueries({ queryKey: paymentKeys.all }),
    ]);
    navigate(getMyOrderPath());
  };

  const handleContinuePayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method first.");
      return;
    }

    setLoading(true);

    if (paymentMethod === "COD") {
      const successState: PaymentSuccessLocationState = {
        method: "COD",
        amount,
        itemCount,
        orderId,
        orderCode,
        cartId,
        showPaymentLoading: true,
      };
      navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.PAYMENT_SUCCESS), {
        state: successState,
      });
      return;
    }

    navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.PAYMENT_QR), {
      state: {
        cartId,
        orderId,
        orderCode,
        amount,
        itemCount,
        shippingInfo,
        showPaymentLoading: true,
      },
    });
  };

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
            <span className="text-xs font-medium text-[#8D6E63]">Secured Checkout</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="font-coffee text-2xl font-bold italic text-[#3E2723] md:text-3xl">
            Choose Payment Method
          </h1>
          <p className="mt-1.5 text-sm text-[#8D6E63]">
            Select how you'd like to pay for your order
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left – Method Selection */}
          <div className="space-y-5 lg:col-span-3">
            <div className="rounded-3xl border border-[#E8DFD6] bg-white p-6 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.2)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#9A7B67]">
                Payment Options
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map(({ method, icon: Icon, label, sublabel, description }) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-[#C97B3D] bg-[#FFF7EE] shadow-md"
                          : "border-[#E8DFD6] bg-white hover:border-[#D9C1AE] hover:shadow-sm"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-[#C97B3D]" />
                      )}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isSelected ? "bg-[#C97B3D]" : "bg-[#F5EDE0]"
                      }`}>
                        <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-[#8D6E63]"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? "text-[#3E2723]" : "text-[#5B4037]"}`}>
                          {label}
                        </p>
                        <p className="mt-0.5 text-xs text-[#9A7B67]">{description}</p>
                      </div>
                      <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isSelected
                          ? "bg-[#C97B3D]/10 text-[#C97B3D]"
                          : "bg-[#F5EDE0] text-[#9A7B67]"
                      }`}>
                        {sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shipping info */}
            {(shippingInfo?.fullName || shippingInfo?.address) && (
              <div className="rounded-3xl border border-[#E8DFD6] bg-white p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9A7B67]">
                  Delivery To
                </p>
                <div className="space-y-2 text-sm text-[#5B4037]">
                  {shippingInfo.fullName && (
                    <p className="font-semibold">{shippingInfo.fullName}</p>
                  )}
                  {shippingInfo.phone && (
                    <p className="text-[#8D6E63]">{shippingInfo.phone}</p>
                  )}
                  {shippingInfo.address && (
                    <p className="text-[#8D6E63]">{shippingInfo.address}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right – Order Summary + Actions */}
          <div className="space-y-4 lg:col-span-2">
            {/* Summary */}
            <div className="rounded-3xl border border-[#E8DFD6] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.15)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#9A7B67]">
                Order Summary
              </p>
              <div className="space-y-2.5">
                {orderCode && (
                  <div className="flex justify-between rounded-xl bg-[#FAF6F0] px-4 py-3">
                    <span className="text-sm text-[#6D4C41]">Order Code</span>
                    <span className="max-w-[60%] break-all text-right font-mono text-xs font-semibold text-[#5B4037]">
                      {orderCode}
                    </span>
                  </div>
                )}
                <div className="flex justify-between rounded-xl bg-[#FAF6F0] px-4 py-3">
                  <span className="text-sm text-[#6D4C41]">Items</span>
                  <span className="text-sm font-bold text-[#3E2723]">{itemCount}</span>
                </div>
                <div className="flex justify-between rounded-xl bg-[#FAF6F0] px-4 py-3">
                  <span className="text-sm text-[#6D4C41]">Shipping</span>
                  <span className="text-sm font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between rounded-xl bg-[#FFF7EE] px-4 py-3 border border-[#EEE0D0]">
                  <span className="text-sm font-semibold text-[#5B4037]">Total</span>
                  <span className="text-base font-bold text-[#C97B3D]">
                    {amount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleContinuePayment}
                disabled={!paymentMethod}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C97B3D] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B5692F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="h-4 w-4" />
                {paymentMethod === "COD"
                  ? "Confirm Order (COD)"
                  : paymentMethod === "QR"
                  ? "Continue to QR Payment"
                  : "Select a method to continue"}
              </button>

              <button
                type="button"
                onClick={() => { void handleBackToOrders(); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#E8DFD6] bg-white px-4 py-3 text-sm font-semibold text-[#6D4C41] transition-all hover:border-[#D9C1AE] hover:text-[#3E2723]"
              >
                View My Orders
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E8DFD6] bg-white px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-[#9A7B67]">256-bit SSL encryption · PCI-DSS compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
