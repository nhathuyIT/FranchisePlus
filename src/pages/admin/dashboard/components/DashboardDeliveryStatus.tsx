import { Truck } from "lucide-react";
import type { DashboardDeliveryStatus as DashboardDeliveryKey } from "@/types/dashboard.type";
import {
  formatCount,
  formatPercent,
  type DashboardStatusDatum,
} from "../dashboard.utils";

interface DashboardDeliveryStatusProps {
  data: DashboardStatusDatum<DashboardDeliveryKey>[];
  activeDeliveries: number;
  deliveredRate: number;
}

export const DashboardDeliveryStatus = ({
  data,
  activeDeliveries,
  deliveredRate,
}: DashboardDeliveryStatusProps) => {
  return (
    <section className="rounded-[32px] bg-[#3A2018] p-6 text-white shadow-[0_28px_56px_rgba(62,39,35,0.25)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFB703]/15 text-[#FFB703]">
          <Truck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Deliveries Status</h2>
          <p className="mt-1 text-sm text-white/60">
            Dispatch flow for current workload
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div key={item.key}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-white/80">{item.label}</span>
              <span className="font-semibold text-white">{item.valueLabel}</span>
            </div>

            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${item.value === 0 ? 0 : Math.max(item.share * 100, 10)}%`,
                  backgroundColor: item.fill,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] bg-white/8 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
            Active deliveries
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCount(activeDeliveries)}
          </p>
        </div>

        <div className="rounded-[24px] bg-white/8 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
            Delivered rate
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatPercent(deliveredRate)}
          </p>
        </div>
      </div>
    </section>
  );
};
