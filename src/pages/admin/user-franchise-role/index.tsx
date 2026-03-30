import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/common/useDebounce";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import { UserFranchiseRoleTable } from "./components/UserFranchiseRoleTable";
import {
  FormDialog,
  useFormDialog,
  DeleteDialog,
} from "@/components/form-dialog";
import {
  buildUserFranchiseRoleFields,
  userFranchiseRoleSchema,
  type UserFranchiseRoleFormData,
} from "./user-franchise-role-form.config";
import type { UserFranchiseRoleItem } from "@/api/user-franchise-role";
import type { SubmitResult } from "@/components/form-dialog/types";
import {
  useUserFranchiseRoleSearch,
  useDeleteUserFranchiseRole,
  useRoles,
} from "@/hooks/user-franchise-role";
import { useFranchiseSelect } from "@/hooks/franchise";
import * as ufrApi from "@/api/user-franchise-role/user-franchise-role.api";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";

/**
 * User Franchise Role Management Page
 *
 * Allows ADMIN to assign or remove roles from users per franchise context.
 */
const UserFranchiseRolePage = () => {
  const [isActionPending, setIsActionPending] = useState(false);
  const { getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  const canManage = userPermissions.includes(
    Permission.MANAGE_USER_FRANCHISE_ROLES,
  );
  const canView = userPermissions.includes(
    Permission.VIEW_USER_FRANCHISE_ROLES,
  );

  // ── Data Fetching ────────────────────────────────────────────────────────

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 350, keyword);

  const {
    data: searchResult,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useUserFranchiseRoleSearch({
    searchCondition: {
      isDeleted: false,
      ...(debouncedKeyword ? { keyword: debouncedKeyword } : {}),
    },
    pageInfo: { pageNum: 1, pageSize: 100 },
  });

  const { data: roles = [] } = useRoles();
  const { data: franchiseSelectItems = [] } = useFranchiseSelect();

  const assignments = searchResult?.pageData ?? [];
  const listError = error instanceof Error ? error : null;

  // ── Options for Form ─────────────────────────────────────────────────────

  const roleOptions = useMemo(
    () =>
      roles.map((r) => ({
        label: r.name,
        value: r.value,
      })),
    [roles],
  );

  const franchiseOptions = useMemo(
    () =>
      franchiseSelectItems.map((f) => ({
        label: `${f.name} (${f.code})`,
        value: f.value,
      })),
    [franchiseSelectItems],
  );

  const formFields = useMemo(
    () => buildUserFranchiseRoleFields(roleOptions, franchiseOptions, roles),
    [roleOptions, franchiseOptions, roles],
  );

  // ── Dialog State ─────────────────────────────────────────────────────────

  const dialog = useFormDialog<UserFranchiseRoleItem>();
  const [deleteTarget, setDeleteTarget] =
    useState<UserFranchiseRoleItem | null>(null);

  const deleteMutation = useDeleteUserFranchiseRole({ suppressToast: true });

  const refreshData = () => void refetch();

  // ── Form Submit ──────────────────────────────────────────────────────────

  const handleSubmit = async (
    data: UserFranchiseRoleFormData,
  ): Promise<SubmitResult | void> => {
    setIsActionPending(true);
    try {
      const selectedRole = roles.find((r) => r.value === data.roleId);
      const isGlobalRole = selectedRole?.scope === "GLOBAL";

      const response = await ufrApi.create({
        userId: data.userId,
        franchiseId:
          isGlobalRole ||
          data.franchiseId === "__global__" ||
          !data.franchiseId
            ? null
            : data.franchiseId,
        roleId: data.roleId,
      });

      if (!response) {
        throw new Error("Failed to assign role");
      }

      toast.success("Role assigned successfully");
    } finally {
      setIsActionPending(false);
    }
  };

  // ── Delete Handler ───────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Role assignment removed");
      setDeleteTarget(null);
      refreshData();
    } catch {
      toast.error("Failed to remove assignment");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col">
      <NormalLoadingLayout
        forceShow={isActionPending || deleteMutation.isPending}
      />
      <div className="flex-1 flex flex-col min-h-0 max-w-screen-2xl mx-auto w-full">
        <PageHeader
          title="User Franchise Roles"
          description="Manage which users hold which roles across franchise locations"
          action={
            canManage ? (
              <Button
                onClick={dialog.openCreate}
                className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Assign Role
              </Button>
            ) : undefined
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <UserFranchiseRoleTable
            assignments={canView ? assignments : []}
            isLoading={isLoading || isFetching || deleteMutation.isPending}
            error={listError}
            onRetry={refetch}
            onDelete={canManage ? (a) => setDeleteTarget(a) : undefined}
            searchValue={keyword}
            onSearchChange={setKeyword}
          />
        </div>

        {/* Assign Role Form Dialog */}
        <FormDialog<UserFranchiseRoleFormData>
          open={dialog.isOpen}
          onOpenChange={(open) => !open && dialog.close()}
          title="Assign Role to User"
          description="Select a user, the franchise context, and the role you want to assign."
          size="md"
          schema={userFranchiseRoleSchema}
          fields={formFields}
          mode="create"
          onSubmit={handleSubmit}
          onSuccess={() => {
            dialog.close();
            refreshData();
          }}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteDialog<UserFranchiseRoleItem>
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          entityName="Role Assignment"
          entity={deleteTarget}
          isDeleting={deleteMutation.isPending}
          deleteMessage={(a: UserFranchiseRoleItem) =>
            `Remove the "${a.roleName ?? a.roleCode}" role from "${a.userName}"${a.franchiseName ? ` at ${a.franchiseName}` : ""}? This action cannot be undone.`
          }
        />
      </div>
    </div>
  );
};

export default UserFranchiseRolePage;
