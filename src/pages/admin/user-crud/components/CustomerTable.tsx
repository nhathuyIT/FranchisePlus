import { useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  type ColumnFilter,
  type BulkAction,
} from "@/components/common/DataTable";
import { createCustomerColumns } from "../columns/customer.columns";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user.type";
import { toast } from "sonner";
import {
  useExcelExport,
  useExcelImport,
  CustomerImportSchema,
  CUSTOMER_HEADER_MAPPING,
  CUSTOMER_REVERSE_HEADER_MAPPING,
} from "@/lib/excel";

interface CustomerTableProps {
  customers: User[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onBulkDelete?: (customers: User[]) => void;
  onEdit?: (customer: User) => void;
  onView?: (customer: User) => void;
  onDelete?: (customer: User) => void;
  onStatusToggle?: (row: User, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
}

export const CustomerTable = ({
  customers,
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
}: CustomerTableProps) => {
  // Excel Export
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: CUSTOMER_REVERSE_HEADER_MAPPING,
    fileName: "customers",
    sheetName: "Customers",
    excludeColumns: ["avatarUrl"],
  });

  const columns = useMemo(
    () => createCustomerColumns({ onStatusToggle, statusPendingId, canEdit }),
    [onStatusToggle, statusPendingId, canEdit]
  );

  // Excel Import
  const { parseFile, validateRows, isParsing } = useExcelImport({
    schema: CustomerImportSchema,
    headerMapping: CUSTOMER_HEADER_MAPPING,
  });

  const handleExport = () => {
    exportToExcel(customers as unknown as Record<string, unknown>[])
      .then(() => {
        toast.success("Excel exported successfully!");
      })
      .catch(() => {
        toast.error("Excel export failed!");
      });
  };

  const handleImport = async (file: File) => {
    const preview = await parseFile(file);
    const result = validateRows(preview.rows);
    if (result.success) {
      toast.success(`Successfully imported ${result.validRows} rows`);
      // TODO: call API to save result.data
    } else {
      toast.error(
        `Import failed: ${result.validRows} valid, ${result.invalidRows} errors`,
      );
      result.errors.forEach((err) =>
        console.warn(`Row ${err.row} - ${err.field}: ${err.message}`),
      );
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
  const bulkActions: BulkAction<User>[] = [];

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
      data={customers}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search customers by name, phone, or email..."
      emptyMessage="No customers found matching your search."
      initialPageSize={5}
      // NEW FEATURES
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      defaultHiddenColumns={[]}
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      // Excel Import/Export
      onExport={handleExport}
      isExporting={isExporting}
      onImport={handleImport}
      isImporting={isParsing}
      exportLabel="Export Excel"
      importLabel="Import Excel"
      renderActions={(customer) => (
        <>
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(customer)}
              className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(customer)}
              className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(customer)}
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
