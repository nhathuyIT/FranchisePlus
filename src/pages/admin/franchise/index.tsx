import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FranchiseTable } from "./components/FranchiseTable";
import { CrudDialog } from "@/components/crud/CrudDialog";
import { useCrudDialog } from "@/hooks/crud";
import { franchiseConfig } from "./franchise.config";
import type { Franchise } from "@/types/franchise";
import { useFranchises, useDeleteFranchise } from "@/hooks/franchise";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";

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
  const { authUser, getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  // Permission checks
  const canViewFranchises = userPermissions.includes(Permission.VIEW_FRANCHISES);
  const canManageFranchises = userPermissions.includes(Permission.MANAGE_FRANCHISES);
  const canManageOwnFranchise = userPermissions.includes(Permission.MANAGE_OWN_FRANCHISE);

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

  const dialog = useCrudDialog<Franchise>();

  const refreshData = () => {
    refetch();
    dialog.close();
  };

  const handleBulkDelete = async (selectedFranchises: Franchise[]) => {
    if (!canManageFranchises) {
      toast.error("You do not have permission to delete franchises.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedFranchises.length} franchise(s)? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const results = await Promise.allSettled(
        selectedFranchises.map((f) => deleteMutation.mutateAsync(String(f.id)))
      );

      const successCount = results.filter((result) => result.status === "fulfilled").length;
      const failedCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} franchise(s)`);
      }

      if (failedCount > 0) {
        toast.error(`Failed to delete ${failedCount} franchise(s). Please try again.`);
      }
    } catch {
      toast.error("Failed to delete franchises. Please try again.");
    }
  };

  const handleEdit = (franchise: Franchise) => {
    // Admin can edit any franchise
    if (canManageFranchises) {
      dialog.openUpdate(franchise);
      return;
    }

    // Manager can edit their own franchise
    const franchiseId = String(franchise.id);
    if (canManageOwnFranchise && franchiseId === currentFranchiseId) {
      dialog.openUpdate(franchise);
      return;
    }

    toast.error("You do not have permission to edit this franchise.");
  };

  const handleView = (franchise: Franchise) => {
    if (!canViewFranchises) {
      toast.error("You do not have permission to view franchises.");
      return;
    }

    // All users with VIEW_FRANCHISES can view any franchise details
    dialog.openView(franchise);
  };

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
            onEdit={canManageFranchises || canManageOwnFranchise ? handleEdit : undefined}
            onView={canViewFranchises ? handleView : undefined}
            onDelete={canManageFranchises ? dialog.openDelete : undefined}
          />
        </div>

        <CrudDialog
          config={franchiseConfig}
          dialog={dialog}
          onSuccess={refreshData}
        />
      </div>
    </div>
  );
};

export default FranchiseList;
