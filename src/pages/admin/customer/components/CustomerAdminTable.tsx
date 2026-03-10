import { useMemo } from "react";
import { Eye, Trash2 } from "lucide-react";
import {
  DataTable,
  type ColumnFilter,
  type BulkAction,
} from "@/components/common/DataTable";
import { createCustomerAdminColumns } from "../columns/customer-admin.columns";
import { Button } from "@/components/ui/button";
import type { CustomerProfile } from "@/types/customer";

interface CustomerAdminTableProps {
  customers: CustomerProfile[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onBulkDelete?: (customers: CustomerProfile[]) => void;
  onView?: (customer: CustomerProfile) => void;
  onDelete?: (customer: CustomerProfile) => void;
  onStatusToggle?: (row: CustomerProfile, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
}

export const CustomerAdminTable = ({
  customers,
  isLoading = false,
  error = null,
  onRetry,
  onBulkDelete,
  onView,
  onDelete,
  onStatusToggle,
  statusPendingId,
  canEdit,
}: CustomerAdminTableProps) => {
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
    {
      id: "isVerified",
      type: "select",
      label: "Verified",
      options: [
        { label: "Verified", value: "true" },
        { label: "Unverified", value: "false" },
      ],
    },
  ];

  const columns = useMemo(
    () =>
      createCustomerAdminColumns({ onStatusToggle, statusPendingId, canEdit }),
    [onStatusToggle, statusPendingId, canEdit],
  );

  const bulkActions: BulkAction<CustomerProfile>[] = [];

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
      searchPlaceholder="Search customers by name, email, or phone..."
      emptyMessage="No customers found matching your search."
      initialPageSize={10}
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      defaultHiddenColumns={["address"]}
      columnFilters={columnFilters}
      bulkActions={bulkActions}
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
