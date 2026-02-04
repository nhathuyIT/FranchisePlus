import { Edit, Download } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { lowStockColumns } from "../columns/low-stock.columns";
import { Button } from "@/components/ui/button";
import type { InventoryItemView } from "@/types/inventory";

interface LowStockTableProps {
  items: InventoryItemView[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onUpdateStock?: (item: InventoryItemView) => void;
  onBulkExport?: (items: InventoryItemView[]) => void;
}

export const LowStockTable = ({
  items,
  isLoading = false,
  error = null,
  onRetry,
  onUpdateStock,
  onBulkExport,
}: LowStockTableProps) => {
  // Column Filters Configuration
  const columnFilters: ColumnFilter[] = [
    {
      id: "franchiseName",
      type: "search",
      label: "Franchise",
    },
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
      columns={lowStockColumns}
      data={items}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search low stock items by product, SKU, or franchise..."
      emptyMessage="No low stock items found. All inventory levels are healthy!"
      initialPageSize={5}
      // NEW FEATURES
      enableRowSelection={!!onBulkExport}
      enableColumnVisibility
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      renderActions={
        onUpdateStock
          ? (item) => (
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200"
                onClick={() => onUpdateStock(item)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Stock
              </Button>
            )
          : undefined
      }
    />
  );
};
