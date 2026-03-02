import { Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { categoryColumns } from "../columns/category.columns";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";
import { toast } from "sonner";
import {
  useExcelExport,
  useExcelImport,
  CategoryImportSchema,
  CATEGORY_HEADER_MAPPING,
  CATEGORY_REVERSE_HEADER_MAPPING,
} from "@/lib/excel";

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
  // Excel Export
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: CATEGORY_REVERSE_HEADER_MAPPING,
    fileName: "categories",
    sheetName: "Categories",
  });

  // Excel Import
  const { importFromExcel, isImporting } = useExcelImport({
    schema: CategoryImportSchema,
    headerMapping: CATEGORY_HEADER_MAPPING,
  });

  const handleExport = () => {
    exportToExcel(categories as unknown as Record<string, unknown>[]).then(() => {
      toast.success("Excel exported successfully!");
    }).catch(() => {
      toast.error("Excel export failed!");
    });
  };

  const handleImport = async (file: File) => {
    const result = await importFromExcel(file);
    if (result.success) {
      toast.success(`Successfully imported ${result.validRows} rows`);
    } else {
      toast.error(`Import failed: ${result.validRows} valid, ${result.invalidRows} errors`);
      result.errors.forEach((err) => console.warn(`Row ${err.row} - ${err.field}: ${err.message}`));
    }
  };

  // Column Filters Configuration
  const columnFilters: ColumnFilter[] = [
    {
      id: "isActive",
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
      // Excel Import/Export
      onExport={handleExport}
      isExporting={isExporting}
      onImport={handleImport}
      isImporting={isImporting}
      exportLabel="Export Excel"
      importLabel="Import Excel"
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
