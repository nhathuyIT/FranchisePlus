import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { AdminPayment } from "@/types/admin-payment.type";

const formatDateTime = (value: string): string => {
  if (!value) return "-";

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

const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return "0₫";
  return `${value.toLocaleString("vi-VN")}₫`;
};

const getStatusBadgeClass = (status: AdminPayment["status"]): string => {
  switch (status) {
    case "PENDING":
      return "border-[#D97706] text-[#D97706]";
    case "PAID":
      return "border-[#16A34A] text-[#16A34A]";
    case "REFUNDED":
      return "border-[#7C3AED] text-[#7C3AED]";
  }
};

export const createPaymentColumns = (): ColumnDef<AdminPayment>[] => [
  {
    accessorKey: "code",
    header: "Payment Code",
    cell: ({ row }) => (
      <div
        className="max-w-36 truncate font-mono text-xs text-[#5D4037]"
        title={row.original.code}
      >
        {row.original.code}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { align: "right" as const },
    cell: ({ row }) => (
      <span className="font-semibold text-[#3E2723]">
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-[#6D4C41] text-[#6D4C41]">
        {row.original.method || "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => row.original.status === filterValue,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={getStatusBadgeClass(row.original.status)}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "providerTxnId",
    header: "Provider Txn ID",
    cell: ({ row }) => (
      <div
        className="max-w-32 truncate text-[#5D4037]"
        title={row.original.providerTxnId || "-"}
      >
        {row.original.providerTxnId || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const formatted = formatDateTime(row.original.createdAt);
      return (
        <div className="max-w-32 truncate text-[#5D4037]" title={formatted}>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    cell: ({ row }) => {
      const formatted = formatDateTime(row.original.paidAt);
      return (
        <div className="max-w-32 truncate text-[#5D4037]" title={formatted}>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "refundedAt",
    header: "Refunded At",
    cell: ({ row }) => {
      const formatted = formatDateTime(row.original.refundedAt);
      return (
        <div className="max-w-32 truncate text-[#5D4037]" title={formatted}>
          {formatted}
        </div>
      );
    },
  },
];
