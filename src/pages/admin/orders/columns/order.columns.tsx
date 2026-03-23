import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ApiOrder } from "@/api/order/order.api";

type StatusStyle = {
  label: string;
  className: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  DRAFT: {
    label: "Draft",
    className: "bg-slate-500 hover:bg-slate-600 rounded-full",
    variant: "secondary",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-600 hover:bg-blue-700 rounded-full text-white",
    variant: "default",
  },
  PREPARING: {
    label: "Preparing",
    className: "bg-amber-600 hover:bg-amber-700 rounded-full text-white",
    variant: "default",
  },
  READY_FOR_PICKUP: {
    label: "Ready for pickup",
    className: "bg-violet-600 hover:bg-violet-700 rounded-full text-white",
    variant: "default",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    className: "bg-orange-600 hover:bg-orange-700 rounded-full text-white",
    variant: "default",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-600 hover:bg-green-700 rounded-full text-white",
    variant: "default",
  },
  CANCELED: {
    label: "Cancelled",
    className: "bg-red-600 hover:bg-red-700 rounded-full text-white",
    variant: "destructive",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-600 hover:bg-red-700 rounded-full text-white",
    variant: "destructive",
  },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount) + "đ";

const formatDateTime = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const createOrderColumns = (): ColumnDef<ApiOrder>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="font-medium text-[#3E2723]">
        {row.original.code || String(row.original.id ?? "—")}
      </div>
    ),
  },
  {
    accessorKey: "franchiseName",
    header: "Franchise",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate text-sm text-[#3E2723]">
          {row.original.franchiseName ||
            row.original.franchise?.name ||
            String(row.original.franchiseId ?? "—")}
        </div>
        <div className="truncate text-xs text-[#8D6E63]">
          {row.original.franchiseName ? String(row.original.franchiseId ?? "") : ""}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate text-sm text-[#3E2723]">
          {(row.original as ApiOrder & { customerName?: string }).customerName ||
            String(row.original.customerId ?? "—")}
        </div>
        <div className="truncate text-xs text-[#8D6E63]">
          {(row.original as ApiOrder & { customerName?: string }).customerName
            ? String(row.original.customerId ?? "")
            : ""}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.status || "").toUpperCase();
      const style = STATUS_STYLES[status] ?? {
        label: status || "—",
        className: "rounded-full",
        variant: "outline" as const,
      };

      return (
        <Badge variant={style.variant} className={style.className}>
          {style.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    meta: { align: "right" as const },
    cell: ({ row }) => (
      <div className="text-right font-semibold text-[#C97B3D]">
        {formatCurrency(row.original.totalAmount ?? 0)}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-sm text-[#5D4037]">
        {row.original.createdAt ? formatDateTime(row.original.createdAt) : ""}
      </div>
    ),
  },
];
