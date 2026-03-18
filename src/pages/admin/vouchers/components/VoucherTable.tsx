import { useMemo } from "react";
import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnFilter } from "@/components/common/DataTable";
import type { Voucher } from "@/types/voucher";
import { createVoucherColumns } from "../columns/voucher.columns";

interface VoucherTableProps {
  vouchers: Voucher[];
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
  onView?: (voucher: Voucher) => void;
  onEdit?: (voucher: Voucher) => void;
  onDelete?: (voucher: Voucher) => void;
  onRestore?: (voucher: Voucher) => void;
}

export const VoucherTable = ({
  vouchers,
  pagination,
  isLoading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: VoucherTableProps) => {
  const columns = useMemo(() => createVoucherColumns(), []);

  const columnFilters: ColumnFilter[] = [
    {
      id: "type",
      type: "select",
      label: "Voucher Type",
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
      data={vouchers}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search voucher by code, name, franchise name, product name..."
      emptyMessage="No vouchers found matching your search."
      initialPageSize={10}
      serverPagination={pagination}
      enableColumnVisibility
      columnFilters={columnFilters}
      renderActions={(voucher) => (
        <>
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(voucher)}
              className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onEdit && !voucher.isDeleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(voucher)}
              className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}

          {onDelete && !voucher.isDeleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(voucher)}
              className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {onRestore && voucher.isDeleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(voucher)}
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
