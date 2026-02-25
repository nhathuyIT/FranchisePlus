import { Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { categoryColumns } from "../columns/category.columns";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onBulkDelete?: (categories: Category[]) => void;
}

export const CategoryTable = ({
  categories,
  isLoading = false,
  error = null,
  onRetry,
  onEdit,
  onDelete,
  onBulkDelete,
}: CategoryTableProps) => {
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
  ];

  // Bulk Actions Configuration
  const bulkActions: BulkAction<Category>[] = [];

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
      columns={categoryColumns}
      data={categories}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search by name, code, or description..."
      emptyMessage="No categories found matching your search."
      initialPageSize={10}
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      renderActions={(category) => (
        <>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
              className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(category)}
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
