import { AlertCircle, Clock3, Hash, RefreshCcw, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminOrderStatus } from "../models/order-management.type";
import { formatDateTime } from "../utils/order-management.utils";
import { OrderStatusTimeline } from "./OrderStatusTimeline";

interface DeliveryBoxProps {
  status: AdminOrderStatus;
  deliveryId?: string;
  assignedToName?: string | null;
  assignedToEmail?: string | null;
  assignedAt?: string | null;
  deliveryError: Error | null;
  deliveryActionMessage: string;
  isMutating: boolean;
  isRefreshing: boolean;
  canMoveToPreparing: boolean;
  canReadyForPickup: boolean;
  canPickupDelivery: boolean;
  canCompleteDelivery: boolean;
  onRefresh: () => void;
  onMoveToPreparing: () => void;
  onReadyForPickup: () => void;
  onPickupDelivery: () => void;
  onCompleteDelivery: () => void;
}

type DeliveryTone = {
  label: string;
  accent: string;
  softBg: string;
  softBorder: string;
  badgeClassName: string;
  actionClassName: string;
  actionLabel: string;
  actionDescription: string;
};

const DELIVERY_TONES: Record<AdminOrderStatus, DeliveryTone> = {
  DRAFT: {
    label: "Waiting for confirmation",
    accent: "#8B7B68",
    softBg: "#F7F3EE",
    softBorder: "#E9E2D8",
    badgeClassName: "border-[#E9E2D8] bg-[#F7F3EE] text-[#5B4B3A]",
    actionClassName: "bg-[#D9D2C7] text-[#8F8577] hover:bg-[#D9D2C7]",
    actionLabel: "Waiting for confirmation",
    actionDescription:
      "Delivery actions will unlock after the order moves into the confirmed state.",
  },
  CONFIRMED: {
    label: "Confirmed",
    accent: "#7C5A2F",
    softBg: "#F9EFE1",
    softBorder: "#E7D7C1",
    badgeClassName: "border-[#E7D7C1] bg-[#F9EFE1] text-[#7C5A2F]",
    actionClassName:
      "bg-[#7C5A2F] text-white hover:bg-[#6C4D28] active:bg-[#5F4322]",
    actionLabel: "Start preparing",
    actionDescription:
      "Move the order into preparation before assigning a shipper.",
  },
  PREPARING: {
    label: "Preparing",
    accent: "#A36312",
    softBg: "#faf5ed",
    softBorder: "#F1DFC1",
    badgeClassName: "border-[#F1DFC1] bg-[#faf5ed] text-[#A36312]",
    actionClassName:
      "bg-[#A36312] text-white hover:bg-[#91570F] active:bg-[#844E0D]",
    actionLabel: "Assign shipper",
    actionDescription:
      "Choose the staff member who will take this order out for delivery.",
  },
  READY_FOR_PICKUP: {
    label: "Ready for pickup",
    accent: "#245F8F",
    softBg: "#EAF5FF",
    softBorder: "#CFE4F7",
    badgeClassName: "border-[#CFE4F7] bg-[#EAF5FF] text-[#245F8F]",
    actionClassName:
      "bg-[#245F8F] text-white hover:bg-[#1F527B] active:bg-[#1A4567]",
    actionLabel: "Mark as picked up",
    actionDescription:
      "Confirm the shipper has collected the order and started the route.",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    accent: "#155AA8",
    softBg: "#E8F1FF",
    softBorder: "#CFE0F8",
    badgeClassName: "border-[#CFE0F8] bg-[#E8F1FF] text-[#155AA8]",
    actionClassName:
      "bg-[#155AA8] text-white hover:bg-[#124C8D] active:bg-[#0F427A]",
    actionLabel: "Mark as delivered",
    actionDescription:
      "Complete the delivery flow once the order reaches the customer.",
  },
  COMPLETED: {
    label: "Completed",
    accent: "#1E7A3F",
    softBg: "#EAF8EF",
    softBorder: "#CEE6D5",
    badgeClassName: "border-[#CEE6D5] bg-[#EAF8EF] text-[#1E7A3F]",
    actionClassName: "bg-[#D9D2C7] text-[#8F8577] hover:bg-[#D9D2C7]",
    actionLabel: "Delivery completed",
    actionDescription:
      "This order has already reached the final delivery step.",
  },
  CANCELED: {
    label: "Canceled",
    accent: "#B42318",
    softBg: "#FDECEC",
    softBorder: "#F2D1CC",
    badgeClassName: "border-[#F2D1CC] bg-[#FDECEC] text-[#B42318]",
    actionClassName: "bg-[#D9D2C7] text-[#8F8577] hover:bg-[#D9D2C7]",
    actionLabel: "Order canceled",
    actionDescription:
      "The delivery lifecycle is closed because this order was canceled.",
  },
};

const buildPrimaryAction = ({
  status,
  canMoveToPreparing,
  canReadyForPickup,
  canPickupDelivery,
  canCompleteDelivery,
  onMoveToPreparing,
  onReadyForPickup,
  onPickupDelivery,
  onCompleteDelivery,
}: Pick<
  DeliveryBoxProps,
  | "status"
  | "canMoveToPreparing"
  | "canReadyForPickup"
  | "canPickupDelivery"
  | "canCompleteDelivery"
  | "onMoveToPreparing"
  | "onReadyForPickup"
  | "onPickupDelivery"
  | "onCompleteDelivery"
>) => {
  switch (status) {
    case "CONFIRMED":
      return {
        onClick: onMoveToPreparing,
        disabled: !canMoveToPreparing,
      };
    case "PREPARING":
      return {
        onClick: onReadyForPickup,
        disabled: !canReadyForPickup,
      };
    case "READY_FOR_PICKUP":
      return {
        onClick: onPickupDelivery,
        disabled: !canPickupDelivery,
      };
    case "OUT_FOR_DELIVERY":
      return {
        onClick: onCompleteDelivery,
        disabled: !canCompleteDelivery,
      };
    default:
      return {
        onClick: undefined,
        disabled: true,
      };
  }
};

