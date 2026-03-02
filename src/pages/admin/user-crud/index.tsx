import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CustomerDataMock } from "@/const/customer.const";
import { PageHeader } from "@/components/common/PageHeader";
import { CustomerTable } from "./components/CustomerTable";
import { CrudDialog } from "@/components/crud/CrudDialog";
import { useCrudDialog } from "@/hooks/crud";
import { customerConfig } from "./customer.config";
import type { Customer } from "@/types/customer";

const UserCRUD = () => {
  const [customers, setCustomers] = useState<Customer[]>(CustomerDataMock);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // CRUD Dialog state
  const dialog = useCrudDialog<Customer>();

  // Refresh data after CRUD operations
  const refreshData = () => {
    // TODO: Replace with actual API call
    setCustomers([...CustomerDataMock]);
    dialog.close();
  };

  // Bulk Delete Handler
  const handleBulkDelete = async (selectedCustomers: Customer[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCustomers.length} customer(s)? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await deleteCustomers(selectedCustomers.map(c => c.id));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove deleted customers from state
      const deletedIds = new Set(selectedCustomers.map((c) => c.id));
      setCustomers((prev) => prev.filter((c) => !deletedIds.has(c.id)));

      toast.success(
        `Successfully deleted ${selectedCustomers.length} customer(s)`,
      );
    } catch (err) {
      toast.error("Failed to delete customers. Please try again.");
      setError(
        err instanceof Error ? err : new Error("Failed to delete customers"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Retry Handler
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);

    // TODO: Replace with actual data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Customer Management"
          description="Manage all your customers"
          action={
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <CustomerTable
            customers={customers}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onBulkDelete={handleBulkDelete}
            onEdit={dialog.openUpdate}
            onView={dialog.openView}
            onDelete={dialog.openDelete}
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
