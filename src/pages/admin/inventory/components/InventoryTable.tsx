import { Edit, Trash2, Download } from "lucide-react";
import {
  DataTable,
  type ColumnFilter,
  type BulkAction,
} from "@/components/common/DataTable";
import { inventoryColumns } from "../columns/inventory.columns";
import { Button } from "@/components/ui/button";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { toast } from "sonner";
import {
  useExcelExport,
  INVENTORY_REVERSE_HEADER_MAPPING,
  flattenInventoryItem,
} from "@/lib/excel";

interface InventoryTableProps {
  items: InventorySearchItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onEdit?: (item: InventorySearchItem) => void;
  onDelete?: (item: InventorySearchItem) => void;
  onBulkExport?: (items: InventorySearchItem[]) => void;
}

export const InventoryTable = ({
  items,
  isLoading = false,
  error = null,
  onRetry,
  onEdit,
  onDelete,
  onBulkExport,
}: InventoryTableProps) => {
  // Excel Export (flatten nested data for export)
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: INVENTORY_REVERSE_HEADER_MAPPING,
    fileName: "inventory",
    sheetName: "Inventory",
  });

  const handleExport = () => {
    const flatData = items.map((item) =>
      flattenInventoryItem(item as unknown as Record<string, unknown>),
    );
    exportToExcel(flatData)
      .then(() => {
        toast.success("Inventory exported successfully!");
      })
      .catch(() => {
        toast.error("Inventory export failed!");
      });
  };

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
  ];

  // Bulk Actions Configuration
  const bulkActions: BulkAction<InventorySearchItem>[] = [];

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
      enableRowSelection={!!onBulkExport}
      enableColumnVisibility
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      onExport={handleExport}
      isExporting={isExporting}
      exportLabel="Export Excel"
      renderActions={
        onEdit || onDelete
          ? (item) => (
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          : undefined
      }
    />
  );
};
