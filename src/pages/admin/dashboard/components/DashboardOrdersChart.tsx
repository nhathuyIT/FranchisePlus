import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardOrderStatus } from "@/types/dashboard.type";
import { formatCount, type DashboardStatusDatum } from "../dashboard.utils";

interface DashboardOrdersChartProps {
  data: DashboardStatusDatum<DashboardOrderStatus>[];
  totalOrders: number;
  scopeLabel: string;
}

export const DashboardOrdersChart = ({
  data,
  totalOrders,
  scopeLabel,
}: DashboardOrdersChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="rounded-[32px] border border-[#EADFD3] bg-white p-6 shadow-[0_24px_50px_rgba(84,54,42,0.08)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#2E1A13]">
            Orders by Status
          </h2>
          <p className="mt-2 text-sm text-[#826856]">
            Live processing mix for {scopeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#F7F0E4] px-3 py-1 text-xs font-semibold text-[#785D4E]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3E2723]" />
          {formatCount(totalOrders)} total orders
        </div>
      </div>

      <div className="mt-6 h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 28, left: 8, bottom: 4 }}
            barCategoryGap={18}
          >
            <XAxis type="number" hide domain={[0, maxValue]} />
            <YAxis
              dataKey="label"
              type="category"
              width={144}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5A4335", fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: "#FCF4E8" }}
              formatter={(value) => [formatCount(Number(value ?? 0)), "Orders"]}
              labelStyle={{ color: "#3E2723", fontWeight: 600 }}
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid #E8DBCA",
                background: "#FFFDF8",
                boxShadow: "0 18px 40px rgba(62, 39, 35, 0.08)",
              }}
            />
            <Bar
              dataKey="value"
              radius={[999, 999, 999, 999]}
              background={{ fill: "#F2E9DE", radius: 999 }}
              barSize={14}
            >
              {data.map((item) => (
                <Cell key={item.key} fill={item.fill} />
              ))}
              <LabelList
                dataKey="valueLabel"
                position="right"
                offset={10}
                fill="#3E2723"
                fontSize={12}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
