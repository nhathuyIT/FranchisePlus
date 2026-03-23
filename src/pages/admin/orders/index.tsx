import { useCallback, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PopoverSearchSelect } from "@/components/form-dialog/PopoverSearchSelect";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import {
  useChangeOrderStatusPreparing,
  useChangeOrderStatusReadyForPickup,
  useOrderByCartId,
  useOrderByCode,
  useOrderById,
  useOrderDetailQueries,
  useOrdersAllFranchises,
  useOrdersByCustomerId,
  useOrdersByFranchiseId,
} from "@/hooks/order";
import { useFranchiseSelect } from "@/hooks/franchise";
import { useCustomerAdminDetailQueries } from "@/hooks/customer";
import type { ApiOrder, ApiOrderStatus } from "@/api/order/order.api";
import { OrdersTable } from "./components/OrdersTable";

const ALL_FRANCHISES = "__all__";

type StatusFilter = ApiOrderStatus | "CANCELLED" | "ALL";

type AdminOrder = ApiOrder & { customerName?: string };

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY_FOR_PICKUP", label: "Ready for pickup" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Cancelled" },
  { value: "CANCELLED", label: "Cancelled" },
];

const OrdersPage = () => {
  const {
    authUser,
    getCurrentPermissions,
    isAdmin: isAdminFn,
  } = useAuthStore();

  const userPermissions = getCurrentPermissions();
  const canViewOrders = userPermissions.includes(Permission.VIEW_ORDERS);
  const canManageOrders = userPermissions.includes(Permission.MANAGE_ORDERS);

  const isAdmin = isAdminFn();
  const currentFranchiseId = authUser?.currentFranchiseId;

  const [activeTab, setActiveTab] = useState("list");

  const [selectedFranchise, setSelectedFranchise] = useState<string>(
    isAdmin ? ALL_FRANCHISES : (currentFranchiseId ?? ""),
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("CONFIRMED");

  // Lookup states
  const [lookupCode, setLookupCode] = useState("");
  const [lookupOrderId, setLookupOrderId] = useState("");
  const [lookupCartId, setLookupCartId] = useState("");
  const [lookupCustomerId, setLookupCustomerId] = useState("");
  const [lookupCustomerStatus, setLookupCustomerStatus] =
    useState<StatusFilter>("ALL");

  const normalizedStatus: ApiOrderStatus | undefined =
    statusFilter === "ALL"
      ? undefined
      : statusFilter === "CANCELLED"
        ? "CANCELED"
        : statusFilter;

  const franchiseSelectQuery = useFranchiseSelect();
  const franchiseOptions = useMemo(() => {
    const franchises = franchiseSelectQuery.data ?? [];
    const base = franchises.map((fr) => ({
      value: fr.value,
      label: `${fr.code} - ${fr.name}`,
      searchText: `${fr.code} ${fr.name}`,
    }));

    return [
      { value: ALL_FRANCHISES, label: "All Franchises", searchText: "all" },
      ...base,
    ];
  }, [franchiseSelectQuery.data]);

  const statusOptions = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
        searchText: opt.label,
      })),
    [],
  );

  const franchiseIds = useMemo(() => {
    const franchises = franchiseSelectQuery.data ?? [];
    return franchises.map((fr) => fr.value).filter(Boolean);
  }, [franchiseSelectQuery.data]);

  const shouldUseAllFranchises = isAdmin && selectedFranchise === ALL_FRANCHISES;
  const effectiveFranchiseId = isAdmin
    ? selectedFranchise
    : (currentFranchiseId ?? "");

  const ordersByFranchiseEnabled =
    canViewOrders &&
    !shouldUseAllFranchises &&
    !!effectiveFranchiseId &&
    effectiveFranchiseId !== ALL_FRANCHISES;

  const ordersByFranchiseQuery = useOrdersByFranchiseId(
    {
      franchiseId: effectiveFranchiseId,
      status: normalizedStatus,
    },
    ordersByFranchiseEnabled,
  );

  const ordersAllQuery = useOrdersAllFranchises({
    franchiseIds,
    status: normalizedStatus,
    enabled: canViewOrders && shouldUseAllFranchises,
  });

  const activeOrdersQuery = shouldUseAllFranchises
    ? ordersAllQuery
    : ordersByFranchiseQuery;

  const orders: AdminOrder[] = activeOrdersQuery.data ?? [];

  const franchiseNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const fr of franchiseSelectQuery.data ?? []) {
      if (fr.value) {
        map.set(fr.value, fr.name || fr.code || fr.value);
      }
    }
    return map;
  }, [franchiseSelectQuery.data]);

  const preparingMutation = useChangeOrderStatusPreparing();
  const readyMutation = useChangeOrderStatusReadyForPickup();

  const pendingOrderId =
    (preparingMutation.isPending ? preparingMutation.variables : null) ??
    (readyMutation.isPending ? readyMutation.variables : null) ??
    null;

  const handleStatusPreparing = useCallback(
    (orderId: string) => {
      if (!canManageOrders) return;
      preparingMutation.mutate(orderId);
    },
    [canManageOrders, preparingMutation],
  );

  const handleStatusReady = useCallback(
    (orderId: string) => {
      if (!canManageOrders) return;
      readyMutation.mutate(orderId);
    },
    [canManageOrders, readyMutation],
  );

  // ---------------- Lookup Queries (manual trigger) ----------------

  const orderByCodeQuery = useOrderByCode(lookupCode.trim(), false);
  const orderByIdQuery = useOrderById(lookupOrderId.trim(), false);
  const orderByCartQuery = useOrderByCartId(lookupCartId.trim(), false);

  const normalizedLookupCustomerStatus: ApiOrderStatus | undefined =
    lookupCustomerStatus === "ALL"
      ? undefined
      : lookupCustomerStatus === "CANCELLED"
        ? "CANCELED"
        : lookupCustomerStatus;

  const ordersByCustomerQuery = useOrdersByCustomerId(
    {
      customerId: lookupCustomerId.trim(),
      status: normalizedLookupCustomerStatus,
    },
    false,
  );

  const lookupResults = useMemo<AdminOrder[]>(() => {
    if (activeTab !== "lookup") return [];

    if (orderByCodeQuery.data) return [orderByCodeQuery.data];
    if (orderByIdQuery.data) return [orderByIdQuery.data];
    if (orderByCartQuery.data) return [orderByCartQuery.data];
    if (ordersByCustomerQuery.data) return ordersByCustomerQuery.data;

    return [];
  }, [
    activeTab,
    orderByCartQuery.data,
    orderByCodeQuery.data,
    orderByIdQuery.data,
    ordersByCustomerQuery.data,
  ]);

  const canViewCustomers = userPermissions.includes(Permission.VIEW_CUSTOMERS);

  const orderIdsToEnrich = useMemo(() => {
    const source = activeTab === "lookup" ? lookupResults : orders;

    const ids = new Set<string>();
    for (const order of source) {
      // if list endpoint lacks ids/names, hydrate from detail endpoint
      if (!order.customerId || !order.customerName || !order.franchiseName) {
        if (order.id) ids.add(String(order.id));
      }
    }

    // cap to avoid too many parallel calls
    return Array.from(ids).slice(0, 25);
  }, [activeTab, lookupResults, orders]);

  const orderDetailQueries = useOrderDetailQueries(
    orderIdsToEnrich,
    canViewOrders,
  );

  const orderDetailById = useMemo(() => {
    const map = new Map<string, ApiOrder>();
    for (const query of orderDetailQueries) {
      const detail = query.data;
      if (detail?.id) {
        map.set(String(detail.id), detail);
      }
    }
    return map;
  }, [orderDetailQueries]);

  const customerIdsToEnrich = useMemo(() => {
    const source = activeTab === "lookup" ? lookupResults : orders;

    const ids = new Set<string>();
    for (const order of source) {
      const detail = orderDetailById.get(String(order.id));
      const effectiveCustomerId = order.customerId || detail?.customerId;
      const effectiveCustomerName = order.customerName;

      if (effectiveCustomerId && !effectiveCustomerName) {
        ids.add(String(effectiveCustomerId));
      }
    }

    // Safety cap to avoid too many parallel requests on very large lists.
    return Array.from(ids).slice(0, 50);
  }, [activeTab, lookupResults, orderDetailById, orders]);

  const customerDetailQueries = useCustomerAdminDetailQueries(
    customerIdsToEnrich,
    canViewOrders && canViewCustomers,
  );

  const customerNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const query of customerDetailQueries) {
      const customer = query.data;
      if (customer?.id && customer.name) {
        map.set(customer.id, customer.name);
      }
    }
    return map;
  }, [customerDetailQueries]);

  const enrichOrders = useCallback(
    (source: AdminOrder[]): AdminOrder[] =>
      source.map((order) => ({
        // Prefer Order Detail endpoint for the most complete data
        ...(orderDetailById.get(String(order.id)) ?? {}),
        // Keep list row fields as fallback (some endpoints may include newer status)
        ...order,
        franchiseId:
          String(
            order.franchiseId ||
              orderDetailById.get(String(order.id))?.franchiseId ||
              "",
          ),
        customerId:
          String(
            order.customerId ||
              orderDetailById.get(String(order.id))?.customerId ||
              "",
          ),
        franchiseName:
          order.franchiseName ||
          orderDetailById.get(String(order.id))?.franchiseName ||
          franchiseNameById.get(
            String(
              order.franchiseId ||
                orderDetailById.get(String(order.id))?.franchiseId ||
                "",
            ),
          ) ||
          "",
        customerName:
          order.customerName ||
          customerNameById.get(
            String(
              order.customerId ||
                orderDetailById.get(String(order.id))?.customerId ||
                "",
            ),
          ) ||
          "",
      })),
    [customerNameById, franchiseNameById, orderDetailById],
  );

  const enrichedOrders = useMemo(() => enrichOrders(orders), [enrichOrders, orders]);
  const enrichedLookupResults = useMemo(
    () => enrichOrders(lookupResults),
    [enrichOrders, lookupResults],
  );

  const lookupIsLoading =
    orderByCodeQuery.isFetching ||
    orderByIdQuery.isFetching ||
    orderByCartQuery.isFetching ||
    ordersByCustomerQuery.isFetching;

  const lookupError =
    (orderByCodeQuery.error as Error | null) ??
    (orderByIdQuery.error as Error | null) ??
    (orderByCartQuery.error as Error | null) ??
    (ordersByCustomerQuery.error as Error | null) ??
    null;

  const runLookupByCode = async () => {
    await orderByCodeQuery.refetch();
  };

  const runLookupById = async () => {
    await orderByIdQuery.refetch();
  };

  const runLookupByCart = async () => {
    await orderByCartQuery.refetch();
  };

  const runLookupByCustomer = async () => {
    await ordersByCustomerQuery.refetch();
  };

  const ordersError =
    activeOrdersQuery.error instanceof Error ? activeOrdersQuery.error : null;

  const ordersLoading =
    activeOrdersQuery.isLoading ||
    activeOrdersQuery.isFetching ||
    preparingMutation.isPending ||
    readyMutation.isPending;

  const missingManagerFranchise = !isAdmin && !currentFranchiseId;

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        <PageHeader
          title="Orders"
          description={
            isAdmin
              ? "View and manage orders across all franchises."
              : "View and manage orders for your franchise."
          }
        />

        {missingManagerFranchise && (
          <div className="rounded-xl border border-[#E8DFD6] bg-white p-4 text-sm text-[#5D4037]">
            Your current context has no franchise selected. Please switch role/context
            to a franchise before viewing orders.
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex items-center justify-between gap-3 shrink-0">
              <TabsList className="bg-white border border-[#E8DFD6] rounded-xl">
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="lookup"
                  className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200"
                >
                  Lookup
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                {isAdmin && activeTab === "list" && (
                  <div className="w-[22rem]">
                    <PopoverSearchSelect
                      value={selectedFranchise}
                      onValueChange={setSelectedFranchise}
                      options={franchiseOptions}
                      placeholder="Select franchise"
                      searchPlaceholder="Search franchise..."
                      isLoading={
                        franchiseSelectQuery.isLoading ||
                        franchiseSelectQuery.isFetching
                      }
                    />
                  </div>
                )}

                {activeTab === "list" && (
                  <div className="w-[14rem]">
                    <PopoverSearchSelect
                      value={statusFilter}
                      onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                      options={statusOptions}
                      placeholder="Status"
                      searchPlaceholder="Search status..."
                    />
                  </div>
                )}
              </div>
            </div>

            <TabsContent value="list" className="mt-4 min-h-0 flex-1">
              <div className="h-full min-h-0">
                <OrdersTable
                  orders={enrichedOrders}
                  isLoading={ordersLoading}
                  error={ordersError}
                  onRetry={() => void activeOrdersQuery.refetch()}
                  canManageOrders={canManageOrders}
                  pendingOrderId={pendingOrderId}
                  onChangeStatusPreparing={handleStatusPreparing}
                  onChangeStatusReadyForPickup={handleStatusReady}
                />
              </div>
            </TabsContent>

            <TabsContent value="lookup" className="mt-4 min-h-0 flex-1">
              <div className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#E8DFD6] p-4">
                    <div className="text-sm font-semibold text-[#3E2723]">
                      By Code
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={lookupCode}
                        onChange={(e) => setLookupCode(e.target.value)}
                        placeholder="ORDER_ABC123..."
                      />
                      <Button
                        onClick={() => void runLookupByCode()}
                        disabled={!lookupCode.trim() || !canViewOrders}
                        className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                      >
                        Fetch
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E8DFD6] p-4">
                    <div className="text-sm font-semibold text-[#3E2723]">
                      By Order ID
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={lookupOrderId}
                        onChange={(e) => setLookupOrderId(e.target.value)}
                        placeholder="69b9..."
                      />
                      <Button
                        onClick={() => void runLookupById()}
                        disabled={!lookupOrderId.trim() || !canViewOrders}
                        className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                      >
                        Fetch
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E8DFD6] p-4">
                    <div className="text-sm font-semibold text-[#3E2723]">
                      By Cart ID
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={lookupCartId}
                        onChange={(e) => setLookupCartId(e.target.value)}
                        placeholder="69ba..."
                      />
                      <Button
                        onClick={() => void runLookupByCart()}
                        disabled={!lookupCartId.trim() || !canViewOrders}
                        className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                      >
                        Fetch
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E8DFD6] p-4">
                    <div className="text-sm font-semibold text-[#3E2723]">
                      By Customer ID
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                      <Input
                        value={lookupCustomerId}
                        onChange={(e) => setLookupCustomerId(e.target.value)}
                        placeholder="699e..."
                        className="md:col-span-2"
                      />
                      <PopoverSearchSelect
                        value={lookupCustomerStatus}
                        onValueChange={(v) =>
                          setLookupCustomerStatus(v as StatusFilter)
                        }
                        options={statusOptions}
                        placeholder="Status"
                      />
                      <Button
                        onClick={() => void runLookupByCustomer()}
                        disabled={!lookupCustomerId.trim() || !canViewOrders}
                        className="bg-[#6D4C41] text-white hover:bg-[#5D4037] md:col-span-3"
                      >
                        Fetch Orders
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1">
                  <OrdersTable
                    orders={enrichedLookupResults}
                    isLoading={lookupIsLoading}
                    error={lookupError}
                    onRetry={() => {
                      // retry the most recent lookup that has an error
                      if (orderByCodeQuery.error) return void orderByCodeQuery.refetch();
                      if (orderByIdQuery.error) return void orderByIdQuery.refetch();
                      if (orderByCartQuery.error)
                        return void orderByCartQuery.refetch();
                      if (ordersByCustomerQuery.error)
                        return void ordersByCustomerQuery.refetch();
                    }}
                    canManageOrders={canManageOrders}
                    pendingOrderId={pendingOrderId}
                    onChangeStatusPreparing={handleStatusPreparing}
                    onChangeStatusReadyForPickup={handleStatusReady}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
