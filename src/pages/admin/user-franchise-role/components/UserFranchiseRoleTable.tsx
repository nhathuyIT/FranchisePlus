import { Trash2 } from "lucide-react";
import {
  DataTable,
  type ColumnFilter,
  type BulkAction,
} from "@/components/common/DataTable";
import { userFranchiseRoleColumns } from "../columns/user-franchise-role.columns";
import { Button } from "@/components/ui/button";
import type { UserFranchiseRoleItem } from "@/api/user-franchise-role";

interface UserFranchiseRoleTableProps {
  assignments: UserFranchiseRoleItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onDelete?: (assignment: UserFranchiseRoleItem) => void;
  onBulkDelete?: (assignments: UserFranchiseRoleItem[]) => void;
}

export const UserFranchiseRoleTable = ({
  assignments,
  isLoading = false,
  error = null,
  onRetry,
  onDelete,
  onBulkDelete,
}: UserFranchiseRoleTableProps) => {
  const columnFilters: ColumnFilter[] = [
    {
      id: "isDeleted",
      type: "select",
      label: "Status",
      options: [
        { label: "Active", value: "false" },
        { label: "Inactive", value: "true" },
      ],
    },
  ];

  const bulkActions: BulkAction<UserFranchiseRoleItem>[] = [];

  if (onBulkDelete) {
    bulkActions.push({
      label: "Remove Selected",
      icon: Trash2,
      onClick: onBulkDelete,
      variant: "destructive",
    });
  }

  return (
    <DataTable
      columns={userFranchiseRoleColumns}
      data={assignments}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search by user name, email, role, or franchise..."
      emptyMessage="No role assignments found."
      initialPageSize={10}
      enableRowSelection={!!onBulkDelete}
      enableColumnVisibility
      columnFilters={columnFilters}
      bulkActions={bulkActions}
      renderActions={(assignment) => (
        <>
          {onDelete && !assignment.isDeleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(assignment)}
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
