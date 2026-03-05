import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { CustomerTable } from "./components/CustomerTable";
import { CrudDialog } from "@/components/crud/CrudDialog";
import { useCrudDialog } from "@/hooks/crud";
import { customerConfig } from "./customer.config";
import { useUserSearch, useDeleteUser } from "@/hooks/user";
import type { UserSearchRequest } from "@/api/user/user.type";
import type { User } from "@/types/user.type";

const UserCRUD = () => {
  const [searchParams] = useState<UserSearchRequest>({
    searchCondition: {
      keyword: "",
      isActive: undefined,
      isDeleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
  });

  const {
    data: searchResult,
    isLoading,
    error,
    refetch,
  } = useUserSearch(searchParams);
  const deleteUser = useDeleteUser();

  const users = searchResult?.pageData ?? [];

  // CRUD Dialog state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dialog = useCrudDialog<any>();

  // Refresh data after CRUD operations
  const refreshData = () => {
    refetch();
    dialog.close();
  };

  // Single Delete Handler (from row action button)
  const handleSingleDelete = (user: User) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
    );
    if (!confirmDelete) return;
    deleteUser.mutateAsync(String(user.id)).then(() => refetch());
  };

  // Bulk Delete Handler (from checkbox selection)
  const handleBulkDelete = async (selectedUsers: User[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    for (const user of selectedUsers) {
      await deleteUser.mutateAsync(String(user.id));
    }
    refetch();
  };

  // Retry Handler
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="User Management"
          description="Manage all your user"
          action={
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add user
            </Button>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <CustomerTable
            customers={users}
            isLoading={isLoading}
            error={
              error
                ? error instanceof Error
                  ? error
                  : new Error("Failed to load users")
                : null
            }
            onRetry={handleRetry}
            onBulkDelete={handleBulkDelete}
            onEdit={dialog.openUpdate}
            onView={dialog.openView}
            onDelete={handleSingleDelete}
          />
        </div>

        {/* CRUD Dialog */}
        <CrudDialog
          config={customerConfig}
          dialog={dialog}
          onSuccess={refreshData}
        />
      </div>
    </div>
  );
};

export default UserCRUD;
