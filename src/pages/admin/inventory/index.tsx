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
import { getInventoryItemViews } from "@/const/inventory.const";
import { FRANCHISES_MOCK } from "@/const/franchises.const";
import { ROUTER_URL } from "@/router/route.const";
import { InventoryTable } from "./components/InventoryTable";
import { UpdateStockModal } from "./components/UpdateStockModal";
import type { InventoryItemView } from "@/types/inventory";

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItemView[]>(getInventoryItemViews());
  const [selectedFranchise, setSelectedFranchise] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItemView | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInventory = inventory.filter((item) => {
    const matchesFranchise =
      selectedFranchise === "all" || item.productFranchise.franchise_id === Number(selectedFranchise);

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

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#3E2723]">Inventory Management</h1>
            <p className="text-[#5D4037] mt-1">Track all products across franchises</p>
          </div>
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.INVENTORY_LOW_STOCK}`}>
            <Button className="bg-[#D97706] hover:bg-[#B45309] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              Low Stock Alert
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-64">
              <Select value={selectedFranchise} onValueChange={setSelectedFranchise}>
                <SelectTrigger className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by franchise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Franchises</SelectItem>
                  {FRANCHISES_MOCK.map((franchise) => (
                    <SelectItem key={franchise.id} value={franchise.id.toString()}>
                      {franchise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <InventoryTable items={filteredInventory} onEdit={handleEdit} />

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
