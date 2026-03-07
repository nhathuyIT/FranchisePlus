import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { CustomerAdminTable } from "./components/CustomerAdminTable";
import {
  FormDialog,
  useFormDialog,
  DeleteDialog,
} from "@/components/form-dialog";
import {
  customerAdminFields,
  customerAdminSchema,
  type CustomerAdminFormData,
} from "./customer-admin-form.config";
import type { CustomerProfile } from "@/types/customer";
import type { SubmitResult } from "@/components/form-dialog/types";
import {
  useCustomerAdminSearch,
  useDeleteCustomerAdmin,
} from "@/hooks/customer";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import * as customerAdminApi from "@/api/customer/customer-admin.api";

const CustomerAdminList = () => {
  const { getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  const canViewCustomers = userPermissions.includes(Permission.VIEW_CUSTOMERS);
  const canManageCustomers = userPermissions.includes(
    Permission.MANAGE_CUSTOMERS,
  );

  const pageNum = 1;
  const pageSize = 10;

  const searchParams = useMemo(
    () => ({
      searchCondition: { isDeleted: false },
      pageInfo: { pageNum, pageSize },
    }),
    [pageNum],
  );

  const {
    data: searchResult,
    isLoading,
    error,
    refetch,
  } = useCustomerAdminSearch(searchParams);

  const customers: CustomerProfile[] = searchResult?.pageData ?? [];

  const deleteMutation = useDeleteCustomerAdmin({ suppressToast: true });
  const listError = error instanceof Error ? error : null;

  const dialog = useFormDialog<CustomerProfile>();
  const [deleteTarget, setDeleteTarget] = useState<CustomerProfile | null>(
    null,
  );
  const [bulkDeleteTargets, setBulkDeleteTargets] = useState<CustomerProfile[]>(
    [],
  );

  const refreshData = () => {
    void refetch();
  };

  // ── Form Submit Handler ──────────────────────────────────────────────────

  const handleSubmit = async (
    data: CustomerAdminFormData,
  ): Promise<SubmitResult | void> => {
    if (dialog.mode !== "edit" || !dialog.data) return;

    const customerId = dialog.data.id;

    const updatePayload = {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      avatarUrl: data.avatarUrl || undefined,
    };

    const response = await customerAdminApi.update(customerId, updatePayload);

    if (!response) {
      throw new Error("Failed to update customer");
    }

    // Update status separately if it has changed
    if (response.isActive !== data.isActive) {
      await customerAdminApi.updateStatus(customerId, {
        isActive: data.isActive,
      });
    }

    toast.success("Customer updated successfully");
  };

  // ── Delete Handler ───────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Customer "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
      refreshData();
    } catch {
      toast.error("Failed to delete customer");
    }
  };

  const handleBulkDelete = (selected: CustomerProfile[]) => {
    if (!canManageCustomers) {
      toast.error("You do not have permission to delete customers.");
      return;
    }
    setBulkDeleteTargets(selected);
  };

  const executeBulkDelete = async () => {
    if (bulkDeleteTargets.length === 0) return;

    try {
      const results = await Promise.allSettled(
        bulkDeleteTargets.map((c) => deleteMutation.mutateAsync(c.id)),
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const failedCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} customer(s)`);
      }
      if (failedCount > 0) {
        toast.error(
          `Failed to delete ${failedCount} customer(s). Please try again.`,
        );
      }

      setBulkDeleteTargets([]);
      refreshData();
    } catch {
      toast.error("Failed to delete customers. Please try again.");
    }
  };

  // ── Action Handlers ──────────────────────────────────────────────────────

  const handleEdit = (customer: CustomerProfile) => {
    if (!canManageCustomers) {
      toast.error("You do not have permission to edit customers.");
      return;
    }
    dialog.openEdit(customer);
  };

  const handleView = (customer: CustomerProfile) => {
    if (!canViewCustomers) {
      toast.error("You do not have permission to view customers.");
      return;
    }
    dialog.openView(customer);
  };

  const handleOpenDelete = (customer: CustomerProfile) => {
    setDeleteTarget(customer);
  };

  // ── Form Values ──────────────────────────────────────────────────────────

  const formValues = useMemo((): CustomerAdminFormData | undefined => {
    if (!dialog.data) return undefined;
    return {
      name: dialog.data.name,
      email: dialog.data.email || "",
      phone: dialog.data.phone || "",
      address: dialog.data.address || "",
      avatarUrl: dialog.data.avatarUrl || "",
      isActive: dialog.data.isActive,
    };
  }, [dialog.data]);

  const dialogTitle = useMemo(() => {
    switch (dialog.mode) {
      case "edit":
        return "Edit Customer";
      case "view":
        return "View Customer";
      default:
        return "Customer";
    }
  }, [dialog.mode]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Customer Management"
          description="View and manage registered customers"
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <CustomerAdminTable
            customers={canViewCustomers ? customers : []}
            isLoading={isLoading || deleteMutation.isPending}
            error={listError}
            onRetry={refetch}
            onBulkDelete={canManageCustomers ? handleBulkDelete : undefined}
            onEdit={canManageCustomers ? handleEdit : undefined}
            onView={canViewCustomers ? handleView : undefined}
            onDelete={canManageCustomers ? handleOpenDelete : undefined}
          />
        </div>

        {/* Form Dialog — edit / view only (no create) */}
        <FormDialog<CustomerAdminFormData>
          open={dialog.isOpen}
          onOpenChange={(open) => !open && dialog.close()}
          title={dialogTitle}
          description={
            dialog.mode === "edit"
              ? "Update the customer's information below."
              : "Viewing customer details."
          }
          size="lg"
          schema={customerAdminSchema}
          fields={customerAdminFields}
          values={formValues}
          mode={dialog.mode}
          onSubmit={handleSubmit}
          onSuccess={() => {
            dialog.close();
            refreshData();
          }}
        />

        {/* Single delete confirmation */}
        <DeleteDialog<CustomerProfile>
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          entity={deleteTarget}
          entityName="Customer"
          deleteMessage={(c) =>
            `Are you sure you want to delete "${c.name}"? This action can be undone later.`
          }
          onConfirm={handleDelete}
          isDeleting={deleteMutation.isPending}
        />

        {/* Bulk delete confirmation */}
        <DeleteDialog<{ id: string; name: string }>
          open={bulkDeleteTargets.length > 0}
          onOpenChange={(open) => !open && setBulkDeleteTargets([])}
          entity={
            bulkDeleteTargets.length > 0
              ? {
                  id: "bulk",
                  name: `${bulkDeleteTargets.length} selected customer(s)`,
                }
              : null
          }
          entityName="Customers"
          deleteMessage={(e) =>
            `Are you sure you want to delete ${e.name}? This action can be undone later.`
          }
          onConfirm={executeBulkDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};

export default CustomerAdminList;
