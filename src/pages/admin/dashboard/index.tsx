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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DashboardDeliveryStatus as DashboardDeliveryKey,
  DashboardOrderStatus,
  DashboardPaymentStatus,
} from "@/types/dashboard.type";
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
import {
  DashboardSummaryCards,
  type DashboardSummaryCardItem,
} from "./components/DashboardSummaryCards";
import {
  DELIVERY_STATUS_META,
  formatCount,
  formatSummaryValue,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
} from "./dashboard.utils";

interface StatusChartDatum {
  label: string;
  value: number;
  fill: string;
}

interface OverviewChartDatum {
  name: string;
  total: number;
  mapped: number;
  fill: string;
}

interface StatusChartCardProps {
  title: string;
  description: string;
  data: StatusChartDatum[];
  height: number;
}

const ORDER_STATUS_SEQUENCE: DashboardOrderStatus[] = [
  "DRAFT",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELED",
];

const PAYMENT_STATUS_SEQUENCE: DashboardPaymentStatus[] = [
  "PAID",
  "PENDING",
  "REFUNDED",
  "FAILED",
];

const DELIVERY_STATUS_SEQUENCE: DashboardDeliveryKey[] = [
  "ASSIGNED",
  "PICKING_UP",
  "DELIVERED",
];

const tooltipContentStyle = {
  borderRadius: "18px",
  border: "1px solid #E8DBCA",
  background: "#FFFDF8",
  boxShadow: "0 18px 40px rgba(62, 39, 35, 0.08)",
};

const axisTickStyle = {
  fill: "#5A4335",
  fontSize: 12,
  fontWeight: 600,
};

const StatusChartCard = ({
  title,
  description,
  data,
  height,
}: StatusChartCardProps) => {
  return (
    <section className="rounded-[32px] border border-[#EADFD3] bg-white p-6 shadow-[0_24px_50px_rgba(84,54,42,0.08)] sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#2E1A13]">{title}</h2>
        <p className="mt-2 text-sm text-[#826856]">{description}</p>
      </div>

      <div className="mt-6 rounded-[28px] bg-[#FCF7F0] p-4 sm:p-5">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
              barCategoryGap={18}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#EDE1D4"
                strokeDasharray="4 4"
              />
              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={axisTickStyle}
              />
              <YAxis
                dataKey="label"
                type="category"
                width={132}
                axisLine={false}
                tickLine={false}
                tick={axisTickStyle}
              />
              <Tooltip
                formatter={(value) => [formatCount(Number(value ?? 0)), "Count"]}
                labelStyle={{ color: "#3E2723", fontWeight: 600 }}
                contentStyle={tooltipContentStyle}
              />
              <Bar dataKey="value" radius={[999, 999, 999, 999]} barSize={18}>
                {data.map((item) => (
                  <Cell key={item.label} fill={item.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`top-chart-skeleton-${index}`}
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

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`bottom-chart-skeleton-${index}`}
            className="rounded-[32px] border border-[#EADFD3] bg-white p-8"
          >
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-3 h-4 w-52 max-w-full" />
            <div className="mt-6 rounded-[28px] bg-[#FCF7F0] p-5">
              <Skeleton className="h-[260px] w-full rounded-[24px]" />
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

  const overviewChartData = useMemo<OverviewChartDatum[]>(() => {
    if (!dashboard) {
      return [];
    }

    return [
      {
        name: "Users",
        total: dashboard.countUsers,
        mapped: dashboard.countUserFranchises,
        fill: "#4A2C23",
      },
      {
        name: "Customers",
        total: dashboard.countCustomers,
        mapped: dashboard.countCustomerFranchises,
        fill: "#A95B24",
      },
      {
        name: "Products",
        total: dashboard.countProducts,
        mapped: dashboard.countProductFranchises,
        fill: "#D1A451",
      },
    ];
  }, [dashboard]);

  const orderStatusChartData = useMemo<StatusChartDatum[]>(() => {
    if (!dashboard) {
      return [];
    }

    return ORDER_STATUS_SEQUENCE.map((status) => ({
      label: ORDER_STATUS_META[status].label,
      value: dashboard.countOrders[status],
      fill: ORDER_STATUS_META[status].fill,
    }));
  }, [dashboard]);

  const paymentStatusChartData = useMemo<StatusChartDatum[]>(() => {
    if (!dashboard) {
      return [];
    }

    return PAYMENT_STATUS_SEQUENCE.map((status) => ({
      label: PAYMENT_STATUS_META[status].label,
      value: dashboard.countPayments[status],
      fill: PAYMENT_STATUS_META[status].fill,
    }));
  }, [dashboard]);

  const deliveryStatusChartData = useMemo<StatusChartDatum[]>(() => {
    if (!dashboard) {
      return [];
    }

    return DELIVERY_STATUS_SEQUENCE.map((status) => ({
      label: DELIVERY_STATUS_META[status].label,
      value: dashboard.countDeliveries[status],
      fill: DELIVERY_STATUS_META[status].fill,
    }));
  }, [dashboard]);

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
            Visual summary of dashboard counts returned directly from the
            current API scope.
          </p>

          {activeDashboardQuery.isFetching && dashboard ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F7EAD8] px-3 py-1 text-xs font-semibold text-[#7C624F]">
              <span className="h-2 w-2 rounded-full bg-[#C27A2D]" />
              Refreshing snapshot...
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
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

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
            <section className="rounded-[32px] border border-[#EADFD3] bg-white p-6 shadow-[0_24px_50px_rgba(84,54,42,0.08)] sm:p-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#2E1A13]">
                  Overview Composition
                </h2>
                <p className="mt-2 text-sm text-[#826856]">
                  Compare the primary counts and franchise-linked counts returned
                  by the selected dashboard scope.
                </p>
              </div>

              <div className="mt-6 rounded-[28px] bg-[#FCF7F0] p-4 sm:p-5">
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={overviewChartData}
                      margin={{ top: 12, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="#EDE1D4"
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={axisTickStyle}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={axisTickStyle}
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatCount(Number(value ?? 0)),
                          "Count",
                        ]}
                        labelStyle={{ color: "#3E2723", fontWeight: 600 }}
                        contentStyle={tooltipContentStyle}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: 8 }}
                        formatter={(value) => (
                          <span className="text-sm text-[#6B4C3B]">{value}</span>
                        )}
                      />
                      <Bar
                        dataKey="total"
                        name="Primary Count"
                        radius={[16, 16, 0, 0]}
                        barSize={44}
                      >
                        {overviewChartData.map((item) => (
                          <Cell key={item.name} fill={item.fill} />
                        ))}
                      </Bar>
                      <Line
                        type="monotone"
                        dataKey="mapped"
                        name="Franchise Links"
                        stroke="#C97F32"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#C97F32" }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <StatusChartCard
              title="Orders by Status"
              description="Raw order status counts returned from the dashboard API."
              data={orderStatusChartData}
              height={320}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <StatusChartCard
              title="Payments by Status"
              description="Payment status distribution from the current dashboard scope."
              data={paymentStatusChartData}
              height={260}
            />

            <StatusChartCard
              title="Deliveries by Status"
              description="Delivery status distribution from the current dashboard scope."
              data={deliveryStatusChartData}
              height={260}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardPage;
