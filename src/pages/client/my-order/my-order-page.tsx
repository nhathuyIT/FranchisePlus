import { useMemo, useState } from "react";
import { Search, CreditCard, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Order } from "@/const/order.const";
import type { ApiOrderStatus } from "@/api/order/order.api";
import { useGetMyOrders } from "@/hooks/client/useOrder.hook";
import { useAuthStore } from "@/stores/auth-store";
import { usePaymentsByCustomerId } from "@/hooks/payment";
import type { AdminPayment } from "@/types/admin-payment.type";
import { ROUTER_URL } from "@/router/route.const";

const ORDER_STATUS_TABS: { key: ApiOrderStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY_FOR_PICKUP", label: "Ready for pickup" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "COMPLETED", label: "Completed " },
  { key: "CANCELED", label: "Cancelled " },
];

const ORDER_STATUS_BADGE_MAP: Record<
  ApiOrderStatus,
  {
    label: string;
    wrapperClassName: string;
    iconClassName: string;
    textClassName: string;
  }
> = {
  DRAFT: {
    label: "DRAFT",
    wrapperClassName: "bg-slate-50 border-slate-200",
    iconClassName: "text-slate-500",
    textClassName: "text-slate-600",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    wrapperClassName: "bg-blue-50 border-blue-200",
    iconClassName: "text-blue-500",
    textClassName: "text-blue-700",
  },
  PREPARING: {
    label: "PREPARING",
    wrapperClassName: "bg-amber-50 border-amber-200",
    iconClassName: "text-amber-600",
    textClassName: "text-amber-700",
  },
  READY_FOR_PICKUP: {
    label: "READY FOR PICKUP",
    wrapperClassName: "bg-indigo-50 border-indigo-200",
    iconClassName: "text-indigo-500",
    textClassName: "text-indigo-700",
  },
  OUT_FOR_DELIVERY: {
    label: "OUT FOR DELIVERY",
    wrapperClassName: "bg-orange-50 border-orange-200",
    iconClassName: "text-orange-500",
    textClassName: "text-orange-700",
  },
  COMPLETED: {
    label: "COMPLETED",
    wrapperClassName: "bg-green-50 border-green-200",
    iconClassName: "text-green-600",
    textClassName: "text-green-700",
  },
  CANCELED: {
    label: "CANCELED",
    wrapperClassName: "bg-red-50 border-red-200",
    iconClassName: "text-red-500",
    textClassName: "text-red-600",
  },
};

const getClientPath = (path: string) => {
  return `${ROUTER_URL.CLIENT}/${path}`;
};

