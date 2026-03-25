import { useMemo, useState } from "react";
import { z } from "zod";
import { PageHeader } from "@/components/common/PageHeader";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import type { AdminPayment } from "@/types/admin-payment.type";
import {
  useConfirmPaymentMutation,
  usePaymentByCode,
  usePaymentsByFranchiseId,
  useRefundPaymentMutation,
} from "@/hooks/payment";
import { useDebounce } from "@/hooks/common/useDebounce";
import {
  ConfirmPaymentSchema,
  PAYMENT_METHOD_VALUES,
  type ConfirmPaymentFormData,
  RefundPaymentSchema,
  type RefundPaymentFormData,
} from "@/lib/schemas/payment-admin.schema";
import { PaymentTable } from "./components/PaymentTable";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import { useFranchiseSelect } from "@/hooks/franchise";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAYMENT_METHOD_OPTIONS = PAYMENT_METHOD_VALUES.map((method) => ({
  label: method,
  value: method,
}));

const isPaymentMethodValue = (
  method: string,
): method is (typeof PAYMENT_METHOD_VALUES)[number] => {
  return PAYMENT_METHOD_VALUES.includes(
    method as (typeof PAYMENT_METHOD_VALUES)[number],
  );
};

const PaymentViewSchema = z.object({
  code: z.string().optional(),
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  amount: z.string().optional(),
  method: z.string().optional(),
  status: z.string().optional(),
  providerTxnId: z.string().optional(),
  createdAt: z.string().optional(),
  paidAt: z.string().optional(),
  refundedAt: z.string().optional(),
  refundReason: z.string().optional(),
});

type PaymentViewFormData = z.infer<typeof PaymentViewSchema>;

const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return "0₫";
  return `${value.toLocaleString("vi-VN")}₫`;
};

