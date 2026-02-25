import { Edit, Download } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { inventoryColumns } from "../columns/inventory.columns";
import { Button } from "@/components/ui/button";
import type { InventoryItemView } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItemView[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onEdit?: (item: InventoryItemView) => void;
  onBulkExport?: (items: InventoryItemView[]) => void;
}

export const InventoryTable = ({
  items,
  isLoading = false,
  error = null,
  onRetry,
  onEdit,
  onBulkExport,
}: InventoryTableProps) => {
  // Column Filters Configuration
  const columnFilters: ColumnFilter[] = [
    {
      id: "status",
      type: "select",
      label: "Stock Status",
      options: [
        { label: "In Stock", value: "in_stock" },
        { label: "Low Stock", value: "low_stock" },
        { label: "Out of Stock", value: "out_of_stock" },
      ],
    },
    // {
    //   id: "franchiseName",
    //   type: "search",
    //   label: "Franchise",
    // },
  ];

  // Bulk Actions Configuration
  const bulkActions: BulkAction<InventoryItemView>[] = [];

  if (onBulkExport) {
    bulkActions.push({
      label: "Export Selected",
      icon: Download,
      onClick: onBulkExport,
    });
  }

  return (
    <DataTable
      columns={inventoryColumns}
      data={items}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search by product name, SKU, or franchise..."
      emptyMessage="No inventory items found matching your criteria."
      initialPageSize={5}
      // NEW FEATURES
      enableRowSelection={!!onBulkExport}
      enableColumnVisibility
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      renderActions={
        onEdit
          ? (item) => (
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )
          : undefined
      }
    />
  );
};
