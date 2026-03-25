import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import cashPaymentIcon from "@/assets/icons/cash-payment.svg";
import qrPaymentIcon from "@/assets/icons/qr-payment.svg";
import secureLockIcon from "@/assets/icons/secure-lock.svg";
import { ROUTER_URL } from "@/router/route.const";
import type { ShippingInfo } from "@/types/payment";
import { useGetOrderByCartId } from "@/hooks/client/useOrder.hook";
import { useQueryClient } from "@tanstack/react-query";
import { paymentKeys } from "@/hooks/payment";
import PaymentLayout from "./components/PaymentLayout";

type PaymentNewLocationState = {
  cartId?: string;
  orderId?: string;
  amount?: number;
  itemCount?: number;
  shippingInfo?: ShippingInfo;
};

type PaymentSuccessLocationState = {
  method: "COD" | "QR";
  amount: number;
  itemCount: number;
  orderId?: string;
  cartId?: string;
};

const getMyOrderPath = () => {
  return `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;
};

const getClientPath = (path: string) => {
  return `${ROUTER_URL.CLIENT}/${path}`;
};

type PaymentMethod = "COD" | "QR";

const PaymentNewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const state = (location.state || {}) as PaymentNewLocationState;

  const cartId = state.cartId?.trim() || "";
  const orderIdFromState = state.orderId?.trim() || "";
  
  const { data: orderFromCart } = useGetOrderByCartId(cartId);
  const orderId = orderIdFromState || orderFromCart?.rawId || "";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const hasValidContext = useMemo(() => {
    const hasOrderReference = !!(orderId || cartId);
    const hasAmount = typeof state.amount === "number" && state.amount > 0;
    const hasItemCount =
      typeof state.itemCount === "number" && state.itemCount > 0;

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
    return <div className="min-h-screen bg-gray-50" />;
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

    if (paymentMethod === "COD") {
      const successState: PaymentSuccessLocationState = {
        method: "COD",
        amount,
        itemCount,
        orderId,
        cartId,
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
        amount,
        itemCount,
        shippingInfo,
      },
    });
  };

  return (
    <PaymentLayout
      title="Payment Method"
      subtitle="Choose COD or QR as your payment option"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-[#5B4037] mb-4">
              Select payment option
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  paymentMethod === "COD"
                    ? "border-[#B8860B] bg-amber-50"
                    : "border-gray-200 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={cashPaymentIcon} alt="COD" className="w-10 h-10" />
                  <div>
                    <p className="text-sm font-semibold text-[#5B4037]">COD</p>
                    <p className="text-xs text-gray-600">Pay when receiving</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("QR")}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  paymentMethod === "QR"
                    ? "border-[#B8860B] bg-amber-50"
                    : "border-gray-200 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={qrPaymentIcon} alt="QR" className="w-10 h-10" />
                  <div>
                    <p className="text-sm font-semibold text-[#5B4037]">QR</p>
                    <p className="text-xs text-gray-600">Scan QR to pay online</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-[#5B4037]">Order summary</p>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
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
                <span className="font-medium">Phone:</span>{" "}
                {shippingInfo?.phone || "N/A"}
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
              onClick={handleContinuePayment}
              className="w-full rounded-lg bg-[#B8860B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Continue payment
            </button>

            <button
              type="button"
              onClick={handleBackToOrders}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Back to my orders
            </button>
          </section>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-600">
            <img src={secureLockIcon} alt="Secure" className="h-4 w-4" />
            <span>QR page only appears when QR method is selected.</span>
          </div>
        </div>
      </div>
    </PaymentLayout>
  );
};

export default PaymentNewPage;
