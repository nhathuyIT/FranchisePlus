import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardPaymentStatus } from "@/types/dashboard.type";
import {
  formatCount,
  formatPercent,
  type DashboardStatusDatum,
} from "../dashboard.utils";

interface DashboardPaymentChartProps {
  data: DashboardStatusDatum<DashboardPaymentStatus>[];
  totalPayments: number;
  paidRate: number;
}

export const DashboardPaymentChart = ({
  data,
  totalPayments,
  paidRate,
}: DashboardPaymentChartProps) => {
  const hasPaymentData = totalPayments > 0;
  const chartData = hasPaymentData
    ? data.filter((item) => item.value > 0)
    : [
        {
          key: "EMPTY" as DashboardPaymentStatus,
          label: "No payment data",
          value: 1,
          fill: "#E9DDCF",
          share: 1,
          valueLabel: "0",
        },
      ];

  return (
    <section className="rounded-[32px] border border-[#EADFD3] bg-white p-6 shadow-[0_24px_50px_rgba(84,54,42,0.08)] sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#2E1A13]">
          Payments Status
        </h2>
        <p className="mt-2 text-sm text-[#826856]">
          Revenue collection distribution
        </p>
      </div>

      <div className="relative mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value) => [formatCount(Number(value ?? 0)), "Count"]}
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

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold text-[#261611]">
            {formatPercent(paidRate)}
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#856B5B]">
            {hasPaymentData ? "Paid share" : "No data"}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-2xl bg-[#FCF6EE] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium text-[#4A2C23]">
                {item.label}
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-[#2E1A13]">
                {item.valueLabel}
              </p>
              <p className="text-xs text-[#8A715F]">
                {hasPaymentData ? formatPercent(item.share) : "0%"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