const MyOrderPage = () => {
  const customerId = useAuthStore((state) => state.authUser?.user?.id);
  const stringCustomerId = String(customerId || "");

  const [activeTab, setActiveTab] = useState<ApiOrderStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Lấy danh sách Order
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError,
  } = useGetMyOrders(activeTab === "ALL" ? undefined : activeTab);

  // 2. Lấy TẤT CẢ Payment của khách hàng này (Chỉ tốn 1 Request duy nhất)
  const { data: customerPayments = [], isLoading: isPaymentsLoading } =
    usePaymentsByCustomerId(stringCustomerId, !!customerId);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.code.toLowerCase().includes(q) ||
          order.franchiseName.toLowerCase().includes(q) ||
          order.items.some((item) => item.name.toLowerCase().includes(q)),
      );
    }

    return filtered;
  }, [searchQuery, orders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const isLoading = isOrdersLoading || isPaymentsLoading;

  return (
    <div>
      {/* ═══ Page Title ═══ */}
      <div className="mb-6">
        <h1 className="font-coffee text-3xl md:text-4xl italic text-[#3E2723] mb-1">
          My Order
        </h1>
        <p className="text-[#8D6E63] text-sm">
          Theo dõi và quản lý đơn hàng của bạn.
        </p>
      </div>

      {/* ═══ Status Tabs ═══ */}
      <div className="border-b border-[#E8E0D8] mb-6">
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          {ORDER_STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count =
              tab.key === "ALL"
                ? activeTab === "ALL"
                  ? orders.length
                  : 0
                : activeTab === tab.key
                  ? orders.length
                  : 0;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "border-[#C97B3D] text-[#C97B3D]"
                    : "border-transparent text-[#8D6E63] hover:text-[#5D4037] hover:border-[#D7CCC8]"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-xs ${isActive ? "text-[#C97B3D]" : "text-[#A1887F]"}`}
                  >
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Search Bar ═══ */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1887F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn hàng, tên cửa hàng hoặc tên sản phẩm"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E0D8] rounded-lg text-sm text-[#3E2723] placeholder:text-[#BCAAA4] focus:outline-none focus:border-[#C97B3D] focus:ring-1 focus:ring-[#C97B3D]/30 transition-colors"
          />
        </div>
      </div>

      {/* ═══ Order List ═══ */}
      {!customerId && !isLoading ? (
        <div className="rounded-xl border border-[#E8E0D8] bg-white p-4 text-sm text-[#8D6E63]">
          Vui lòng đăng nhập để xem đơn hàng của bạn.
        </div>
      ) : isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : filteredOrders.length === 0 ? (
        <EmptyState activeTab={activeTab} />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderIdMatcher = order.rawId || String(order.id);
            const matchedPayment = customerPayments.find((p) => {
              const pOrderId =
                typeof p.orderId === "object" && p.orderId !== null
                  ? (p.orderId as Record<string, unknown>)._id || (p.orderId as Record<string, unknown>).id
                  : String(p.orderId);
              return String(pOrderId) === orderIdMatcher;
            });

            return (
              <OrderRow
                key={order.id}
                order={order}
                payment={matchedPayment}
                formatCurrency={formatCurrency}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, idx) => (
      <div
        key={`order-loading-${idx}`}
        className="h-28 rounded-xl border border-[#E8E0D8] bg-[#FAF8F5] animate-pulse"
      />
    ))}
  </div>
);

const ErrorState = () => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    Cant get the orders. Please try again later.
  </div>
);

/* ─── Empty State ─── */
const EmptyState = ({ activeTab }: { activeTab: ApiOrderStatus | "ALL" }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-[#EFEBE9] flex items-center justify-center mb-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="No orders"
        className="w-10 h-10 opacity-50"
      />
    </div>
    <p className="text-[#8D6E63] text-sm">
      {activeTab === "ALL"
        ? "Bạn chưa có đơn hàng nào."
        : "Không có đơn hàng nào trong mục này."}
    </p>
  </div>
);

/* ─── Single Order Row ─── */
const OrderRow = ({
  order,
  payment,
  formatCurrency,
}: {
  order: Order;
  payment?: AdminPayment;
  formatCurrency: (n: number) => string;
}) => {
  const navigate = useNavigate();
  const paymentStatus = String(payment?.status || "PENDING").toUpperCase();
  const isPaid = paymentStatus === "PAID";
  const isRefunded = paymentStatus === "REFUNDED";
  const orderStatus: ApiOrderStatus = order.apiStatus || "DRAFT";
  const isCancelled = orderStatus === "CANCELED";
  const isCompleted = orderStatus === "COMPLETED";
  const badgeConfig = ORDER_STATUS_BADGE_MAP[orderStatus];

  const itemCount = useMemo(() => {
    return order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [order.items]);

  const handlePayNow = () => {
    navigate(getClientPath(ROUTER_URL.CLIENT_ROUTER.PAYMENT_QR), {
      state: {
        orderId: order.rawId || String(order.id),
        paymentId: payment?.id,
        amount: Number(order.totalAmount || 0),
        itemCount,
      },
    });
  };

  return (
    <div className="bg-white border border-[#E8E0D8] rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      {/* Header row: Shop name + Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-5 py-3 border-b border-[#F5F0EB] gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#3E2723]">
            {order.franchiseName}
          </span>
          <span className="text-xs text-[#BCAAA4]">|</span>
          <span className="text-xs text-[#A1887F] font-mono">{order.code}</span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${badgeConfig.wrapperClassName}`}
          >
            {isCompleted ? (
              <CheckCircle2 className={`w-3.5 h-3.5 ${badgeConfig.iconClassName}`} />
            ) : (
              <CreditCard className={`w-3.5 h-3.5 ${badgeConfig.iconClassName}`} />
            )}
            <span
              className={`text-[11px] font-bold uppercase tracking-wide ${badgeConfig.textClassName}`}
            >
              {badgeConfig.label}
            </span>
          </div>

          {/* Optional: Payment Status Badge for better clarity */}
          {isPaid && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wide">
                PAID
              </span>
            </div>
          )}
          {isRefunded && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                REFUNDED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4">
        {order.items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 ${idx > 0 ? "mt-4 pt-4 border-t border-[#F5F0EB]" : ""}`}
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#E8E0D8] shrink-0 bg-[#FAF8F5]">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#3E2723] truncate">
                {item.name}
              </p>

              <p className="text-xs text-[#A1887F]">x{item.quantity}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#C97B3D]">
                {formatCurrency(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Total + Date + Actions */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#F5F0EB] bg-[#FDFCFB]">
        <span className="text-xs text-[#A1887F]"></span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5D4037]">
            Total Amount:{" "}
            <span className="font-bold text-[#C97B3D] text-base">
              {formatCurrency(order.totalAmount)}
            </span>
          </span>
          {isCompleted && (
            <button className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#5D4037] text-white hover:bg-[#3E2723] transition-colors cursor-pointer">
              Mua Lại
            </button>
          )}

          {/* CTA Dựa vào trạng thái thanh toán thật */}
          {!isPaid && !isRefunded && !isCompleted && !isCancelled && (
            <button
              onClick={handlePayNow}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#C97B3D] text-white hover:bg-[#B5692F] shadow-sm transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" /> Paying
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
