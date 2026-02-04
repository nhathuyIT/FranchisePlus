import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventoryItemView } from "@/types/inventory";

interface InventoryColumnsProps {
  onEdit?: (item: InventoryItemView) => void;
}

export const createInventoryColumns = ({
  onEdit,
}: InventoryColumnsProps): ColumnDef<InventoryItemView>[] => [
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
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
          onClick={() => onEdit?.(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
