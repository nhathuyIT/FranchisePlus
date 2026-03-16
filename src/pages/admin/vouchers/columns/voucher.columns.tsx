import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Voucher } from "@/types/voucher";

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatValue = (type: Voucher["type"], value: number): string => {
  if (type === "PERCENT") {
    return `${value}%`;
  }

  return `${value.toLocaleString("vi-VN")}₫`;
};

export const createVoucherColumns = (): ColumnDef<Voucher>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="max-w-24 truncate font-mono text-xs text-[#5D4037]" title={row.original.code || "-"}>
        {row.original.code || "-"}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="max-w-40 truncate font-medium text-[#3E2723]" title={row.original.name}>
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "franchiseName",
    header: "Franchise Name",
    cell: ({ row }) => (
      <div className="max-w-32 truncate font-medium text-[#5D4037]" title={row.original.franchiseName || "N/A"}>
        {row.original.franchiseName || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="max-w-36 truncate font-medium text-[#5D4037]" title={row.original.productName || "ALL PRODUCTS"}>
        {row.original.productName || "ALL PRODUCTS"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    filterFn: (row, _columnId, filterValue) => {
      return row.original.type === filterValue;
    },
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge
          variant="outline"
          className={
            type === "PERCENT"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-[#D97706] text-[#D97706]"
          }
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <span className="font-semibold text-[#3E2723]">
        {formatValue(row.original.type, row.original.value)}
      </span>
    ),
  },
  {
    accessorKey: "quotaTotal",
    header: "Quota Total",
  },
  {
    accessorKey: "quotaUsed",
    header: "Quota Used",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const formattedTime = formatDateTime(row.original.startTime);
      return (
        <div className="max-w-32 truncate text-[#5D4037]" title={formattedTime}>
          {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      const formattedTime = formatDateTime(row.original.endTime);
      return (
        <div className="max-w-32 truncate text-[#5D4037]" title={formattedTime}>
          {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "isDeleted",
    header: "Record",
    filterFn: (row, _columnId, filterValue) => {
      return row.original.isDeleted === filterValue;
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.isDeleted ? "secondary" : "default"}
        className={
          row.original.isDeleted
            ? "bg-gray-500 hover:bg-gray-600 rounded-full"
            : "bg-green-600 hover:bg-green-700 rounded-full"
        }
      >
        {row.original.isDeleted ? "Deleted" : "Active"}
      </Badge>
    ),
  },
];
