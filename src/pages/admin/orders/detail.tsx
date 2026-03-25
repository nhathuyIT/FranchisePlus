import { ArrowLeft, ReceiptText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ROUTER_URL } from "@/router/route.const";
import { OrderDetailScreen } from "./components/OrderDetailScreen";

function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId = "" } = useParams<{ orderId: string }>();

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-hide">
      <div className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col">
        <PageHeader
          title="Order Detail"
          description="Inspect one order after checkout or from the main order-management flow."
          icon={ReceiptText}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/${ROUTER_URL.ADMIN_ROUTER.ORDERS}`)}
              className="border-[#D9CBBF] text-[#6D4C41] hover:bg-[#FFF8F1]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          }
        />

        <OrderDetailScreen
          orderId={orderId}
          variant="page"
          onBack={() => navigate(`/admin/${ROUTER_URL.ADMIN_ROUTER.ORDERS}`)}
        />
      </div>
    </div>
  );
}

export default OrderDetailPage;
