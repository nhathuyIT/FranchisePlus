import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FranchiseTable } from "./components/FranchiseTable";
import {
  FormDialog,
  useFormDialog,
  DeleteDialog,
} from "@/components/form-dialog";
import { franchiseFields, franchiseSchema } from "./franchise-form.config";
import type { FranchiseFormData } from "@/lib/schemas/franchise.schema";
import type { Franchise } from "@/types/franchise";
import type { SubmitResult } from "@/components/form-dialog/types";
import { useFranchises, useDeleteFranchise } from "@/hooks/franchise";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import * as franchiseApi from "@/api/franchise/franchise.api";
import type {
  FranchiseCreateRequest,
  FranchiseUpdateRequest,
} from "@/api/franchise/franchise.type";
import { ROUTER_URL } from "@/router/route.const";

/**
 * Franchise List Page
 *
 * Permission-based access:
 * - ADMIN: Full access (view all, create, update, delete, restore, change status)
 * - MANAGER: No access to franchise list (backend returns 403 for search API)
 *   → Menu hidden via permission-mapping.ts (no VIEW_FRANCHISES)
 * - STAFF: No access to franchise list
 */
const FranchiseList = () => {
  const navigate = useNavigate();
  const { authUser, getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  // Permission checks
  const canViewFranchises = userPermissions.includes(
    Permission.VIEW_FRANCHISES,
  );
  const canManageFranchises = userPermissions.includes(
    Permission.MANAGE_FRANCHISES,
  );
  const canManageOwnFranchise = userPermissions.includes(
    Permission.MANAGE_OWN_FRANCHISE,
  );

  // Cache scope key for query isolation
  const franchiseScopeKey = authUser
    ? `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`
    : "anonymous";

  // Fetch all franchises if user has VIEW_FRANCHISES permission
  const {
    data: franchises = [],
    isLoading,
    error,
    refetch,
  } = useFranchises(canViewFranchises, franchiseScopeKey);

  const currentFranchiseId = authUser?.currentFranchiseId
    ? String(authUser.currentFranchiseId)
    : null;

  const deleteMutation = useDeleteFranchise({ suppressToast: true });
  const listError = error instanceof Error ? error : null;

  // Form dialog state using new hook
  const dialog = useFormDialog<Franchise>();

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Franchise | null>(null);
  const [bulkDeleteTargets, setBulkDeleteTargets] = useState<Franchise[]>([]);

  const refreshData = () => {
    void refetch();
  };

  // ── Form Submit Handler ──────────────────────────────────────────────────

  const handleSubmit = async (
    data: FranchiseFormData,
  ): Promise<SubmitResult | void> => {
    if (dialog.mode === "edit" && dialog.data) {
      // Update existing franchise
      const apiData: FranchiseUpdateRequest = {
        code: data.code,
        name: data.name,
        hotline: data.hotline || undefined,
        logoUrl: data.logoUrl || null,
        address: data.address,
        openedAt: data.openedAt || null,
        closedAt: data.closedAt || null,
      };

      const response = await franchiseApi.update(
        String(dialog.data.id),
        apiData,
      );

      if (!response) {
        throw new Error("Failed to update franchise");
      }

      // Update status if changed
      if (response.isActive !== data.isActive) {
        await franchiseApi.updateStatus(String(dialog.data.id), {
          isActive: data.isActive,
        });
      }

      toast.success("Franchise updated successfully");
    } else {
      // Create new franchise
      const apiData: FranchiseCreateRequest = {
        code: data.code,
        name: data.name,
        hotline: data.hotline || undefined,
        logoUrl: data.logoUrl || null,
        address: data.address,
        openedAt: data.openedAt || null,
        closedAt: data.closedAt || null,
      };

      const response = await franchiseApi.create(apiData);

      if (!response) {
        throw new Error("Failed to create franchise");
      }

      // Update status if needed
      if (response.isActive !== data.isActive) {
        await franchiseApi.updateStatus(response.id, {
          isActive: data.isActive,
        });
      }

      toast.success("Franchise created successfully");
    }
    // Errors are automatically caught by FormDialog and mapped to form fields
  };

  // ── Delete Handler ───────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(String(deleteTarget.id));
      toast.success(`Franchise "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
      refreshData();
    } catch {
      toast.error("Failed to delete franchise");
    }
  };

  const handleBulkDelete = (selectedFranchises: Franchise[]) => {
    if (!canManageFranchises) {
      toast.error("You do not have permission to delete franchises.");
      return;
    }

    setBulkDeleteTargets(selectedFranchises);
  };

  const executeBulkDelete = async () => {
    if (bulkDeleteTargets.length === 0) return;

    try {
      const results = await Promise.allSettled(
        bulkDeleteTargets.map((f) => deleteMutation.mutateAsync(String(f.id))),
      );

      const successCount = results.filter(
        (result) => result.status === "fulfilled",
      ).length;
      const failedCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} franchise(s)`);
      }

      if (failedCount > 0) {
        toast.error(
          `Failed to delete ${failedCount} franchise(s). Please try again.`,
        );
      }

      setBulkDeleteTargets([]);
      refreshData();
    } catch {
      toast.error("Failed to delete franchises. Please try again.");
    }
  };

  const handleEdit = (franchise: Franchise) => {
    // Admin can edit any franchise
    if (canManageFranchises) {
      dialog.openEdit(franchise);
      return;
    }

    // Manager can edit their own franchise
    const franchiseId = String(franchise.id);
    if (canManageOwnFranchise && franchiseId === currentFranchiseId) {
      dialog.openEdit(franchise);
      return;
    }

    toast.error("You do not have permission to edit this franchise.");
  };

  const handleView = (franchise: Franchise) => {
    if (!canViewFranchises) {
      toast.error("You do not have permission to view franchises.");
      return;
    }

    navigate(
      `${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}/${franchise.id}`,
    );
  };

  const handleOpenDelete = (franchise: Franchise) => {
    setDeleteTarget(franchise);
  };

  // Transform Franchise to form values (memoized to prevent unnecessary form resets)
  const formValues = useMemo((): FranchiseFormData | undefined => {
    if (!dialog.data) return undefined;
    return {
      code: dialog.data.code,
      name: dialog.data.name,
      hotline: dialog.data.hotline || "",
      logoUrl: dialog.data.logoUrl || "",
      address: dialog.data.address,
      openedAt: dialog.data.openedAt || "",
      closedAt: dialog.data.closedAt || "",
      isActive: dialog.data.isActive,
    };
  }, [dialog.data]);

  const dialogTitle = useMemo(() => {
    switch (dialog.mode) {
      case "create":
        return "Create Franchise";
      case "edit":
        return "Edit Franchise";
      case "view":
        return "View Franchise";
      default:
        return "Franchise";
    }
  }, [dialog.mode]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Franchise Management"
          description="Manage all your franchise locations"
          action={
            canManageFranchises ? (
              <Button
                onClick={dialog.openCreate}
                className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Franchise
              </Button>
            ) : undefined
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <FranchiseTable
            franchises={canViewFranchises ? franchises : []}
            isLoading={isLoading || deleteMutation.isPending}
            error={listError}
            onRetry={refetch}
            onBulkDelete={canManageFranchises ? handleBulkDelete : undefined}
            onEdit={
              canManageFranchises || canManageOwnFranchise
                ? handleEdit
                : undefined
            }
            onView={canViewFranchises ? handleView : undefined}
            onDelete={canManageFranchises ? handleOpenDelete : undefined}
          />
        </div>

        {/* Form Dialog using new reusable component */}
        <FormDialog<FranchiseFormData>
          open={dialog.isOpen}
          onOpenChange={(open) => !open && dialog.close()}
          title={dialogTitle}
          description={
            dialog.mode === "create"
              ? "Add a new franchise location. Fill in all required fields."
              : dialog.mode === "edit"
                ? "Update the franchise information below."
                : "Viewing franchise details."
          }
          size="lg"
          schema={franchiseSchema}
          fields={franchiseFields}
          values={formValues}
          mode={dialog.mode}
          onSubmit={handleSubmit}
          onSuccess={() => {
            dialog.close();
            refreshData();
          }}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteDialog<Franchise>
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          entityName="Franchise"
          entity={deleteTarget}
          isDeleting={deleteMutation.isPending}
          deleteMessage={(franchise: Franchise) =>
            `Are you sure you want to delete "${franchise.name}"? This action cannot be undone and will affect all associated data.`
          }
        />

        {/* Bulk Delete Confirmation Dialog */}
        <DeleteDialog<Franchise[]>
          open={bulkDeleteTargets.length > 0}
          onOpenChange={(open) => !open && setBulkDeleteTargets([])}
          onConfirm={executeBulkDelete}
          entityName="Franchises"
          entity={bulkDeleteTargets}
          isDeleting={deleteMutation.isPending}
          deleteMessage={`Are you sure you want to delete ${bulkDeleteTargets.length} franchise(s)? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default FranchiseList;
