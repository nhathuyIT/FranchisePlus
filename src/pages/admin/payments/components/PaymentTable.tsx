import { useMemo } from "react";
import { BadgeInfo, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnFilter } from "@/components/common/DataTable";
import type { AdminPayment } from "@/types/admin-payment.type";
import { createPaymentColumns } from "../columns/payment.columns";

interface PaymentTableProps {
  payments: AdminPayment[];
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
  onView?: (payment: AdminPayment) => void;
  onConfirm?: (payment: AdminPayment) => void;
  onRefund?: (payment: AdminPayment) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const PAYMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Refunded", value: "REFUNDED" },
];

const canConfirm = (payment: AdminPayment): boolean => {
  return payment.status === "PENDING";
};

const canRefund = (payment: AdminPayment): boolean => {
  return payment.status === "PAID";
};

export const PaymentTable = ({
  payments,
  pagination,
  isLoading = false,
  error = null,
  onRetry,
  onView,
  onConfirm,
  onRefund,
  searchValue,
  onSearchChange,
}: PaymentTableProps) => {
  const columns = useMemo(() => createPaymentColumns(), []);

  const columnFilters: ColumnFilter[] = [
    {
      id: "status",
      type: "select",
      label: "Payment Status",
      options: PAYMENT_STATUS_OPTIONS,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={payments}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      searchable
      searchPlaceholder="Search payment by code..."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      emptyMessage="No payments found matching your search."
      initialPageSize={10}
      serverPagination={pagination}
      enableColumnVisibility
      columnFilters={columnFilters}
      renderActions={(payment) => (
        <>
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(payment)}
              className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <BadgeInfo className="h-4 w-4" />
            </Button>
          )}

          {onConfirm && canConfirm(payment) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfirm(payment)}
              className="border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}

          {onRefund && canRefund(payment) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefund(payment)}
              className="border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    />
  );
};