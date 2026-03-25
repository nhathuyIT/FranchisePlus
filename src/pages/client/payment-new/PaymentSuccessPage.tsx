import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import secureLockIcon from "@/assets/icons/secure-lock.svg";
import { ROUTER_URL } from "@/router/route.const";
import { paymentKeys } from "@/hooks/payment";
import PaymentLayout from "./components/PaymentLayout";

type PaymentSuccessLocationState = {
  method?: "COD" | "QR";
  amount?: number;
  itemCount?: number;
  orderId?: string;
  cartId?: string;
};

const getClientPath = (path: string) => {
  return `${ROUTER_URL.CLIENT}/${path}`;
};

const getMyOrderPath = () => {
  return `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;
};

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as PaymentSuccessLocationState;

  const queryClient = useQueryClient();

  const handleGoToMyOrders = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["client-my-orders"] }),
      queryClient.invalidateQueries({ queryKey: paymentKeys.all }),
    ]);
    navigate(getMyOrderPath());
  };

  const hasValidContext = useMemo(() => {
    return (
      (state.method === "COD" || state.method === "QR") &&
      typeof state.amount === "number" &&
      state.amount > 0 &&
      typeof state.itemCount === "number" &&
      state.itemCount > 0
    );
  }, [state.amount, state.itemCount, state.method]);

  if (!hasValidContext) {
    toast.error("Missing payment confirmation context", {
      description: "Please restart payment flow from checkout.",
    });
    navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.CART), { replace: true });
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <PaymentLayout
      title="Payment Successful"
      subtitle="Your payment confirmation has been recorded successfully"
    >
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-base font-semibold text-emerald-800">
            Payment completed successfully
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Thank you. Your order has been recorded with payment method {state.method}.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-[#5B4037]">Confirmation detail</p>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Method:</span> {state.method}
            </p>
            <p>
              <span className="font-medium">Amount:</span>{" "}
              {Number(state.amount || 0).toLocaleString("vi-VN")} VND
            </p>
            <p>
              <span className="font-medium">Items:</span> {state.itemCount}
            </p>
            <p>
              <span className="font-medium">Order ID:</span> {state.orderId || "N/A"}
            </p>
            <p>
              <span className="font-medium">Cart ID:</span> {state.cartId || "N/A"}
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
          <button
            type="button"
            onClick={handleGoToMyOrders}
            className="w-full rounded-lg bg-[#B8860B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Go to My Orders
          </button>

          <button
            type="button"
            onClick={() => navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.CART))}
            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Back to cart
          </button>
        </section>

        <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-600">
          <img src={secureLockIcon} alt="Secure" className="h-4 w-4" />
          <span>Payment confirmation page is visible for both COD and QR.</span>
        </div>
      </div>
    </PaymentLayout>
  );
};

export default PaymentSuccessPage;
