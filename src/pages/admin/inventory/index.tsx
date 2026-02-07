import { useState } from "react";
import { Link } from "react-router";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getInventoryItemViews } from "@/const/inventory.const";
import { ROUTER_URL } from "@/router/route.const";
import { PageHeader } from "@/components/common/PageHeader";
import { InventoryTable } from "./components/InventoryTable";
import { CrudDialog } from "@/components/crud/CrudDialog";
import { useCrudDialog } from "@/hooks/crud/useCrudDialog";
import { updateStockConfig, addInventoryItemConfig } from "./inventory.config";
import type { InventoryItemView } from "@/types/inventory";

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItemView[]>(
    getInventoryItemViews()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Dialog state management
  const updateStockDialog = useCrudDialog<InventoryItemView>();
  const addItemDialog = useCrudDialog<InventoryItemView>();

  const filteredInventory = inventory;

  const handleEdit = (item: InventoryItemView) => {
    updateStockDialog.openUpdate(item);
  };

  const refreshData = () => {
    // TODO: Replace with actual API call
    setInventory(getInventoryItemViews());
  };

  const handleUpdateSuccess = () => {
    refreshData();
    updateStockDialog.close();
    toast.success("Stock updated successfully");
  };

  const handleAddSuccess = () => {
    refreshData();
    addItemDialog.close();
    toast.success("Inventory item added successfully");
  };

  // Bulk Export Handler
  const handleBulkExport = async (selectedItems: InventoryItemView[]) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual export logic
      // Generate CSV content
      const headers = ["Product", "SKU", "Franchise", "Quantity", "Threshold", "Last Updated"];
      const rows = selectedItems.map((item) => [
        item.product.name,
        item.product.SKU,
        item.franchiseName,
        `${item.inventory.quantity} kg`,
        `${item.inventory.alert_threshold} kg`,
        new Date(item.inventory.updated_at).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inventory-export-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${selectedItems.length} item(s)`);
    } catch (err) {
      toast.error("Failed to export inventory. Please try again.");
      setError(
        err instanceof Error ? err : new Error("Failed to export inventory")
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
          title="Inventory Management"
          description="Track all products across franchises"
          action={
            <div className="flex gap-3">
              <Button
                onClick={addItemDialog.openCreate}
                className="bg-[#6D4C41] hover:bg-[#3E2723] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              <Link
                to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.INVENTORY_LOW_STOCK}`}
              >
                <Button className="bg-[#D97706] hover:bg-[#B45309] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  Low Stock Alert
                </Button>
              </Link>
            </div>
          }
        />

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <InventoryTable
            items={filteredInventory}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onEdit={handleEdit}
            onBulkExport={handleBulkExport}
          />

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredInventory.length} of {inventory.length} items
          </div>
        </div>
      </div>

      {/* Update Stock Dialog */}
      <CrudDialog
        config={updateStockConfig}
        dialog={updateStockDialog}
        onSuccess={handleUpdateSuccess}
      />

      {/* Add Inventory Item Dialog */}
      <CrudDialog
        config={addInventoryItemConfig}
        dialog={addItemDialog}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default InventoryList;
