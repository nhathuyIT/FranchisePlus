import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  ORDER_STATUS_TABS,
  ORDER_STATUS_STYLES,
  type OrderStatus,
  type Order,
} from "@/const/order.const";
import { useGetMyOrders } from "@/hooks/client/useOrder.hook";
import { useAuthStore } from "@/stores/auth-store";

const MyOrderPage = () => {
  const customerId = useAuthStore((state) => state.authUser?.user?.id);
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: orders = [], isLoading, isError } = useGetMyOrders();

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (activeTab !== "ALL") {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.code.toLowerCase().includes(q) ||
          order.franchiseName.toLowerCase().includes(q) ||
          order.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [activeTab, searchQuery, orders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length;

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
          {filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))}
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
    Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
  </div>
);

/* ─── Empty State ─── */
const EmptyState = ({ activeTab }: { activeTab: string }) => (
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
  formatCurrency,
  formatDate,
}: {
  order: Order;
  formatCurrency: (n: number) => string;
  formatDate: (s: string) => string;
}) => {
  const statusInfo = ORDER_STATUS_STYLES[order.status];

  return (
    <div className="bg-white border border-[#E8E0D8] rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      {/* Header row: Shop name + Status */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#F5F0EB]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#3E2723]">
            {order.franchiseName}
          </span>
          <span className="text-xs text-[#BCAAA4]">|</span>
          <span className="text-xs text-[#A1887F]">{order.code}</span>
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wide ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
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
              <p className="text-xs text-[#A1887F] mt-0.5">
                Phân loại: {item.variant}
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
        <span className="text-xs text-[#A1887F]">
          {formatDate(order.createdAt)}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5D4037]">
            Thành tiền:{" "}
            <span className="font-bold text-[#C97B3D] text-base">
              {formatCurrency(order.totalAmount)}
            </span>
          </span>
          {order.status === "COMPLETED" && (
            <button className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#C97B3D] text-white hover:bg-[#B5692F] transition-colors cursor-pointer">
              Mua Lại
            </button>
          )}
          {order.status === "PENDING" && (
            <button className="px-4 py-1.5 text-xs font-medium rounded-lg border border-[#C97B3D] text-[#C97B3D] hover:bg-[#C97B3D]/5 transition-colors cursor-pointer">
              Thanh Toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
