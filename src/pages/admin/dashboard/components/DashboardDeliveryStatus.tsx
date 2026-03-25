import type { DashboardDeliveryStatus as DashboardDeliveryKey } from "@/types/dashboard.type";
import {
  formatCount,
  formatPercent,
  type DashboardStatusDatum,
} from "../dashboard.utils";
import { DashboardStatusDonutCard } from "./DashboardStatusDonutCard";

interface DashboardDeliveryStatusProps {
  data: DashboardStatusDatum<DashboardDeliveryKey>[];
  totalDeliveries: number;
  activeDeliveries: number;
  deliveredRate: number;
}

export const DashboardDeliveryStatus = ({
  data,
  totalDeliveries,
  activeDeliveries,
  deliveredRate,
}: DashboardDeliveryStatusProps) => {
  const deliveredCount = data.find((item) => item.key === "DELIVERED")?.value ?? 0;

  return (
    <DashboardStatusDonutCard
      title="Deliveries Status"
      description="Dispatch flow for current workload"
      data={data}
      total={totalDeliveries}
      totalLabel={`${formatCount(totalDeliveries)} total deliveries`}
      centerValue={formatPercent(deliveredRate)}
      centerLabel="Delivered share"
      tooltipLabel="Deliveries"
      legendColumns={2}
      summary={[
        {
          label: "In motion",
          value: formatCount(activeDeliveries),
        },
        {
          label: "Delivered",
          value: formatCount(deliveredCount),
        },
      ]}
    />
  );
};
