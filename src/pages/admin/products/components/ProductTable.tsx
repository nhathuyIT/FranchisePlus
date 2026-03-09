import { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { createProductColumns } from "../columns/product.columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/product.type";
import { toast } from "sonner";
import {
  useExcelExport,
  useExcelImport,
  ProductImportSchema,
  PRODUCT_HEADER_MAPPING,
  PRODUCT_REVERSE_HEADER_MAPPING,
} from "@/lib/excel";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onBulkDelete?: (products: Product[]) => void;
  // Server-side search
  onSearch?: (keyword: string) => void;
  onStatusToggle?: (row: Product, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
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
  onSearch,
  onStatusToggle,
  statusPendingId,
  canEdit,
}: ProductTableProps) => {
  // Server-side search state
  const [searchInput, setSearchInput] = useState("");

  // Handle manual search trigger
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchInput.trim());
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Excel Export
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: PRODUCT_REVERSE_HEADER_MAPPING,
    fileName: "products",
    sheetName: "Products",
    excludeColumns: ["imageUrl", "content"],
  });

  const columns = useMemo(
    () => createProductColumns({ onStatusToggle, statusPendingId, canEdit }),
    [onStatusToggle, statusPendingId, canEdit]
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
    <div className="flex flex-col h-full gap-4">
      {/* Server-side search input */}
      {onSearch && (
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D4037]" />
            <Input
              placeholder="Search by name, SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-4"
          >
            Search
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        searchable={!onSearch}
        searchPlaceholder="Search by name or SKU..."
        emptyMessage="No products found matching your search."
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
