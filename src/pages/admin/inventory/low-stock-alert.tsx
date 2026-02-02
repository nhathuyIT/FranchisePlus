import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLowStockItems } from "@/const/inventory.const";
import { ROUTER_URL } from "@/router/route.const";
import { InventoryStatsCards } from "./components/InventoryStatsCards";
import { LowStockTable } from "./components/LowStockTable";
import { UpdateStockModal } from "./components/UpdateStockModal";
import type { InventoryItemView } from "@/types/inventory";

const LowStockAlert = () => {
  const [inventory, setInventory] = useState<InventoryItemView[]>(getLowStockItems());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItemView | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = inventory.filter(
    (item) =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.franchiseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalItems = filteredItems.filter(
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
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.INVENTORY}`}>
            <Button variant="outline" className="mb-4 border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-full transition-all duration-300 cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>

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
            warningItems={filteredItems.length - criticalItems.length}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <div className="mb-4">
            <Input
              placeholder="Search by product name, SKU, or franchise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md rounded-lg border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] transition-all duration-200"
            />
          </div>

          {filteredItems.length > 0 ? (
            <>
              <LowStockTable items={filteredItems} onUpdateStock={handleUpdateStock} />
              <div className="mt-4 text-sm text-[#5D4037]">
                Showing {filteredItems.length} low stock items
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
