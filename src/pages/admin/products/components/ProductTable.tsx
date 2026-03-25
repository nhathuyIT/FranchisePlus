import { useState, useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { createProductColumns } from "../columns/product.columns";
import { Button } from "@/components/ui/button";
import type { AdminProductRow } from "../columns/product.columns";
import { toast } from "sonner";
import {
  useExcelExport,
  useExcelImport,
  ProductImportSchema,
  PRODUCT_HEADER_MAPPING,
  PRODUCT_REVERSE_HEADER_MAPPING,
} from "@/lib/excel";

interface ProductTableProps {
  products: AdminProductRow[];
  pagination?: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (pageNum: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onView?: (product: AdminProductRow) => void;
  onEdit?: (product: AdminProductRow) => void;
  onDelete?: (product: AdminProductRow) => void;
  onBulkDelete?: (products: AdminProductRow[]) => void;
  // Server-side search
  onSearch?: (keyword: string) => void;
  onStatusToggle?: (row: AdminProductRow, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
  isManagerView?: boolean;
}

export const ProductTable = ({
  products,
  pagination,
  isLoading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onSearch,
  onStatusToggle,
  statusPendingId,
  canEdit,
  isManagerView = false,
}: ProductTableProps) => {
  // Server-side search state
  const [searchInput, setSearchInput] = useState("");

  // Excel Export
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: PRODUCT_REVERSE_HEADER_MAPPING,
    fileName: "products",
    sheetName: "Products",
    excludeColumns: ["imageUrl", "content"],
  });

  const columns = useMemo(
    () => createProductColumns({ onStatusToggle, statusPendingId, canEdit, isManagerView }),
    [onStatusToggle, statusPendingId, canEdit, isManagerView]
  );

  // Excel Import
  const { importFromExcel, isImporting } = useExcelImport({
    schema: ProductImportSchema,
    headerMapping: PRODUCT_HEADER_MAPPING,
  });

  const handleExport = () => {
    exportToExcel(products as unknown as Record<string, unknown>[]).then(() => {
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
  const bulkActions: BulkAction<AdminProductRow>[] = [];

  if (onBulkDelete) {
    bulkActions.push({
      label: "Delete Selected",
      icon: Trash2,
      onClick: onBulkDelete,
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        searchable
        searchPlaceholder="Search by name, SKU..."
        searchValue={onSearch ? searchInput : undefined}
        onSearchChange={onSearch ? (val) => { setSearchInput(val); onSearch(val); } : undefined}
        emptyMessage="No products found matching your search."
        initialPageSize={10}
        serverPagination={pagination}
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

    </div>
  );
};
