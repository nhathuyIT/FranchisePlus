import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/common/useDebounce";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { CustomerTable } from "./components/CustomerTable";
import {
  FormDialog,
  useFormDialog,
  DeleteDialog,
} from "@/components/form-dialog";
import { userFields, userSchema } from "./user-form.config";
import type { UserFormData } from "./user-form.config";
import type { User } from "@/types/user.type";
import type { SubmitResult } from "@/components/form-dialog/types";
import {
  useUserSearch,
  useDeleteUser,
  useUpdateUserStatus,
} from "@/hooks/user";
import * as userApi from "@/api/user/user.api";

const UserCRUD = () => {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 350, keyword);

  const {
    data: searchResult,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useUserSearch({
    searchCondition: {
      keyword: debouncedKeyword || undefined,
      isActive: undefined,
      isDeleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 1000,
    },
  });

  const deleteMutation = useDeleteUser({ suppressToast: true });
  const userStatusMutation = useUpdateUserStatus();

  const users = searchResult?.pageData ?? [];

  // Form dialog state
  const dialog = useFormDialog<User>();

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [bulkDeleteTargets, setBulkDeleteTargets] = useState<User[]>([]);

  const refreshData = () => {
    void refetch();
  };

  // ── Form Submit Handler ──────────────────────────────────────────────────

  const handleSubmit = async (
    data: UserFormData,
  ): Promise<SubmitResult | void> => {
    if (dialog.mode === "edit" && dialog.data) {
      // Update existing user
      const response = await userApi.update(String(dialog.data.id), {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        avatarUrl: data.avatarUrl || undefined,
        ...(data.password ? { password: data.password } : {}),
      });

      if (!response) {
        throw new Error("Failed to update user");
      }

      // Update status if changed
      if (response.isActive !== data.isActive) {
        await userApi.updateStatus(String(dialog.data.id), {
          isActive: data.isActive,
        });
      }

      toast.success("User updated successfully");
    } else {
      // Create new user
      const response = await userApi.create({
        email: data.email,
        password: data.password || "",
        name: data.name,
        phone: data.phone || "",
        avatarUrl: data.avatarUrl || undefined,
      });

      if (!response) {
        throw new Error("Failed to create user");
      }

      // Update status if needed
      if (response.isActive !== data.isActive) {
        await userApi.updateStatus(String(response.id), {
          isActive: data.isActive,
        });
      }

      toast.success("User created successfully");
    }
  };

  // ── Delete Handler ───────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(String(deleteTarget.id));
      toast.success(`User "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
      refreshData();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleBulkDelete = (selectedUsers: User[]) => {
    setBulkDeleteTargets(selectedUsers);
  };

  const executeBulkDelete = async () => {
    if (bulkDeleteTargets.length === 0) return;

    try {
      const results = await Promise.allSettled(
        bulkDeleteTargets.map((u) => deleteMutation.mutateAsync(String(u.id))),
      );

      const successCount = results.filter(
        (result) => result.status === "fulfilled",
      ).length;
      const failedCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} user(s)`);
      }

      if (failedCount > 0) {
        toast.error(
          `Failed to delete ${failedCount} user(s). Please try again.`,
        );
      }
      console.log("");

      setBulkDeleteTargets([]);
      refreshData();
    } catch {
      toast.error("Failed to delete users. Please try again.");
    }
  };

  // Transform User to form values (memoized to prevent unnecessary form resets)
  const formValues = useMemo((): UserFormData | undefined => {
    if (!dialog.data) return undefined;
    return {
      name: dialog.data.name,
      email: dialog.data.email,
      password: "",
      phone: dialog.data.phone || "",
      avatarUrl: dialog.data.avatarUrl || "",
      isActive: dialog.data.isActive,
    };
  }, [dialog.data]);

  const dialogTitle = useMemo(() => {
    switch (dialog.mode) {
      case "create":
        return "Create User";
      case "edit":
        return "Edit User";
      case "view":
        return "View User";
      default:
        return "User";
    }
  }, [dialog.mode]);

  const handleStatusToggle = (user: User, isActive: boolean) => {
    userStatusMutation.mutate({ id: String(user.id), isActive });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-screen-2xl mx-auto w-full">
        <PageHeader
          title="User Management"
          description="Manage all your users"
          action={
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <CustomerTable
            customers={users}
            isLoading={isLoading || isFetching || deleteMutation.isPending}
            error={
              error
                ? error instanceof Error
                  ? error
                  : new Error("Failed to load users")
                : null
            }
            onRetry={() => void refetch()}
            onBulkDelete={handleBulkDelete}
            onEdit={dialog.openEdit}
            onView={dialog.openView}
            onDelete={(user) => setDeleteTarget(user)}
            onStatusToggle={handleStatusToggle}
            statusPendingId={
              userStatusMutation.isPending
                ? String(userStatusMutation.variables?.id)
                : null
            }
            canEdit={true}
            searchValue={keyword}
            onSearchChange={setKeyword}
          />
        </div>

        {/* Form Dialog */}
        <FormDialog<UserFormData>
          open={dialog.isOpen}
          onOpenChange={(open) => !open && dialog.close()}
          title={dialogTitle}
          description={
            dialog.mode === "create"
              ? "Add a new user. Fill in all required fields."
              : dialog.mode === "edit"
                ? "Update the user information below."
                : "Viewing user details."
          }
          size="lg"
          schema={userSchema}
          fields={userFields}
          values={formValues}
          mode={dialog.mode}
          onSubmit={handleSubmit}
          onSuccess={() => {
            dialog.close();
            refreshData();
          }}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteDialog<User>
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          entityName="User"
          entity={deleteTarget}
          isDeleting={deleteMutation.isPending}
          deleteMessage={(user: User) =>
            `Are you sure you want to delete "${user.name}"? This action cannot be undone.`
          }
        />

        {/* Bulk Delete Confirmation Dialog */}
        <DeleteDialog<User[]>
          open={bulkDeleteTargets.length > 0}
          onOpenChange={(open) => !open && setBulkDeleteTargets([])}
          onConfirm={executeBulkDelete}
          entityName="Users"
          entity={bulkDeleteTargets}
          isDeleting={deleteMutation.isPending}
          deleteMessage={`Are you sure you want to delete ${bulkDeleteTargets.length} user(s)? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default UserCRUD;
