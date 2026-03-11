import { useMemo } from "react";
import { Eye, Pencil, Trash2, LayoutGrid } from "lucide-react";
import {
  DataTable,
  type ColumnFilter,
  type BulkAction,
} from "@/components/common/DataTable";
import { createFranchiseColumns } from "../columns/franchise.columns";
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
  onStatusToggle?: (row: Franchise, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
  onAssignProducts?: (franchise: Franchise) => void;
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
  onStatusToggle,
  statusPendingId,
  canEdit,
  onAssignProducts,
}: FranchiseTableProps) => {
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: FRANCHISE_REVERSE_HEADER_MAPPING,
    fileName: "franchises",
    sheetName: "Franchises",
    excludeColumns: ["logoUrl"],
  });

  const columns = useMemo(
    () => createFranchiseColumns({ onStatusToggle, statusPendingId, canEdit }),
    [onStatusToggle, statusPendingId, canEdit],
  );

  const { importFromExcel, isImporting } = useExcelImport({
    schema: FranchiseImportSchema,
    headerMapping: FRANCHISE_HEADER_MAPPING,
  });

  const handleExport = () => {
    exportToExcel(franchises as unknown as Record<string, unknown>[])
      .then(() => {
        toast.success("Excel exported successfully!");
      })
      .catch(() => {
        toast.error("Excel export failed!");
      });
  };

  const handleImport = async (file: File) => {
    const result = await importFromExcel(file);
    if (result.success) {
      toast.success(`Successfully imported ${result.validRows} rows`);
    } else {
      toast.error(
        `Import failed: ${result.validRows} valid, ${result.invalidRows} errors`,
      );
    }
  };

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
      columns={columns}
      data={franchises}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyMessage="No franchises found matching your search."
      initialPageSize={5}
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      defaultHiddenColumns={["address", "closedAt"]}
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      onExport={handleExport}
      isExporting={isExporting}
      onImport={handleImport}
      isImporting={isImporting}
      exportLabel="Export Excel"
      importLabel="Import Excel"
      renderActions={(franchise) => (
        <>
          {onAssignProducts && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignProducts(franchise)}
              title="Assign products to categories"
              className="border-2 border-[#5C6BC0] text-[#5C6BC0] hover:bg-[#5C6BC0] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          )}
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
