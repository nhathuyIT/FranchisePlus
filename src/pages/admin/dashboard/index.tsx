import { startTransition, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Filter,
  Link2,
  Package,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDashboardAll,
  useDashboardByFranchise,
} from "@/hooks/dashboard/useDashboard.hooks";
import { useFranchiseSelect } from "@/hooks/franchise";
import { useAuthStore } from "@/stores/auth-store";
import { DashboardDeliveryStatus } from "./components/DashboardDeliveryStatus";
import { DashboardOrdersChart } from "./components/DashboardOrdersChart";
import { DashboardPaymentChart } from "./components/DashboardPaymentChart";
import {
  DashboardSummaryCards,
  type DashboardSummaryCardItem,
} from "./components/DashboardSummaryCards";
import {
  formatCount,
  formatSummaryValue,
  sumCounts,
  toDeliveryStatusData,
  toOrderStatusData,
  toPaymentStatusData,
} from "./dashboard.utils";

const DashboardLoadingState = () => {
  return (
    <div className="space-y-6 pb-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`summary-skeleton-${index}`}
            className="rounded-[28px] border border-[#EADFD3] bg-white p-6"
          >
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="mt-8 h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-28" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`chart-skeleton-${index}`}
            className="rounded-[32px] border border-[#EADFD3] bg-white p-8"
          >
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-3 h-4 w-64 max-w-full" />
            <div className="mt-6 rounded-[28px] bg-[#FCF7F0] p-5">
              <Skeleton className="h-[320px] w-full rounded-[24px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const currentFranchiseId = authUser?.currentFranchiseId ?? "";
  const [selectedFranchiseId, setSelectedFranchiseId] =
    useState(currentFranchiseId);

  const { data: franchiseOptions = [] } = useFranchiseSelect();
  const currentFranchiseName =
    authUser?.franchiseRoles?.find(
      (role) => role.franchiseId === currentFranchiseId,
    )?.franchiseName ?? "Current Franchise";

  const accessibleFranchiseOptions = useMemo(() => {
    if (isAdmin) {
      return franchiseOptions;
    }

    if (!currentFranchiseId) {
      return [];
    }

    const matchedOption = franchiseOptions.find(
      (option) => option.value === currentFranchiseId,
    );

    if (matchedOption) {
      return [matchedOption];
    }

    return [
      {
        value: currentFranchiseId,
        code: "CURRENT",
        name: currentFranchiseName,
      },
    ];
  }, [currentFranchiseId, currentFranchiseName, franchiseOptions, isAdmin]);

  const effectiveFranchiseId = isAdmin
    ? selectedFranchiseId
    : currentFranchiseId;

  const allDashboardQuery = useDashboardAll(isAdmin && !effectiveFranchiseId);
  const franchiseDashboardQuery = useDashboardByFranchise(
    effectiveFranchiseId,
    Boolean(effectiveFranchiseId),
  );

  const activeDashboardQuery = effectiveFranchiseId
    ? franchiseDashboardQuery
    : allDashboardQuery;
  const dashboard = activeDashboardQuery.data;
  const isInitialLoading =
    activeDashboardQuery.isLoading && !activeDashboardQuery.data;
  const error =
    activeDashboardQuery.error instanceof Error
      ? activeDashboardQuery.error
      : null;

  const selectedFranchise =
    accessibleFranchiseOptions.find(
      (option) => option.value === effectiveFranchiseId,
    ) ?? null;
  const selectedScopeFranchiseName =
    authUser?.franchiseRoles?.find(
      (role) => role.franchiseId === effectiveFranchiseId,
    )?.franchiseName ?? currentFranchiseName;
  const scopeLabel = effectiveFranchiseId
    ? (selectedFranchise?.name ?? selectedScopeFranchiseName)
    : "All Franchises";
  const franchiseScopeDisplay = selectedFranchise
    ? selectedFranchise.code === "CURRENT"
      ? selectedFranchise.name
      : `${selectedFranchise.name} (${selectedFranchise.code})`
    : selectedScopeFranchiseName;

  useEffect(() => {
    document.title = `Admin Dashboard | ${scopeLabel}`;
  }, [scopeLabel]);

  const orderStatusChartData = useMemo(
    () => (dashboard ? toOrderStatusData(dashboard.countOrders) : []),
    [dashboard],
  );

  const paymentStatusChartData = useMemo(
    () => (dashboard ? toPaymentStatusData(dashboard.countPayments) : []),
    [dashboard],
  );

  const deliveryStatusChartData = useMemo(
    () => (dashboard ? toDeliveryStatusData(dashboard.countDeliveries) : []),
    [dashboard],
  );

  const totalOrders = dashboard ? sumCounts(dashboard.countOrders) : 0;
  const totalPayments = dashboard ? sumCounts(dashboard.countPayments) : 0;
  const totalDeliveries = dashboard ? sumCounts(dashboard.countDeliveries) : 0;
  const paidRate =
    totalPayments > 0 ? (dashboard?.countPayments.PAID ?? 0) / totalPayments : 0;
  const activeDeliveries = dashboard
    ? dashboard.countDeliveries.ASSIGNED + dashboard.countDeliveries.PICKING_UP
    : 0;
  const deliveredRate =
    totalDeliveries > 0
      ? (dashboard?.countDeliveries.DELIVERED ?? 0) / totalDeliveries
      : 0;

  const summaryCards: DashboardSummaryCardItem[] = dashboard
    ? [
        {
          title: "Total Users",
          value: formatSummaryValue(dashboard.countUsers),
          subtitle: "Internal admin, manager, and staff accounts tracked.",
          badge: "People",
          icon: Users,
        },
        {
          title: "User-Franchise Links",
          value: formatCount(dashboard.countUserFranchises),
          subtitle: "Assignments connecting internal users to franchise scope.",
          badge: "Mapping",
          icon: Building2,
          badgeClassName: "bg-[#EFE7D7] text-[#654B3E]",
        },
        {
          title: "Total Customers",
          value: formatSummaryValue(dashboard.countCustomers),
          subtitle:
            "Customer records visible inside the current dashboard view.",
          badge: "Reach",
          icon: UserRound,
          badgeClassName: "bg-[#FBE8D7] text-[#A7541E]",
        },
        {
          title: "Customer-Franchise Links",
          value: formatCount(dashboard.countCustomerFranchises),
          subtitle: "Relationships between customers and franchise activity.",
          badge: "Links",
          icon: Link2,
          badgeClassName: "bg-[#F4E4E1] text-[#A44F44]",
        },
        {
          title: "Total Products",
          value: formatCount(dashboard.countProducts),
          subtitle: "Distinct catalog items available in the current scope.",
          badge: "Catalog",
          icon: Package,
          badgeClassName: "bg-[#F7E9C7] text-[#8B6400]",
        },
        {
          title: "Product-Franchise Links",
          value: formatCount(dashboard.countProductFranchises),
          subtitle: "Catalog placements across franchise operating units.",
          badge: "Coverage",
          icon: Store,
          badgeClassName: "bg-[#F8E8D5] text-[#8B4F1C]",
        },
      ]
    : [];

  const handleFranchiseChange = (value: string) => {
    if (!isAdmin) {
      return;
    }

    const nextFranchiseId = value === "all" ? "" : value;

    startTransition(() => {
      setSelectedFranchiseId(nextFranchiseId);
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto pr-1 scroll-y-auto scrollbar-hide">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7B62]">
            Analytics overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#3E2723] sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6B4C3B] sm:text-base">
            Operational snapshot of counts and status distribution for orders,
            payments, and deliveries in the current API scope.
          </p>

          {activeDashboardQuery.isFetching && dashboard ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F7EAD8] px-3 py-1 text-xs font-semibold text-[#7C624F]">
              <span className="h-2 w-2 rounded-full bg-[#C27A2D]" />
              Refreshing snapshot...
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:pt-2">
          {isAdmin ? (
            <Select
              value={effectiveFranchiseId || "all"}
              onValueChange={handleFranchiseChange}
            >
              <SelectTrigger className="h-12 min-w-[220px] rounded-full border-[#E6D8C9] bg-[#F6E2AA] px-4 text-sm font-semibold text-[#4A2C23] shadow-none focus:border-[#C97F32]">
                <Filter className="h-4 w-4 text-[#6D4C41]" />
                <SelectValue placeholder="Select franchise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Franchises</SelectItem>
                {accessibleFranchiseOptions.map((franchise) => (
                  <SelectItem key={franchise.value} value={franchise.value}>
                    {franchise.code === "CURRENT"
                      ? franchise.name
                      : `${franchise.name} (${franchise.code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex min-w-[220px] items-center gap-3 rounded-full border border-[#E6D8C9] bg-[#F6E2AA] px-4 py-3 text-[#4A2C23] shadow-[0_12px_24px_rgba(84,54,42,0.08)]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/65">
                <Building2 className="h-4 w-4 text-[#6D4C41]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A6B59]">
                  Franchise Scope
                </p>
                <p className="truncate text-sm font-semibold text-[#4A2C23]">
                  {franchiseScopeDisplay}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isInitialLoading ? (
        <DashboardLoadingState />
      ) : error ? (
        <div className="rounded-[32px] border border-[#E7D5C6] bg-white p-8 shadow-[0_20px_40px_rgba(84,54,42,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7E4E1] text-[#A44F44]">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-[#2E1A13]">
                  Dashboard data could not be loaded
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F5646]">
                  {error.message ||
                    "Please retry the request or check the API response for the dashboard endpoint."}
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                void activeDashboardQuery.refetch();
              }}
              className="rounded-full bg-[#4A2C23] px-5 text-white hover:bg-[#362019]"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : dashboard ? (
        <div className="space-y-6 pb-4">
          <DashboardSummaryCards cards={summaryCards} />

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div className="lg:col-span-2 xl:col-span-1">
              <DashboardOrdersChart
                data={orderStatusChartData}
                totalOrders={totalOrders}
                scopeLabel={scopeLabel}
              />
            </div>

            <DashboardPaymentChart
              data={paymentStatusChartData}
              totalPayments={totalPayments}
              paidRate={paidRate}
            />

            <DashboardDeliveryStatus
              data={deliveryStatusChartData}
              totalDeliveries={totalDeliveries}
              activeDeliveries={activeDeliveries}
              deliveredRate={deliveredRate}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardPage;
