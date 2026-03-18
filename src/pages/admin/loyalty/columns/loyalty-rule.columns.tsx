import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { LoyaltyRule } from "@/types/loyalty-rule";

const formatCurrency = (value: number): string => {
  return `${value.toLocaleString("vi-VN")} đ`;
};

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

export const createLoyaltyRuleColumns = (): ColumnDef<LoyaltyRule>[] => [
  {
    accessorKey: "franchiseName",
    header: "Franchise",
    cell: ({ row }) => (
      <div
        className="max-w-32 truncate font-medium text-[#3E2723]"
        title={row.original.franchiseName || "N/A"}
      >
        {row.original.franchiseName || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "earnAmountPerPoint",
    header: "Earn Amount / Point",
    cell: ({ row }) => (
      <span className="font-semibold text-[#3E2723]">
        {formatCurrency(row.original.earnAmountPerPoint)}
      </span>
    ),
  },
  {
    accessorKey: "redeemValuePerPoint",
    header: "Redeem Value / Point",
    cell: ({ row }) => (
      <span className="font-semibold text-[#3E2723]">
        {formatCurrency(row.original.redeemValuePerPoint)}
      </span>
    ),
  },
  {
    accessorKey: "minRedeemPoints",
    header: "Redeem Points",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.minRedeemPoints} - {row.original.maxRedeemPoints}
      </span>
    ),
  },
  {
    accessorKey: "tierRules",
    header: "Tiers",
    cell: ({ row }) => {
      const tierLabel = row.original.tierRules
        .map((tier) => `${tier.tier}: ${tier.benefit.orderDiscountPercent}%`)
        .join(" | ");

      return (
        <div className="max-w-64 truncate text-[#5D4037]" title={tierLabel}>
          {tierLabel || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    filterFn: (row, _columnId, filterValue) =>
      row.original.isActive === filterValue,
    cell: ({ row }) => (
      <Badge
        variant={row.original.isActive ? "default" : "secondary"}
        className={
          row.original.isActive
            ? "bg-green-600 hover:bg-green-700 rounded-full"
            : "bg-gray-500 hover:bg-gray-600 rounded-full"
        }
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const formatted = formatDateTime(row.original.updatedAt);
      return (
        <div className="max-w-32 truncate text-[#5D4037]" title={formatted}>
          {formatted}
        </div>
      );
    },
  },
];
