import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FRANCHISES_MOCK } from "@/const/franchises.const";
import { PageHeader } from "@/components/common/PageHeader";
import { FranchiseTable } from "./components/FranchiseTable";
import { CrudDialog } from "@/components/crud/CrudDialog";
import { useCrudDialog } from "@/hooks/crud";
import { franchiseConfig } from "./franchise.config";
import type { Franchise } from "@/types/franchise";

const FranchiseList = () => {
  const [franchises, setFranchises] = useState<Franchise[]>(FRANCHISES_MOCK);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // CRUD Dialog state
  const dialog = useCrudDialog<Franchise>();

  // Refresh data after CRUD operations
  const refreshData = () => {
    // TODO: Replace with actual API call
    setFranchises([...FRANCHISES_MOCK]);
    dialog.close();
  };

  // Bulk Delete Handler
  const handleBulkDelete = async (selectedFranchises: Franchise[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedFranchises.length} franchise(s)? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await deleteFranchises(selectedFranchises.map(f => f.id));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove deleted franchises from state
      const deletedIds = new Set(selectedFranchises.map((f) => f.id));
      setFranchises((prev) => prev.filter((f) => !deletedIds.has(f.id)));

      toast.success(
        `Successfully deleted ${selectedFranchises.length} franchise(s)`
      );
    } catch (err) {
      toast.error("Failed to delete franchises. Please try again.");
      setError(
        err instanceof Error ? err : new Error("Failed to delete franchises")
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
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Franchise Management"
          description="Manage all your franchise locations"
          action={
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Franchise
            </Button>
          }
        />

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <FranchiseTable
            franchises={franchises}
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
          config={franchiseConfig}
          dialog={dialog}
          onSuccess={refreshData}
        />
      </div>
    </div>
  );
};

export default FranchiseList;
