import { useState } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { getLowStockItems } from "@/const/inventory.const";
import { InventoryStatsCards } from "./components/InventoryStatsCards";
import { LowStockTable } from "./components/LowStockTable";
import { UpdateStockModal } from "./components/UpdateStockModal";
import type { InventoryItemView } from "@/types/inventory";

const LowStockAlert = () => {
  const [inventory, setInventory] = useState<InventoryItemView[]>(getLowStockItems());
  const [selectedItem, setSelectedItem] = useState<InventoryItemView | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const criticalItems = inventory.filter(
    (item) => (item.inventory.quantity / item.inventory.alert_threshold) * 100 <= 50
  );

  const handleUpdateStock = (item: InventoryItemView) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleUpdate = (inventoryId: number, newQuantity: number) => {
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

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#3E2723] flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-[#D97706]" />
                Low Stock Alert
              </h1>
              <p className="text-[#5D4037] mt-1">
                Items that need immediate attention
              </p>
            </div>
          </div>
        </div>

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
              <LowStockTable items={inventory} onUpdateStock={handleUpdateStock} />
              <div className="mt-4 text-sm text-[#5D4037]">
                Showing {inventory.length} low stock items
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-[#E8DFD6] mx-auto mb-4" />
              <p className="text-[#5D4037] text-lg font-medium">No low stock items found</p>
              <p className="text-[#5D4037]/70 text-sm">All inventory levels are healthy</p>
            </div>
          )}
        </div>
      </div>

      <UpdateStockModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default LowStockAlert;
