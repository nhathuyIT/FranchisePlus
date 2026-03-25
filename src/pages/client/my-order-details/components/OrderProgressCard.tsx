import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AdminOrderStatus } from "@/pages/admin/orders/models/order-management.type";
import {
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS_META,
  getOrderProgressState,
} from "../order-detail.utils";

interface OrderProgressCardProps {
  status: AdminOrderStatus;
}

const PROGRESS_COPY: Record<AdminOrderStatus, string> = {
  DRAFT:
    "The order is waiting for store confirmation before moving into production.",
  CONFIRMED:
    "Confirmation is complete and the store is lining up the next action.",
  PREPARING:
    "Production is underway. Item snapshots below represent the exact order content.",
  READY_FOR_PICKUP:
    "Everything is ready. The order can be picked up or handed to the delivery flow.",
  OUT_FOR_DELIVERY:
    "The delivery stage is active. Keep an eye on your phone for contact attempts.",
  COMPLETED:
    "Every stage has been completed. This page remains as your final receipt.",
  CANCELED:
    "The order stopped before completion. The progress trail stays visible for reference.",
};

const getStepCaption = (state: ReturnType<typeof getOrderProgressState>) => {
  if (state === "completed") {
    return "Done";
  }

  if (state === "active") {
    return "Current";
  }

  if (state === "canceled") {
    return "Stopped";
  }

  return "Upcoming";
};

export function OrderProgressCard({ status }: OrderProgressCardProps) {
  const currentStatusMeta = ORDER_STATUS_META[status];
  const isCanceledOrder = status === "CANCELED";
  const currentIndex = ORDER_PROGRESS_STEPS.findIndex(
    (step) => step.status === status,
  );

  return (
    <section className="rounded-3xl border border-[#E9DED3] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.35)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7B67]">
            Fulfillment Progress
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#3E2723]">
            Where this order stands
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6D4C41]">
            {PROGRESS_COPY[status]}
          </p>
        </div>

        <Badge variant="outline" className={currentStatusMeta.badgeClassName}>
          {currentStatusMeta.label}
        </Badge>
      </div>

      <div
        className={cn(
          "mt-6 rounded-[24px] border px-6 py-7",
          isCanceledOrder
            ? "border-rose-200 bg-rose-50/80"
            : "border-emerald-200 bg-[#EEF8F0]",
        )}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="grid min-w-[760px] grid-cols-5 gap-0">
            {ORDER_PROGRESS_STEPS.map((step, index) => {
              const state = getOrderProgressState(status, step.status);
              const isDone = state === "completed";
              const isActive = state === "active";
              const isUpcoming = state === "upcoming";
              const isCanceled = state === "canceled";
              const showFilledLine = !isCanceledOrder && currentIndex > index;

              return (
                <div key={step.status} className="relative px-3">
                  {index < ORDER_PROGRESS_STEPS.length - 1 ? (
                    <span
                      className={cn(
                        "absolute left-1/2 right-[-50%] top-[22px] h-[2px]",
                        isCanceled
                          ? "bg-rose-300"
                          : showFilledLine
                            ? "bg-emerald-700"
                            : "bg-[#C8DCCB]",
                      )}
                    />
                  ) : null}

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold shadow-[0_4px_12px_-8px_rgba(37,99,69,0.35)]",
                        isCanceled && "border-rose-300 bg-white text-rose-600",
                        isDone &&
                          "border-emerald-300 bg-white text-emerald-700",
                        isActive &&
                          "border-emerald-300 bg-[#F8FCF8] text-emerald-700",
                        isUpcoming &&
                          "border-[#D4E4D5] bg-white text-[#8AA08C]",
                      )}
                    >
                      {isDone ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </span>

                    <p className="mt-4 text-[15px] font-semibold text-[#2F241F]">
                      {step.label}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        isCanceled
                          ? "text-rose-700"
                          : isUpcoming
                            ? "text-[#78907A]"
                            : "text-[#6D4C41]",
                      )}
                    >
                      {getStepCaption(state)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