const DeliveryMetaItem = ({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
  subValue?: string | null;
}) => (
  <div className="rounded-2xl border border-[#fcf3e6] bg-[#FCFAF7] p-4 shadow-[0_1px_2px_rgba(64,45,24,0.04)]">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E6DACB] bg-white text-[#8B7B68]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B7B68]">
          {label}
        </p>
        <p className="mt-2 truncate text-sm font-semibold text-[#2F2419]">
          {value}
        </p>
        {subValue ? (
          <p className="mt-1 truncate text-xs text-[#6E5D4B]">{subValue}</p>
        ) : null}
      </div>
    </div>
  </div>
);

export function DeliveryBox({
  status,
  deliveryId,
  assignedToName,
  assignedToEmail,
  assignedAt,
  deliveryError,
  deliveryActionMessage,
  isMutating,
  isRefreshing,
  canMoveToPreparing,
  canReadyForPickup,
  canPickupDelivery,
  canCompleteDelivery,
  onRefresh,
  onMoveToPreparing,
  onReadyForPickup,
  onPickupDelivery,
  onCompleteDelivery,
}: DeliveryBoxProps) {
  const tone = DELIVERY_TONES[status];
  const primaryAction = buildPrimaryAction({
    status,
    canMoveToPreparing,
    canReadyForPickup,
    canPickupDelivery,
    canCompleteDelivery,
    onMoveToPreparing,
    onReadyForPickup,
    onPickupDelivery,
    onCompleteDelivery,
  });

  const metaAssignedTo = assignedToName || "Waiting for shipper";
  const metaAssignedAt = assignedAt
    ? formatDateTime(assignedAt)
    : "Not assigned yet";

  const helperMessage = isMutating
    ? "Processing delivery update..."
    : deliveryActionMessage ||
      (!deliveryId &&
      (status === "READY_FOR_PICKUP" || status === "OUT_FOR_DELIVERY")
        ? "Cannot continue delivery flow because deliveryId is missing."
        : "");

  return (
    <section className="rounded-[16px] border border-[#E9E2D8] bg-white shadow-[0_8px_24px_rgba(64,45,24,0.08)]">
      <div className="border-b border-[#F1E9DE] px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ease-out",
                tone.badgeClassName,
              )}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: tone.accent }}
                aria-hidden="true"
              />
              {tone.label}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10 rounded-xl border-[#D9CDBF] bg-white px-4 text-[#6D4C41] hover:bg-[#FCF8F3]"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh status
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {deliveryError ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-[#F2D1CC] bg-[#FDECEC] p-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-[#B42318]" />
              <div>
                <p className="font-semibold text-[#7A271A]">
                  Delivery data could not be loaded
                </p>
                <p className="mt-1 text-sm text-[#9B2C2C]">
                  {deliveryError.message}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-10 rounded-xl border-[#E7B8B0] bg-white text-[#7A271A] hover:bg-[#FFF7F5]"
            >
              Retry
            </Button>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          <DeliveryMetaItem
            icon={UserRound}
            label="Assigned Staff"
            value={metaAssignedTo}
            subValue={assignedToEmail || "No staff assigned yet"}
          />
          <DeliveryMetaItem
            icon={Clock3}
            label="Assigned Time"
            value={metaAssignedAt}
            subValue={
              assignedAt
                ? "Latest assignment timestamp."
                : "Waiting for first assignment."
            }
          />
        </div>

        <div
          className="rounded-[14px] border px-4 py-4"
          style={{
            backgroundColor: tone.softBg,
            borderColor: tone.softBorder,
          }}
        >
          <OrderStatusTimeline status={status} />
        </div>

        <div
          className="rounded-[14px] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
          style={{
            backgroundColor: "#FCFAF7",
            borderColor: "#EEE5D9",
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B7B68]">
                Primary Action
              </p>
              <p className="mt-2 text-base font-semibold text-[#2F2419]">
                {tone.actionLabel}
              </p>
              <p className="mt-1 text-sm text-[#5B4B3A]">
                {tone.actionDescription}
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {
                primaryAction.onClick?.();
              }}
              disabled={primaryAction.disabled || isMutating}
              className={cn(
                "h-11 min-w-[220px] rounded-xl px-5 text-sm font-semibold shadow-sm transition-all duration-150 ease-out max-md:w-full",
                tone.actionClassName,
                (primaryAction.disabled || isMutating) &&
                  "bg-[#D9D2C7] text-[#8F8577] hover:bg-[#D9D2C7]",
              )}
              aria-label={tone.actionLabel}
            >
              {isMutating ? "Processing..." : tone.actionLabel}
            </Button>
          </div>
        </div>

        {helperMessage ? (
          <div
            className={cn(
              "rounded-[14px] border px-4 py-3 text-sm",
              isMutating
                ? "border-[#D8E6F3] bg-[#F4F9FD] text-[#245F8F]"
                : "border-[#F2D1CC] bg-[#FDECEC] text-[#7A271A]",
            )}
            aria-live="polite"
          >
            {helperMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}
