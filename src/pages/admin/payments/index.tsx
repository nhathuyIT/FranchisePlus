import { useMemo, useState } from "react";
import { z } from "zod";
import { PageHeader } from "@/components/common/PageHeader";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldConfig } from "@/lib/form/field-config";
import type { AdminPayment } from "@/types/admin-payment.type";
import {
  useConfirmPaymentMutation,
  usePaymentById,
  usePaymentByCode,
  usePaymentByOrderId,
  usePaymentsByCustomerId,
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

type PaymentLookupType = "code" | "orderId" | "paymentId" | "customerId";

const PAYMENT_LOOKUP_OPTIONS: {
  value: PaymentLookupType;
  label: string;
  placeholder: string;
}[] = [
  {
    value: "code",
    label: "Payment Code",
    placeholder: "Search by payment code...",
  },
  {
    value: "orderId",
    label: "Order ID",
    placeholder: "Search by order id...",
  },
  {
    value: "paymentId",
    label: "Payment ID",
    placeholder: "Search by payment id...",
  },
  {
    value: "customerId",
    label: "Customer ID",
    placeholder: "Search by customer id...",
  },
];

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
  const { getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  const canViewPayments = userPermissions.includes(Permission.VIEW_ORDERS);
  const canManagePayments = userPermissions.includes(Permission.MANAGE_ORDERS);

  const [lookupType, setLookupType] = useState<PaymentLookupType>("code");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchValue = useDebounce(searchInput.trim(), 350, searchInput);

  const viewDialog = useFormDialog<AdminPayment>();
  const confirmDialog = useFormDialog<AdminPayment>();
  const refundDialog = useFormDialog<AdminPayment>();

  const paymentByCodeQuery = usePaymentByCode(
    debouncedSearchValue,
    canViewPayments && lookupType === "code" && !!debouncedSearchValue,
  );

  const paymentByOrderIdQuery = usePaymentByOrderId(
    debouncedSearchValue,
    canViewPayments && lookupType === "orderId" && !!debouncedSearchValue,
  );

  const paymentByIdQuery = usePaymentById(
    debouncedSearchValue,
    canViewPayments && lookupType === "paymentId" && !!debouncedSearchValue,
  );

  const paymentsByCustomerIdQuery = usePaymentsByCustomerId(
    debouncedSearchValue,
    canViewPayments && lookupType === "customerId" && !!debouncedSearchValue,
  );

  const activeQuery =
    lookupType === "code"
      ? paymentByCodeQuery
      : lookupType === "orderId"
        ? paymentByOrderIdQuery
        : lookupType === "paymentId"
          ? paymentByIdQuery
          : paymentsByCustomerIdQuery;

  const tableError = activeQuery.error instanceof Error ? activeQuery.error : null;

  const confirmMutation = useConfirmPaymentMutation();
  const refundMutation = useRefundPaymentMutation();

  const payments = useMemo<AdminPayment[]>(() => {
    if (!canViewPayments || !debouncedSearchValue) {
      return [];
    }

    if (lookupType === "customerId") {
      return paymentsByCustomerIdQuery.data ?? [];
    }

    const singlePayment =
      lookupType === "code"
        ? paymentByCodeQuery.data
        : lookupType === "orderId"
          ? paymentByOrderIdQuery.data
          : paymentByIdQuery.data;

    return singlePayment ? [singlePayment] : [];
  }, [
    canViewPayments,
    debouncedSearchValue,
    lookupType,
    paymentByCodeQuery.data,
    paymentByOrderIdQuery.data,
    paymentByIdQuery.data,
    paymentsByCustomerIdQuery.data,
  ]);

  const isTableLoading =
    activeQuery.isLoading ||
    activeQuery.isFetching ||
    confirmMutation.isPending ||
    refundMutation.isPending;

  const activeSearchPlaceholder =
    PAYMENT_LOOKUP_OPTIONS.find((option) => option.value === lookupType)
      ?.placeholder ?? "Search payment...";

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
    if (!debouncedSearchValue) return;
    void activeQuery.refetch();
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

  const handleConfirmSubmit = async (data: ConfirmPaymentFormData) => {
    if (!confirmDialog.data) return;

    await confirmMutation.mutateAsync({
      paymentId: confirmDialog.data.id,
      data: {
        method: data.method,
        providerTxnId: data.providerTxnId?.trim() || undefined,
      },
    });
  };

  const handleRefundSubmit = async (data: RefundPaymentFormData) => {
    if (!refundDialog.data) return;

    await refundMutation.mutateAsync({
      paymentId: refundDialog.data.id,
      data: {
        refundReason: data.refundReason.trim(),
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Payment Management"
          description="Lookup payment by code/order/customer/id and process confirm/refund actions"
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <div className="mb-4 flex shrink-0 flex-wrap items-center gap-3">
            <Select
              value={lookupType}
              onValueChange={(value) => {
                setLookupType(value as PaymentLookupType);
                setSearchInput("");
              }}
            >
              <SelectTrigger className="w-52 border-[#E8DFD6] focus:border-[#6D4C41]">
                <SelectValue placeholder="Lookup Type" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_LOOKUP_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            searchPlaceholder={activeSearchPlaceholder}
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
                  : "CARD",
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
                orderId: viewDialog.data.orderId || "-",
                customerId: viewDialog.data.customerId || "-",
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
