import { useState } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import { getLowStockItems } from "@/const/inventory.const";
import { PageHeader } from "@/components/common/PageHeader";
import { InventoryStatsCards } from "./components/InventoryStatsCards";
import { LowStockTable } from "./components/LowStockTable";
import { CrudDialog } from "@/components/crud/CrudDialog";
import { useCrudDialog } from "@/hooks/crud/useCrudDialog";
import { updateStockConfig } from "./inventory.config";
import type { InventoryItemView } from "@/types/inventory";

const LowStockAlert = () => {
  const [inventory, setInventory] = useState<InventoryItemView[]>(
    getLowStockItems()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Dialog state management
  const updateStockDialog = useCrudDialog<InventoryItemView>();

  const criticalItems = inventory.filter(
    (item) =>
      (item.inventory.quantity / item.inventory.alert_threshold) * 100 <= 50
  );

  const handleUpdateStock = (item: InventoryItemView) => {
    updateStockDialog.openUpdate(item);
  };

  const refreshData = () => {
    // TODO: Replace with actual API call
    setInventory(getLowStockItems());
  };

  const handleUpdateSuccess = () => {
    refreshData();
    updateStockDialog.close();
    toast.success("Stock updated successfully");
  };

  // Bulk Export Handler
  const handleBulkExport = async (selectedItems: InventoryItemView[]) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual export logic
      // Generate CSV content
      const headers = [
        "Product",
        "SKU",
        "Franchise",
        "Current",
        "Threshold",
        "Shortage",
        "Status",
      ];
      const rows = selectedItems.map((item) => {
        const shortage = item.inventory.alert_threshold - item.inventory.quantity;
        const status =
          (item.inventory.quantity / item.inventory.alert_threshold) * 100 <= 50
            ? "Critical"
            : "Warning";
        return [
          item.product.name,
          item.product.SKU,
          item.franchiseName,
          `${item.inventory.quantity} kg`,
          `${item.inventory.alert_threshold} kg`,
          `-${shortage} kg`,
          status,
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `low-stock-alert-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${selectedItems.length} item(s)`);
    } catch (err) {
      toast.error("Failed to export low stock items. Please try again.");
      setError(
        err instanceof Error ? err : new Error("Failed to export items")
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
          title="Low Stock Alert"
          description="Items that need immediate attention"
          icon={AlertTriangle}
          iconSize="h-8 w-8"
        />

        <div className="mb-6">
          <InventoryStatsCards
            totalLowStock={inventory.length}
            criticalItems={criticalItems.length}
            warningItems={inventory.length - criticalItems.length}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          {inventory.length > 0 ? (
            <>
              <LowStockTable
                items={inventory}
                isLoading={isLoading}
                error={error}
                onRetry={handleRetry}
                onUpdateStock={handleUpdateStock}
                onBulkExport={handleBulkExport}
              />
              <div className="mt-4 text-sm text-[#5D4037]">
                Showing {inventory.length} low stock items
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-[#E8DFD6] mx-auto mb-4" />
              <p className="text-[#5D4037] text-lg font-medium">
                No low stock items found
              </p>
              <p className="text-[#5D4037]/70 text-sm">
                All inventory levels are healthy
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Update Stock Dialog */}
      <CrudDialog
        config={updateStockConfig}
        dialog={updateStockDialog}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default LowStockAlert;
