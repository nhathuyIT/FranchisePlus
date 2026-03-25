import { AlertTriangle, Package2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaymentByOrderId } from "@/hooks/payment";
import { useOrderDetailQuery } from "@/pages/admin/orders/hooks/use-order-management-query";
import { ROUTER_URL } from "@/router/route.const";
import { useLoadingStore } from "@/stores/loading.store";
import { OrderDeliveryCard } from "./components/OrderDeliveryCard";
import { OrderDetailHero } from "./components/OrderDetailHero";
import { OrderDetailSkeleton } from "./components/OrderDetailSkeleton";
import { OrderItemsCard } from "./components/OrderItemsCard";
import { OrderPageState } from "./components/OrderPageState";
import { OrderPaymentCard } from "./components/OrderPaymentCard";
import { OrderProgressCard } from "./components/OrderProgressCard";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import {
  canRepayOrder,
  getClientPath,
  getMyOrdersPath,
  getOrderItemCount,
} from "./order-detail.utils";

const MyOrderDetailsPage = () => {
  const navigate = useNavigate();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { orderId } = useParams();
  const normalizedOrderId = orderId?.trim() || "";

  const orderQuery = useOrderDetailQuery(normalizedOrderId, !!normalizedOrderId);
  const paymentQuery = usePaymentByOrderId(normalizedOrderId, !!normalizedOrderId);

  const order = orderQuery.data ?? null;
  const payment = paymentQuery.data ?? null;
  const itemCount = getOrderItemCount(order);
  const canPayNow = order
    ? canRepayOrder(order.status, payment?.status)
    : false;

  const handleBack = () => {
    navigate(getMyOrdersPath());
  };

  const handleRefresh = () => {
    void Promise.all([orderQuery.refetch(), paymentQuery.refetch()]);
  };

  const handlePayNow = () => {
    if (!order) {
      return;
    }

    setLoading(true);

    navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.PAYMENT_QR), {
      state: {
        orderId: order.id,
        paymentId: payment?.id,
        amount: Number(order.finalAmount || 0),
        itemCount,
        showPaymentLoading: true,
      },
    });
  };

  if (!normalizedOrderId) {
    return (
      <OrderPageState
        title="Order id is missing"
        description="This page needs a valid order reference before it can load the detail snapshot."
        icon={Package2}
        primaryActionLabel="Back to orders"
        onPrimaryAction={handleBack}
      />
    );
  }

  if (orderQuery.isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (orderQuery.error instanceof Error) {
    return (
      <OrderPageState
        title="Unable to load this order"
        description={orderQuery.error.message}
        icon={AlertTriangle}
        tone="danger"
        primaryActionLabel="Try again"
        onPrimaryAction={() => {
          void orderQuery.refetch();
        }}
        secondaryActionLabel="Back to orders"
        onSecondaryAction={handleBack}
      />
    );
  }

  if (!order) {
    return (
      <OrderPageState
        title="Order not available"
        description="The order detail no longer exists or cannot be accessed from the current account context."
        icon={Package2}
        primaryActionLabel="Back to orders"
        onPrimaryAction={handleBack}
      />
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <OrderDetailHero
        order={order}
        payment={payment}
        itemCount={itemCount}
        isRefreshing={orderQuery.isFetching || paymentQuery.isFetching}
        canPayNow={canPayNow}
        onBack={handleBack}
        onRefresh={handleRefresh}
        onPayNow={handlePayNow}
      />

      <OrderProgressCard status={order.status} />

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <OrderItemsCard items={order.orderItems} />
          <OrderDeliveryCard order={order} />
        </div>

        <div className="space-y-6">
          <OrderSummaryCard order={order} />
          <OrderPaymentCard
            payment={payment}
            isLoading={paymentQuery.isLoading}
            errorMessage={
              paymentQuery.error instanceof Error
                ? paymentQuery.error.message
                : undefined
            }
            canPayNow={canPayNow}
            onPayNow={handlePayNow}
          />
        </div>
      </div>
    </div>
  );
};

export default MyOrderDetailsPage;
