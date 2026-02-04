import { useState } from "react";
import { Link } from "react-router";
import { Package, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getInventoryItemViews } from "@/const/inventory.const";
import { FRANCHISES_MOCK } from "@/const/franchises.const";
import { ROUTER_URL } from "@/router/route.const";
import { PageHeader } from "@/components/common/PageHeader";
import { InventoryTable } from "./components/InventoryTable";
import { UpdateStockModal } from "./components/UpdateStockModal";
import type { InventoryItemView } from "@/types/inventory";

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItemView[]>(
    getInventoryItemViews()
  );
  const [selectedFranchise, setSelectedFranchise] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItemView | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const filteredInventory = inventory.filter((item) => {
    const matchesFranchise =
      selectedFranchise === "all" ||
      item.productFranchise.franchise_id === Number(selectedFranchise);

    return matchesFranchise;
  });

  const handleEdit = (item: InventoryItemView) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleUpdateStock = (inventoryId: number, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.inventory.id === inventoryId
          ? {
              ...item,
              inventory: {
                ...item.inventory,
                quantity: newQuantity,
                updated_at: new Date().toISOString(),
              },
            }
          : item
      )
    );
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
            <Link
              to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.INVENTORY_LOW_STOCK}`}
            >
              <Button className="bg-[#D97706] hover:bg-[#B45309] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                Low Stock Alert
              </Button>
            </Link>
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

      <UpdateStockModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateStock}
      />
    </div>
  );
};

export default InventoryList;
