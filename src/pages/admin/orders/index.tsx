import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import {
  PopoverSearchSelect,
  type PopoverSearchSelectOption,
} from "@/components/form-dialog";
import { Permission } from "@/config/permission";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useCustomerSearch } from "@/hooks/customer";
import { useOrdersByCustomerQuery } from "@/hooks/order";
import { useAuthStore } from "@/stores/auth-store";
import type { AdminOrder, AdminOrderStatus } from "@/api/order/order.api";

type OrderFilterStatus = "ALL" | AdminOrderStatus;

const STATUS_OPTIONS: Array<{ label: string; value: OrderFilterStatus }> = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "DRAFT", value: "DRAFT" },
  { label: "PENDING", value: "PENDING" },
  { label: "CONFIRMED", value: "CONFIRMED" },
  { label: "PREPARING", value: "PREPARING" },
  { label: "SHIPPING", value: "SHIPPING" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "CANCELLED", value: "CANCELLED" },
  { label: "REFUNDED", value: "REFUNDED" },
];

const STATUS_STYLE: Record<
  AdminOrderStatus,
  { label: string; className: string }
> = {
  DRAFT: { label: "Nháp", className: "border-[#9CA3AF] text-[#6B7280]" },
  PENDING: {
    label: "Chờ xử lý",
    className: "border-[#F59E0B] text-[#B45309]",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "border-[#2563EB] text-[#1D4ED8]",
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    className: "border-[#7C3AED] text-[#6D28D9]",
  },
  SHIPPING: {
    label: "Đang giao",
    className: "border-[#EA580C] text-[#C2410C]",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "border-[#16A34A] text-[#15803D]",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-[#DC2626] text-[#B91C1C]",
  },
  REFUNDED: {
    label: "Hoàn tiền",
    className: "border-[#0EA5E9] text-[#0284C7]",
  },
};

const formatDateTime = (value: string | null): string => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const createOrderColumns = (): ColumnDef<AdminOrder>[] => [
  {
    accessorKey: "code",
    header: "Mã đơn",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[#5D4037]">
        {row.original.code || "-"}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Khách hàng",
    cell: ({ row }) => (
      <div
        className="max-w-44 truncate"
        title={row.original.customerName || "Unknown customer"}
      >
        {row.original.customerName || "Unknown customer"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-[#6D4C41] text-[#6D4C41]">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const style = STATUS_STYLE[row.original.status];
      return (
        <Badge variant="outline" className={style.className}>
          {style.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => (
      <span className="font-semibold text-[#3E2723]">
        {formatCurrency(row.original.totalAmount)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Thời gian tạo",
    cell: ({ row }) => (
      <div
        className="max-w-36 truncate text-[#5D4037]"
        title={formatDateTime(row.original.createdAt)}
      >
        {formatDateTime(row.original.createdAt)}
      </div>
    ),
  },
];

type CustomerOption = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

const toCustomerOptionLabel = (customer: CustomerOption) => (
  <span className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap">
    <span className="truncate font-medium text-[#3E2723]">{customer.name}</span>
    <span className="shrink-0 text-[#C7B8AA]">-</span>
    <span className="truncate text-xs text-[#8D6E63]">
      {customer.email}
      {customer.phone ? ` - ${customer.phone}` : ""}
    </span>
  </span>
);

const OrdersPage = () => {
  const { getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  const canViewOrders = userPermissions.includes(Permission.VIEW_ORDERS);

  const [statusFilter, setStatusFilter] = useState<OrderFilterStatus>("ALL");
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [customerSearchValue, setCustomerSearchValue] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const debouncedKeyword = useDebounce(
    customerSearchValue.trim(),
    350,
    customerSearchValue,
  );

  const customerSearchQuery = useCustomerSearch(
    {
      searchCondition: {
        keyword: debouncedKeyword || undefined,
        isActive: true,
        isDeleted: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 20,
      },
    },
    {
      enabled: canViewOrders && customerSearchOpen,
    },
  );

  const ordersQuery = useOrdersByCustomerQuery(
    selectedCustomer?.id ?? "",
    canViewOrders && !!selectedCustomer?.id,
  );

  const customerSearchResults = useMemo(
    () => customerSearchQuery.data?.pageData ?? [],
    [customerSearchQuery.data],
  );

  const customerOptions = useMemo<PopoverSearchSelectOption[]>(
    () =>
      customerSearchResults.map((customer) => ({
        value: customer.id,
        label: toCustomerOptionLabel({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        }),
        searchText: `${customer.name} ${customer.email} ${customer.phone ?? ""}`,
      })),
    [customerSearchResults],
  );

  const selectedCustomerOption = useMemo<PopoverSearchSelectOption | null>(
    () =>
      selectedCustomer
        ? {
            value: selectedCustomer.id,
            label: toCustomerOptionLabel(selectedCustomer),
            searchText: `${selectedCustomer.name} ${selectedCustomer.email} ${selectedCustomer.phone ?? ""}`,
          }
        : null,
    [selectedCustomer],
  );

  const mergedCustomerOptions = useMemo(() => {
    if (!selectedCustomerOption) return customerOptions;

    return [
      selectedCustomerOption,
      ...customerOptions.filter(
        (option) => option.value !== selectedCustomerOption.value,
      ),
    ];
  }, [customerOptions, selectedCustomerOption]);

  const listError =
    ordersQuery.error instanceof Error ? ordersQuery.error : null;

  const rows = useMemo(() => {
    const source = ordersQuery.data ?? [];
    if (statusFilter === "ALL") {
      return source;
    }

    return source.filter((order) => order.status === statusFilter);
  }, [ordersQuery.data, statusFilter]);

  const selectedOrder = useMemo(() => {
    if (!rows.length) return null;
    if (!selectedOrderId) return rows[0];

    return rows.find((order) => order.id === selectedOrderId) ?? rows[0];
  }, [rows, selectedOrderId]);

  const columns = useMemo(() => createOrderColumns(), []);

  const isLoading =
    (ordersQuery.isLoading || ordersQuery.isFetching) && canViewOrders;

  const emptyMessage = !canViewOrders
    ? "Bạn không có quyền xem đơn hàng."
    : !selectedCustomer
      ? "Vui lòng chọn customer để tải danh sách đơn hàng."
      : "Không có đơn hàng nào khớp với điều kiện hiện tại.";

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Order Management"
          description="Chọn customer để xem danh sách order và lọc theo trạng thái."
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full max-w-xl">
              <PopoverSearchSelect
                value={selectedCustomer?.id}
                onValueChange={(customerId) => {
                  const matchedCustomer = customerSearchResults.find(
                    (customer) => customer.id === customerId,
                  );

                  if (!matchedCustomer) return;

                  setSelectedCustomer({
                    id: matchedCustomer.id,
                    name: matchedCustomer.name,
                    email: matchedCustomer.email,
                    phone: matchedCustomer.phone,
                  });
                  setSelectedOrderId(null);
                  setCustomerSearchOpen(false);
                }}
                options={mergedCustomerOptions}
                open={customerSearchOpen}
                onOpenChange={setCustomerSearchOpen}
                searchValue={customerSearchValue}
                onSearchValueChange={setCustomerSearchValue}
                placeholder="Chọn customer để xem order"
                searchPlaceholder="Tìm customer theo tên, email hoặc số điện thoại..."
                emptyText="Không tìm thấy customer"
                loadingText="Đang tải customer..."
                isLoading={
                  customerSearchQuery.isLoading ||
                  customerSearchQuery.isFetching
                }
                minChars={0}
                triggerClassName="border-[#E8DFD6] bg-white"
                contentClassName="w-[min(42rem,calc(100vw-2rem))]"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as OrderFilterStatus)
              }
            >
              <SelectTrigger className="w-60 border-[#E8DFD6]">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-105 shrink-0">
            <DataTable
              columns={columns}
              data={rows}
              isLoading={isLoading}
              error={listError}
              onRetry={() => {
                void ordersQuery.refetch();
              }}
              searchable
              searchPlaceholder="Tìm trong bảng theo mã đơn, khách hàng..."
              emptyMessage={emptyMessage}
              onRowClick={(order) => setSelectedOrderId(order.id)}
              getRowClassName={(order) =>
                order.id === selectedOrder?.id
                  ? "bg-[#FFF8F1] hover:bg-[#FFF3E0]"
                  : ""
              }
              enableColumnVisibility
            />
          </div>

          <div className="rounded-xl border border-[#E8DFD6] bg-[#FAF8F5] p-4">
            <h3 className="mb-3 text-base font-semibold text-[#3E2723]">
              Chi tiết đơn hàng
            </h3>

            {!selectedOrder ? (
              <p className="text-sm text-[#5D4037]">
                Chọn một đơn hàng ở bảng bên trên để xem chi tiết.
              </p>
            ) : (
              <div className="space-y-3 text-sm text-[#5D4037]">
                <div className="grid gap-2 md:grid-cols-2">
                  <p>
                    <span className="font-medium text-[#3E2723]">Mã đơn:</span>{" "}
                    {selectedOrder.code}
                  </p>
                  <p>
                    <span className="font-medium text-[#3E2723]">
                      Franchise:
                    </span>{" "}
                    {selectedOrder.franchiseName}
                  </p>
                  <p>
                    <span className="font-medium text-[#3E2723]">
                      Khách hàng:
                    </span>{" "}
                    {selectedOrder.customerName}
                  </p>
                  <p>
                    <span className="font-medium text-[#3E2723]">
                      Tổng tiền:
                    </span>{" "}
                    {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                  <p>
                    <span className="font-medium text-[#3E2723]">Tạo lúc:</span>{" "}
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium text-[#3E2723]">
                      Xác nhận:
                    </span>{" "}
                    {formatDateTime(selectedOrder.confirmedAt)}
                  </p>
                  <p>
                    <span className="font-medium text-[#3E2723]">
                      Hoàn thành:
                    </span>{" "}
                    {formatDateTime(selectedOrder.completedAt)}
                  </p>
                  <p>
                    <span className="font-medium text-[#3E2723]">Hủy lúc:</span>{" "}
                    {formatDateTime(selectedOrder.cancelledAt)}
                  </p>
                </div>

                <div>
                  <p className="mb-2 font-medium text-[#3E2723]">
                    Danh sách món
                  </p>
                  {selectedOrder.items.length === 0 ? (
                    <p>Đơn hàng hiện chưa có item.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border border-[#E8DFD6] bg-white px-3 py-2"
                        >
                          <div>
                            <p className="font-medium text-[#3E2723]">
                              {item.productName}
                            </p>
                            <p className="text-xs text-[#8D6E63]">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-[#3E2723]">
                            {formatCurrency(item.lineTotal)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
