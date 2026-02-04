import type { ColumnDef } from "@tanstack/react-table";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventoryItemView } from "@/types/inventory";

export const inventoryColumns: ColumnDef<InventoryItemView>[] = [
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
    header: "Quantity",
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
    id: "status",
    header: "Status",
    enableSorting: false,
    filterFn: (row, _columnId, filterValue) => {
      const quantity = row.original.inventory.quantity;
      const threshold = row.original.inventory.alert_threshold;
      const percentage = (quantity / threshold) * 100;

      if (filterValue === "out_of_stock") {
        return quantity === 0;
      }
      if (filterValue === "low_stock") {
        // Low Stock: percentage <= 100 (including critical)
        return quantity > 0 && percentage <= 100;
      }
      if (filterValue === "in_stock") {
        // In Stock (Good Stock): percentage > 100
        return percentage > 100;
      }
      return true;
    },
    cell: ({ row }) => (
      <StockStatusBadge
        quantity={row.original.inventory.quantity}
        lowStockThreshold={row.original.inventory.alert_threshold}
      />
    ),
  },
  {
    accessorKey: "inventory.updated_at",
    header: "Last Updated",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {new Date(row.original.inventory.updated_at).toLocaleDateString()}
      </span>
    ),
  },
];
