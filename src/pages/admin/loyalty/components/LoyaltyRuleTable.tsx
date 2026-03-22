import { useMemo } from "react";
import { Eye, Pencil } from "lucide-react";
import { DataTable, type ColumnFilter } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import type { LoyaltyRule } from "@/types/loyalty-rule";
import { createLoyaltyRuleColumns } from "../columns/loyalty-rule.columns";

interface LoyaltyRuleTableProps {
  loyaltyRules: LoyaltyRule[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onView?: (item: LoyaltyRule) => void;
  onEdit?: (item: LoyaltyRule) => void;
  toolbarPrefix?: React.ReactNode;
  pagination?: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (pageNum: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

export const LoyaltyRuleTable = ({
  loyaltyRules,
  isLoading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  toolbarPrefix,
  pagination,
}: LoyaltyRuleTableProps) => {
  const columns = useMemo(() => createLoyaltyRuleColumns(), []);

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

  return (
    <DataTable
      columns={columns}
      data={loyaltyRules}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      emptyMessage="No loyalty rules found."
      initialPageSize={10}
      serverPagination={pagination}
      enableColumnVisibility
      columnFilters={columnFilters}
      toolbarPrefix={toolbarPrefix}
      renderActions={(item) => (
        <>
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(item)}
              className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    />
  );
};
