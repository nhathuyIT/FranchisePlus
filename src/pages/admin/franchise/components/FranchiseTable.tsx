import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnFilter, type BulkAction } from "@/components/common/DataTable";
import { franchiseColumns } from "../columns/franchise.columns";
import { Button } from "@/components/ui/button";
import type { Franchise } from "@/types/franchise";
import { toast } from "sonner";
import {
  useExcelExport,
  useExcelImport,
  FranchiseImportSchema,
  FRANCHISE_HEADER_MAPPING,
  FRANCHISE_REVERSE_HEADER_MAPPING,
} from "@/lib/excel";

interface FranchiseTableProps {
  franchises: Franchise[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onBulkDelete?: (franchises: Franchise[]) => void;
  onEdit?: (franchise: Franchise) => void;
  onView?: (franchise: Franchise) => void;
  onDelete?: (franchise: Franchise) => void;
}

export const FranchiseTable = ({
  franchises,
  isLoading = false,
  error = null,
  onRetry,
  onBulkDelete,
  onEdit,
  onView,
  onDelete,
}: FranchiseTableProps) => {
<<<<<<< HEAD
  // Excel Export
=======
>>>>>>> dev
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: FRANCHISE_REVERSE_HEADER_MAPPING,
    fileName: "franchises",
    sheetName: "Franchises",
    excludeColumns: ["logoUrl"],
  });

<<<<<<< HEAD
  // Excel Import
=======
>>>>>>> dev
  const { importFromExcel, isImporting } = useExcelImport({
    schema: FranchiseImportSchema,
    headerMapping: FRANCHISE_HEADER_MAPPING,
  });

  const handleExport = () => {
<<<<<<< HEAD
    exportToExcel(franchises as unknown as Record<string, unknown>[]).then(() => {
      toast.success("Excel exported successfully!");
    }).catch(() => {
      toast.error("Excel export failed!");
    });
=======
    exportToExcel(franchises as unknown as Record<string, unknown>[])
      .then(() => {
        toast.success("Excel exported successfully!");
      })
      .catch(() => {
        toast.error("Excel export failed!");
      });
>>>>>>> dev
  };

  const handleImport = async (file: File) => {
    const result = await importFromExcel(file);
    if (result.success) {
      toast.success(`Successfully imported ${result.validRows} rows`);
<<<<<<< HEAD
      // TODO: call API to save result.data
    } else {
      toast.error(`Import failed: ${result.validRows} valid, ${result.invalidRows} errors`);
      result.errors.forEach((err) => console.warn(`Row ${err.row} - ${err.field}: ${err.message}`));
    }
  };

  // Column Filters Configuration
=======
    } else {
      toast.error(`Import failed: ${result.validRows} valid, ${result.invalidRows} errors`);
    }
  };

>>>>>>> dev
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

  const bulkActions: BulkAction<Franchise>[] = [];

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
      columns={franchiseColumns}
      data={franchises}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search franchises by name, code, or address..."
      emptyMessage="No franchises found matching your search."
      initialPageSize={5}
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      defaultHiddenColumns={["address", "closedAt"]}
      columnFilters={columnFilters}
      bulkActions={bulkActions}
<<<<<<< HEAD
      // Excel Import/Export
=======
>>>>>>> dev
      onExport={handleExport}
      isExporting={isExporting}
      onImport={handleImport}
      isImporting={isImporting}
      exportLabel="Export Excel"
      importLabel="Import Excel"
      renderActions={(franchise) => (
        <>
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(franchise)}
              className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(franchise)}
              className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(franchise)}
              className="border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    />
  );
};
