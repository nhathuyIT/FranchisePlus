import type { DashboardPaymentStatus } from "@/types/dashboard.type";
import {
  formatCount,
  formatPercent,
  type DashboardStatusDatum,
} from "../dashboard.utils";
import { DashboardStatusDonutCard } from "./DashboardStatusDonutCard";

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
  const paidPayments = data.find((item) => item.key === "PAID")?.value ?? 0;
  const paymentsToReview = Math.max(totalPayments - paidPayments, 0);

  return (
    <DashboardStatusDonutCard
      title="Payment Status"
      description="Revenue collection distribution"
      data={data}
      total={totalPayments}
      totalLabel={`${formatCount(totalPayments)} total payments`}
      centerValue={formatPercent(paidRate)}
      centerLabel="Paid share"
      tooltipLabel="Payments"
      legendColumns={2}
      summary={[
        {
          label: "Paid payments",
          value: formatCount(paidPayments),
        },
        {
          label: "Needs review",
          value: formatCount(paymentsToReview),
        },
      ]}
    />
  );
};
