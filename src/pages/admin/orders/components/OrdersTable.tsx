import { useMemo } from "react";
import { DataTable } from "@/components/common/DataTable";
import type { ApiOrder } from "@/api/order/order.api";
import { createOrderColumns } from "../columns/order.columns";
import { OrderStatusActionSelect } from "./OrderStatusActionSelect";

interface OrdersTableProps {
  orders: ApiOrder[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;

  canManageOrders?: boolean;
  pendingOrderId?: string | null;
  onChangeStatusPreparing: (orderId: string) => void;
  onChangeStatusReadyForPickup: (orderId: string) => void;
}

export const OrdersTable = ({
  orders,
  isLoading = false,
  error = null,
  onRetry,
  canManageOrders = false,
  pendingOrderId,
  onChangeStatusPreparing,
  onChangeStatusReadyForPickup,
}: OrdersTableProps) => {
  const columns = useMemo(() => createOrderColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={orders}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search orders by code, customer, franchise..."
      emptyMessage="No orders found."
      initialPageSize={10}
      enableColumnVisibility
      renderActions={(order) => (
        <OrderStatusActionSelect
          order={order}
          disabled={!canManageOrders}
          isPending={pendingOrderId === String(order.id)}
          onChangeStatusPreparing={onChangeStatusPreparing}
          onChangeStatusReadyForPickup={onChangeStatusReadyForPickup}
        />
      )}
    />
  );
};
