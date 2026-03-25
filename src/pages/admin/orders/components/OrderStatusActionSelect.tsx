import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { PopoverSearchSelect } from "@/components/form-dialog/PopoverSearchSelect";
import type { ApiOrder } from "@/api/order/order.api";

type NextStatusAction = "preparing" | "ready-for-pickup";

interface OrderStatusActionSelectProps {
  order: ApiOrder;
  disabled?: boolean;
  isPending?: boolean;
  onChangeStatusPreparing: (orderId: string) => void;
  onChangeStatusReadyForPickup: (orderId: string) => void;
}

export const OrderStatusActionSelect = ({
  order,
  disabled = false,
  isPending = false,
  onChangeStatusPreparing,
  onChangeStatusReadyForPickup,
}: OrderStatusActionSelectProps) => {
  const [open, setOpen] = useState(false);

  const normalizedStatus = (order.status ?? "").toUpperCase();
  const orderId = order.id ? String(order.id) : "";

  const options = useMemo(
    () => [
      {
        value: "preparing" as const,
        label: "Mark as Preparing",
        searchText: "preparing",
        disabled: normalizedStatus !== "CONFIRMED" || !orderId,
      },
      {
        value: "ready-for-pickup" as const,
        label: "Ready for Pickup",
        searchText: "ready pickup completed",
        disabled: normalizedStatus !== "PREPARING" || !orderId,
      },
    ],
    [normalizedStatus, orderId],
  );

  const placeholder = isPending ? "Updating..." : "Change status";

  const handleSelect = (value: string) => {
    const action = value as NextStatusAction;

    if (!orderId) return;

    if (action === "preparing") {
      onChangeStatusPreparing(orderId);
      return;
    }

    if (action === "ready-for-pickup") {
      onChangeStatusReadyForPickup(orderId);
    }
  };

  return (
    <div className="min-w-[14rem]">
      <PopoverSearchSelect
        value={undefined}
        onValueChange={handleSelect}
        options={options}
        placeholder={placeholder}
        searchPlaceholder="Search action..."
        emptyText="No actions"
        disabled={disabled || isPending}
        open={open}
        onOpenChange={setOpen}
        triggerClassName="h-9"
        contentClassName="min-w-[18rem]"
      />

      {isPending && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Updating
        </div>
      )}
    </div>
  );
};
