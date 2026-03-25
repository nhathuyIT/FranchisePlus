import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import {
  formatCount,
  type DashboardStatusDatum,
} from "../dashboard.utils";

interface DashboardStatusSummaryItem {
  label: string;
  value: string;
}

interface DashboardStatusDonutCardProps {
  title: string;
  description: string;
  data: ReadonlyArray<DashboardStatusDatum<string>>;
  total: number;
  totalLabel: string;
  centerValue: string;
  centerLabel: string;
  tooltipLabel?: string;
  emptyLabel?: string;
  legendColumns?: 1 | 2;
  summary?: ReadonlyArray<DashboardStatusSummaryItem>;
  className?: string;
}

const EMPTY_STATUS_FILL = "#E9DDCF";

export const DashboardStatusDonutCard = ({
  title,
  description,
  data,
  total,
  totalLabel,
  centerValue,
  centerLabel,
  tooltipLabel = "Count",
  emptyLabel = "No data",
  legendColumns = 1,
  summary = [],
  className,
}: DashboardStatusDonutCardProps) => {
  const hasData = total > 0;
  const chartData = hasData
    ? data.filter((item) => item.value > 0)
    : [
        {
          key: "__EMPTY__",
          label: emptyLabel,
          value: 1,
          fill: EMPTY_STATUS_FILL,
          share: 1,
          valueLabel: "0",
        },
      ];

  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-[32px] border border-[#EADFD3] bg-white p-6 shadow-[0_24px_50px_rgba(84,54,42,0.08)] sm:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-[#2E1A13]">{title}</h2>
          <p className="mt-2 text-sm text-[#826856]">{description}</p>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#F7F0E4] px-3 py-1 text-xs font-semibold text-[#785D4E]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3E2723]" />
          {totalLabel}
        </div>
      </div>

      <div className="relative mt-5 h-[250px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value) => [
                formatCount(Number(value ?? 0)),
                tooltipLabel,
              ]}
              labelStyle={{ color: "#3E2723", fontWeight: 600 }}
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid #E8DBCA",
                background: "#FFFDF8",
                boxShadow: "0 18px 40px rgba(62, 39, 35, 0.08)",
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={72}
              outerRadius={96}
              paddingAngle={2}
              cornerRadius={8}
              stroke="#FCF7F0"
              strokeWidth={4}
            >
              {chartData.map((item) => (
                <Cell key={item.key} fill={item.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-4xl font-semibold text-[#261611]">
            {centerValue}
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#856B5B]">
            {hasData ? centerLabel : "No data"}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "mt-5 grid gap-3",
          legendColumns === 2 && "sm:grid-cols-2",
        )}
      >
        {data.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-2xl bg-[#FCF6EE] px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate text-sm font-medium text-[#4A2C23]">
                {item.label}
              </span>
            </div>

            <div className="ml-3 shrink-0 text-right">
              <p className="text-sm font-semibold text-[#2E1A13]">
                {item.valueLabel}
              </p>
              <p className="text-xs text-[#8A715F]">
                {hasData ? `${Math.round(item.share * 100)}%` : "0%"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {summary.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {summary.map((item) => (
            <div key={item.label} className="rounded-[24px] bg-[#F8F1E6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6B59]">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#2E1A13]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
