import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Promotion } from "@/types/promotion";

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

const formatValue = (type: Promotion["type"], value: number): string => {
  if (type === "PERCENT") {
    return `${value}%`;
  }

  return `${value.toLocaleString("vi-VN")}₫`;
};

export const createPromotionColumns = (): ColumnDef<Promotion>[] => [
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
    accessorKey: "franchiseName",
    header: "Franchise Name",
    cell: ({ row }) => (
      <span className="font-medium text-[#5D4037]">
        {row.original.franchiseName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-medium text-[#5D4037]">
        {row.original.productName || "ALL PRODUCTS"}
      </span>
    ),
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {formatDateTime(row.original.startTime)}
      </span>
    ),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {formatDateTime(row.original.endTime)}
      </span>
    ),
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