const toDisplayDateTime = (value: string): string => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PaymentsPage = () => {
  const { authUser, getCurrentPermissions, isAdmin } = useAuthStore();
  const userPermissions = getCurrentPermissions();
  const isAdminUser = isAdmin();

  const canViewPayments = userPermissions.includes(Permission.VIEW_ORDERS);
  const canManagePayments = userPermissions.includes(Permission.MANAGE_ORDERS);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchCode = useDebounce(searchInput.trim(), 350, searchInput);

  const [selectedFranchiseId, setSelectedFranchiseId] = useState("");
  const activeFranchiseId = isAdminUser ? selectedFranchiseId : authUser?.currentFranchiseId || "";
  const { data: franchiseOptions = [] } = useFranchiseSelect();

  const viewDialog = useFormDialog<AdminPayment>();
  const confirmDialog = useFormDialog<AdminPayment>();
  const refundDialog = useFormDialog<AdminPayment>();

  const {
    data: paymentByCode,
    isLoading: isCodeLoading,
    isFetching: isCodeFetching,
    error: codeError,
    refetch: refetchCode,
  } = usePaymentByCode(
    debouncedSearchCode,
    !!debouncedSearchCode && canViewPayments,
  );

  const {
    data: paymentsByFranchise = [],
    isLoading: isFranchiseLoading,
    isFetching: isFranchiseFetching,
    error: franchiseError,
    refetch: refetchFranchise,
  } = usePaymentsByFranchiseId(
    activeFranchiseId,
    undefined,
    !!activeFranchiseId && !debouncedSearchCode && canViewPayments,
  );

  const tableError = (codeError || franchiseError) instanceof Error ? (codeError || franchiseError as Error) : null;

  const confirmMutation = useConfirmPaymentMutation();
  const refundMutation = useRefundPaymentMutation();

  const payments = useMemo<AdminPayment[]>(() => {
    if (!canViewPayments) return [];
    if (debouncedSearchCode && paymentByCode) return [paymentByCode];
    if (!debouncedSearchCode && paymentsByFranchise.length > 0) return paymentsByFranchise;
    return [];
  }, [canViewPayments, paymentByCode, paymentsByFranchise, debouncedSearchCode]);

  const isTableLoading = debouncedSearchCode 
    ? (isCodeLoading || isCodeFetching) 
    : (isFranchiseLoading || isFranchiseFetching);

  const confirmFields = useMemo<FieldConfig<ConfirmPaymentFormData>[]>(
    () => [
      {
        name: "method",
        type: "select",
        label: "Payment Method",
        required: true,
        options: PAYMENT_METHOD_OPTIONS,
      },
      {
        name: "providerTxnId",
        type: "text",
        label: "Provider Transaction ID",
        placeholder: "Optional - gateway transaction reference",
      },
    ],
    [],
  );

  const refundFields = useMemo<FieldConfig<RefundPaymentFormData>[]>(
    () => [
      {
        name: "refundReason",
        type: "textarea",
        label: "Refund Reason",
        placeholder: "Enter refund reason",
        required: true,
        rows: 4,
      },
    ],
    [],
  );

  const viewFields = useMemo<FieldConfig<PaymentViewFormData>[]>(
    () => [
      {
        name: "code",
        type: "text",
        label: "Payment Code",
      },
      {
        name: "status",
        type: "text",
        label: "Status",
      },
      {
        name: "orderId",
        type: "text",
        label: "Order ID",
      },
      {
        name: "customerId",
        type: "text",
        label: "Customer ID",
      },
      {
        name: "amount",
        type: "text",
        label: "Amount",
      },
      {
        name: "method",
        type: "text",
        label: "Method",
      },
      {
        name: "providerTxnId",
        type: "text",
        label: "Provider Txn ID",
      },
      {
        name: "createdAt",
        type: "text",
        label: "Created At",
      },
      {
        name: "paidAt",
        type: "text",
        label: "Paid At",
      },
      {
        name: "refundedAt",
        type: "text",
        label: "Refunded At",
      },
      {
        name: "refundReason",
        type: "textarea",
        label: "Refund Reason",
        rows: 3,
        colSpan: 2,
      },
    ],
    [],
  );

  const handleRetry = () => {
    if (debouncedSearchCode) void refetchCode();
    else void refetchFranchise();
  };

  const handleView = (payment: AdminPayment) => {
    viewDialog.openView(payment);
  };

  const handleOpenConfirm = (payment: AdminPayment) => {
    if (!canManagePayments) return;
    confirmDialog.openEdit(payment);
  };

  const handleOpenRefund = (payment: AdminPayment) => {
    if (!canManagePayments) return;
    refundDialog.openEdit(payment);
  };

  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleConfirmSubmit = async (data: ConfirmPaymentFormData) => {
    if (!confirmDialog.data) return;

    setIsActionLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      await confirmMutation.mutateAsync({
        paymentId: confirmDialog.data.id,
        data: {
          method: data.method,
          providerTxnId: data.providerTxnId?.trim() || undefined,
        },
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRefundSubmit = async (data: RefundPaymentFormData) => {
    if (!refundDialog.data) return;

    setIsActionLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      await refundMutation.mutateAsync({
        paymentId: refundDialog.data.id,
        data: {
          refundReason: data.refundReason.trim(),
        },
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <NormalLoadingLayout forceShow={isActionLoading} />
      <div className="flex-1 flex flex-col min-h-0 max-w-screen-2xl mx-auto w-full">
        <PageHeader
          title="Payment Management"
          description="Search payment by code and process confirm/refund actions"
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          {isAdminUser && (
            <div className="mb-4 flex shrink-0 flex-wrap items-center gap-3">
              <Select
                value={selectedFranchiseId || "all"}
                onValueChange={(value) =>
                  setSelectedFranchiseId(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-52 border-[#E8DFD6] focus:border-[#6D4C41]">
                  <SelectValue placeholder="All Franchises" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Franchises</SelectItem>
                  {franchiseOptions.map((franchise: any) => (
                    <SelectItem key={franchise.value} value={franchise.value}>
                      {franchise.name} ({franchise.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <PaymentTable
            payments={payments}
            isLoading={isTableLoading}
            error={tableError}
            onRetry={handleRetry}
            onView={canViewPayments ? handleView : undefined}
            onConfirm={canManagePayments ? handleOpenConfirm : undefined}
            onRefund={canManagePayments ? handleOpenRefund : undefined}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
          />
        </div>
      </div>

      <FormDialog<ConfirmPaymentFormData>
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && confirmDialog.close()}
        title="Confirm Payment"
        description={
          confirmDialog.data
            ? `Payment code: ${confirmDialog.data.code}`
            : "Confirm selected payment"
        }
        schema={ConfirmPaymentSchema}
        fields={confirmFields}
        values={
          confirmDialog.data
            ? {
                method: isPaymentMethodValue(confirmDialog.data.method)
                  ? confirmDialog.data.method
                  : "COD",
                providerTxnId: confirmDialog.data.providerTxnId || "",
              }
            : undefined
        }
        mode="edit"
        onSubmit={handleConfirmSubmit}
        onSuccess={() => {
          confirmDialog.close();
        }}
        size="md"
      />

      <FormDialog<RefundPaymentFormData>
        open={refundDialog.isOpen}
        onOpenChange={(open) => !open && refundDialog.close()}
        title="Refund Payment"
        description={
          refundDialog.data
            ? `Payment code: ${refundDialog.data.code}`
            : "Refund selected payment"
        }
        schema={RefundPaymentSchema}
        fields={refundFields}
        mode="edit"
        onSubmit={handleRefundSubmit}
        onSuccess={() => {
          refundDialog.close();
        }}
        size="md"
      />

      <FormDialog<PaymentViewFormData>
        open={viewDialog.isOpen}
        onOpenChange={(open) => !open && viewDialog.close()}
        title="Payment Details"
        description={viewDialog.data ? `Code: ${viewDialog.data.code}` : undefined}
        schema={PaymentViewSchema}
        fields={viewFields}
        values={
          viewDialog.data
            ? {
                code: viewDialog.data.code || "-",
                orderId:
                  typeof viewDialog.data.orderId === "object" && viewDialog.data.orderId !== null
                    ? viewDialog.data.orderId.code || "-"
                    : String(viewDialog.data.orderId || "-"),
                customerId:
                  typeof viewDialog.data.customerId === "object" && viewDialog.data.customerId !== null
                    ? viewDialog.data.customerId.name || "-"
                    : String(viewDialog.data.customerId || "-"),
                amount: formatCurrency(viewDialog.data.amount),
                method: viewDialog.data.method || "-",
                status: viewDialog.data.status || "-",
                providerTxnId: viewDialog.data.providerTxnId || "-",
                createdAt: toDisplayDateTime(viewDialog.data.createdAt),
                paidAt: toDisplayDateTime(viewDialog.data.paidAt),
                refundedAt: toDisplayDateTime(viewDialog.data.refundedAt),
                refundReason: viewDialog.data.refundReason || "-",
              }
            : undefined
        }
        mode="view"
        onSubmit={async () => undefined}
        size="lg"
        columns={2}
      />
    </div>
  );
};

export default PaymentsPage;
