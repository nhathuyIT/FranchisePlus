import type { ColumnDef } from "@tanstack/react-table";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { InlineEditCell } from "../components/InlineEditCell";

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
    // Delegates to InlineEditCell which reads form state via Context.
    // Falls back to plain text when context marks isEditable=false.
    cell: ({ row }) => (
      <InlineEditCell item={row.original} fieldName="quantity" />
    ),
  },
  {
    accessorKey: "alertThreshold",
    header: "Threshold",
    cell: ({ row }) => (
      <InlineEditCell item={row.original} fieldName="alertThreshold" />
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
