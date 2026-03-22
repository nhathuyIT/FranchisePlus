import { useMemo } from "react";
import { Eye, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import {
  DataTable,
  type ColumnFilter,
  type BulkAction,
} from "@/components/common/DataTable";
import { createCustomerColumns } from "../columns/customer.columns";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user.type";
import { toast } from "sonner";
import { useExcelExport, CUSTOMER_REVERSE_HEADER_MAPPING } from "@/lib/excel";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "@/router/route.const";

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
  searchValue?: string;
  onSearchChange?: (value: string) => void;
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
  searchValue,
  onSearchChange,
}: CustomerTableProps) => {
  const navigate = useNavigate();

  // Excel Export
  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: CUSTOMER_REVERSE_HEADER_MAPPING,
    fileName: "customers",
    sheetName: "Customers",
    excludeColumns: ["avatarUrl"],
  });

  const columns = useMemo(
    () => createCustomerColumns({ onStatusToggle, statusPendingId, canEdit }),
    [onStatusToggle, statusPendingId, canEdit],
  );

  const handleExport = () => {
    exportToExcel(customers as unknown as Record<string, unknown>[])
      .then(() => {
        toast.success("Excel exported successfully!");
      })
      .catch(() => {
        toast.error("Excel export failed!");
      });
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
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      // NEW FEATURES
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      defaultHiddenColumns={[]}
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      // Excel Export
      onExport={handleExport}
      isExporting={isExporting}
      exportLabel="Export Excel"
      toolbarActions={
        <Button
          variant="outline"
          onClick={() =>
            navigate(
              `${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.USER_FRANCHISE_ROLES}`,
            )
          }
          className="gap-2 border-[#E8DFD6] bg-white text-[#5D4037] hover:bg-[#FAF8F5]"
        >
          <ShieldCheck className="h-4 w-4" />
          User Franchise Roles
        </Button>
      }
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
