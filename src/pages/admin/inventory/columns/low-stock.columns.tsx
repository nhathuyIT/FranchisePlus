import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventoryItemView } from "@/types/inventory";

interface LowStockColumnsProps {
  onUpdateStock?: (item: InventoryItemView) => void;
}

export const createLowStockColumns = ({
  onUpdateStock,
}: LowStockColumnsProps): ColumnDef<InventoryItemView>[] => [
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
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
          onClick={() => onUpdateStock?.(row.original)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Update Stock
        </Button>
      </div>
    ),
  },
];
