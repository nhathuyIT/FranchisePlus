import type { ColumnDef } from "@tanstack/react-table";
import "@/types/table.types";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";

export const lowStockColumns: ColumnDef<InventorySearchItem>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <span className="font-medium text-[#3E2723]">
        {row.original.productName}
      </span>
    ),
  },
  {
    accessorKey: "franchiseName",
    header: "Franchise",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">{row.original.franchiseName}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Current",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="text-[#3E2723] font-semibold">
        {row.original.quantity}
      </span>
    ),
  },
  {
    accessorKey: "alertThreshold",
    header: "Threshold",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.alertThreshold}
      </span>
    ),
  },
  {
    id: "shortage",
    header: "Shortage",
    enableSorting: false,
    meta: { align: "right" },
    cell: ({ row }) => {
      const shortage =
        row.original.alertThreshold - row.original.quantity;
      return (
        <span className="text-[#EF4444] font-semibold">-{shortage}</span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <StockStatusBadge
        quantity={row.original.quantity}
        lowStockThreshold={row.original.alertThreshold}
      />
    ),
  },
];
