import type { ColumnDef } from "@tanstack/react-table";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventoryItemView } from "@/types/inventory";

export const lowStockColumns: ColumnDef<InventoryItemView>[] = [
  {
    accessorKey: "product.name",
    header: "Product",
    cell: ({ row }) => (
      <span className="font-medium text-[#3E2723]">
        {row.original.product.name}
      </span>
    ),
  },
  {
    accessorKey: "product.SKU",
    header: "SKU",
    cell: ({ row }) => (
      <span className="text-[#5D4037] font-mono text-sm">
        {row.original.product.SKU}
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
    accessorKey: "inventory.quantity",
    header: "Current",
    cell: ({ row }) => (
      <span className="text-[#3E2723] font-semibold">
        {row.original.inventory.quantity} kg
      </span>
    ),
  },
  {
    accessorKey: "inventory.alert_threshold",
    header: "Threshold",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.inventory.alert_threshold} kg
      </span>
    ),
  },
  {
    id: "shortage",
    header: "Shortage",
    enableSorting: false,
    cell: ({ row }) => {
      const shortage =
        row.original.inventory.alert_threshold - row.original.inventory.quantity;
      return (
        <span className="text-[#EF4444] font-semibold">-{shortage} kg</span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <StockStatusBadge
        quantity={row.original.inventory.quantity}
        lowStockThreshold={row.original.inventory.alert_threshold}
      />
    ),
  },
];
