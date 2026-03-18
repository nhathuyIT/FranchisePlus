import { useMemo } from "react";
import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnFilter } from "@/components/common/DataTable";
import type { Promotion } from "@/types/promotion";
import { createPromotionColumns } from "../columns/promotion.columns";

interface PromotionTableProps {
  promotions: Promotion[];
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
  onView?: (promotion: Promotion) => void;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
  onRestore?: (promotion: Promotion) => void;
}

export const PromotionTable = ({
  promotions,
  pagination,
  isLoading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: PromotionTableProps) => {
  const columns = useMemo(() => createPromotionColumns(), []);

  const columnFilters: ColumnFilter[] = [
    {
      id: "type",
      type: "select",
      label: "Promotion Type",
      options: [
        { label: "Percent", value: "PERCENT" },
        { label: "Fixed", value: "FIXED" },
      ],
    },
    {
      id: "isDeleted",
      type: "select",
      label: "Record State",
      options: [
        { label: "Active", value: "false" },
        { label: "Deleted", value: "true" },
      ],
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={promotions}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search promotion by name, franchise name, product name..."
      emptyMessage="No promotions found matching your search."
      initialPageSize={10}
      serverPagination={pagination}
      enableColumnVisibility
      columnFilters={columnFilters}
      renderActions={(promotion) => (
        <>
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(promotion)}
              className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && !promotion.isDeleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(promotion)}
              className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}

          {onDelete && !promotion.isDeleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(promotion)}
              className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {onRestore && promotion.isDeleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(promotion)}
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    />
  );
};
