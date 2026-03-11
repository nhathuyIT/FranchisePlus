import type { ColumnDef } from "@tanstack/react-table";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";

export const inventoryColumns: ColumnDef<InventorySearchItem>[] = [
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
    header: "Quantity",
    cell: ({ row }) => (
      <span className="text-[#3E2723] font-semibold">
        {row.original.quantity}
      </span>
    ),
  },
  {
    accessorKey: "alertThreshold",
    header: "Threshold",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.alertThreshold}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    filterFn: (row, _columnId, filterValue) => {
      const quantity = row.original.quantity;
      const threshold = row.original.alertThreshold;
      const percentage = (quantity / threshold) * 100;

      if (filterValue === "out_of_stock") {
        return quantity === 0;
      }
      if (filterValue === "low_stock") {
        return quantity > 0 && percentage <= 100;
      }
      if (filterValue === "in_stock") {
        return percentage > 100;
      }
      return true;
    },
    cell: ({ row }) => (
      <StockStatusBadge
        quantity={row.original.quantity}
        lowStockThreshold={row.original.alertThreshold}
      />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {new Date(row.original.updatedAt).toLocaleDateString()}
      </span>
    ),
  },
];
