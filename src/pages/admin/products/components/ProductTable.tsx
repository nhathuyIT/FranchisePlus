import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { productColumns } from "../columns/product.columns";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product.type";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onBulkDelete?: (products: Product[]) => void;
}

export const ProductTable = ({
  products,
  isLoading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
}: ProductTableProps) => {
  // Column Filters Configuration
  const columnFilters: ColumnFilter[] = [
    {
      id: "is_active",
      type: "select",
      label: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
    {
      id: "category",
      type: "search",
      label: "Category",
    },
  ];

  // Bulk Actions Configuration
  const bulkActions: BulkAction<Product>[] = [];

  if (onBulkDelete) {
    bulkActions.push({
      label: "Delete Selected",
      icon: Trash2,
      onClick: onBulkDelete,
      variant: "destructive",
    });
  }

  return (
    <DataTable
      columns={productColumns}
      data={products}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search by name, SKU, or category..."
      emptyMessage="No products found matching your search."
      initialPageSize={10}
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      renderActions={(product) => (
        <>
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(product)}
              className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product)}
              className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    />
  );
};
