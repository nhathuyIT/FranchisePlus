import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminOrderStatus } from "../models/order-management.type";
import {
  getOrderProgressState,
  ORDER_PROGRESS_STEPS,
} from "../utils/order-management.utils";

interface OrderStatusTimelineProps {
  status: AdminOrderStatus;
}

const ACTIVE_STEP_STYLES: Record<
  Exclude<AdminOrderStatus, "DRAFT" | "CANCELED">,
  {
    accent: string;
    softBg: string;
    border: string;
  }
> = {
  CONFIRMED: {
    accent: "#7C5A2F",
    softBg: "#F9EFE1",
    border: "#E7D7C1",
  },
  PREPARING: {
    accent: "#A36312",
    softBg: "#FFF3DF",
    border: "#F1DFC1",
  },
  READY_FOR_PICKUP: {
    accent: "#245F8F",
    softBg: "#EAF5FF",
    border: "#CFE4F7",
  },
  OUT_FOR_DELIVERY: {
    accent: "#155AA8",
    softBg: "#E8F1FF",
    border: "#CFE0F8",
  },
  COMPLETED: {
    accent: "#1E7A3F",
    softBg: "#EAF8EF",
    border: "#CEE6D5",
  },
};

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  if (status === "CANCELED") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-[#F2D1CC] bg-[#FDECEC] px-4 py-4 text-sm text-[#9B2C2C]">
        <AlertCircle className="mt-0.5 h-4 w-4" />
        <div>
          <p className="font-semibold">Order canceled</p>
          <p className="mt-1">
            This order is no longer in the delivery lifecycle, so the status timeline is closed.
          </p>
        </div>
      </div>
    );
  }

  const activeStyle = ACTIVE_STEP_STYLES[
    (status === "DRAFT" ? "CONFIRMED" : status) as Exclude<
      AdminOrderStatus,
      "DRAFT" | "CANCELED"
    >
  ];
  const activeIndex = ORDER_PROGRESS_STEPS.findIndex(
    (step) => step.status === status,
  );
  const progressPercent =
    activeIndex <= 0
      ? 0
      : (activeIndex / (ORDER_PROGRESS_STEPS.length - 1)) * 100;

  return (
    <>
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-[10%] right-[10%] top-5 h-[2px] rounded-full bg-[#E9E2D8]" />
          <div className="absolute left-[10%] right-[10%] top-5 h-[2px] rounded-full">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: activeStyle.accent,
              }}
            />
          </div>

          <div className="relative grid gap-3 md:grid-cols-5">
            {ORDER_PROGRESS_STEPS.map((step, index) => {
              const state = getOrderProgressState(status, step.status);

              return (
                <div key={step.status} className="text-center">
                  <div
                    className={cn(
                      "mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-150 ease-out",
                      state === "completed" &&
                        "border-[#B7D8C1] bg-[#F4FBF6] text-[#1E7A3F]",
                      state === "upcoming" &&
                        "border-[#E4DBD0] bg-white text-[#8B7B68]",
                      state === "active" && "scale-100 shadow-sm",
                    )}
                    style={
                      state === "active"
                        ? {
                            backgroundColor: activeStyle.softBg,
                            borderColor: activeStyle.border,
                            color: activeStyle.accent,
                          }
                        : undefined
                    }
                  >
                    {state === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#2F2419]">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xs text-[#7B6A57]">
                    {state === "completed"
                      ? "Done"
                      : state === "active"
                        ? "Current step"
                        : "Waiting"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:hidden">
        {ORDER_PROGRESS_STEPS.map((step, index) => {
          const state = getOrderProgressState(status, step.status);

          return (
            <div
              key={step.status}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors duration-150 ease-out",
                state === "completed" &&
                  "border-[#B7D8C1] bg-[#F4FBF6] text-[#1E7A3F]",
                state === "upcoming" &&
                  "border-[#E4DBD0] bg-white text-[#8B7B68]",
              )}
              style={
                state === "active"
                  ? {
                      backgroundColor: activeStyle.softBg,
                      borderColor: activeStyle.border,
                      color: activeStyle.accent,
                    }
                  : undefined
              }
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-semibold">
                {index + 1}
              </span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
