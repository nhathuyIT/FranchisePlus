import { ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import { OrderDetailScreen } from "./components/OrderDetailScreen";
import { OrderFilterBar } from "./components/OrderFilterBar";
import { OrderFranchiseGate } from "./components/OrderFranchiseGate";
import { OrderListPanel } from "./components/OrderListPanel";
import { useOrderListPage } from "./hooks/use-order-list-page";

function OrdersPage() {
  const {
    franchiseContext,
    ordersQuery,
    filteredOrders,
    selectedOrderId,
    setSelectedOrderId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusFilters,
    openOrderDetailPage,
  } = useOrderListPage();

  const ordersError =
    ordersQuery.error instanceof Error ? ordersQuery.error : null;

  const emptyMessage = franchiseContext.isStaff
    ? "No deliveries assigned to your account match the current status and search filters."
    : franchiseContext.hasListContext
      ? "No orders match the current franchise, status, and local search filters."
      : "Select a franchise first to load orders.";

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-hide">
      <NormalLoadingLayout
        forceShow={ordersQuery.isFetching && !ordersQuery.isLoading}
      />

      <div className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col">
        <PageHeader
          title="Order Management"
          description="Track franchise orders, move delivery status forward, and keep payment state in sync."
          icon={ReceiptText}
        />

        <OrderFranchiseGate
          canSelectFranchise={franchiseContext.canSelectFranchise}
          isLoadingFranchises={franchiseContext.isLoadingFranchises}
          franchiseOptions={franchiseContext.franchiseOptions}
          activeFranchiseId={franchiseContext.activeFranchiseId}
          activeFranchiseName={franchiseContext.activeFranchise?.name}
          onSelectFranchise={franchiseContext.setSelectedFranchiseId}
        />

        <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="min-h-0">
            <OrderFilterBar
              statusFilters={statusFilters}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onRefresh={() => {
                void ordersQuery.refetch();
              }}
              isRefreshing={ordersQuery.isFetching}
              disabled={!franchiseContext.hasListContext}
            />

            <OrderListPanel
              orders={filteredOrders}
              selectedOrderId={selectedOrderId}
              isLoading={ordersQuery.isLoading}
              error={ordersError}
              suppressError={franchiseContext.isStaff}
              emptyMessage={emptyMessage}
              onRetry={() => {
                void ordersQuery.refetch();
              }}
              onSelectOrder={setSelectedOrderId}
              onOpenOrderPage={openOrderDetailPage}
            />
          </div>

          <div className="min-h-0">
            <OrderDetailScreen
              orderId={selectedOrderId}
              variant="panel"
              onOpenFullPage={openOrderDetailPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
