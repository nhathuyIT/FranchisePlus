import { Package, AlertTriangle } from "lucide-react";

interface InventoryStatsCardsProps {
  totalLowStock: number;
  criticalItems: number;
  warningItems: number;
}

export const InventoryStatsCards = ({
  totalLowStock,
  criticalItems,
  warningItems,
}: InventoryStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Low Stock</p>
            <p className="text-3xl font-bold text-[#D97706]">{totalLowStock}</p>
          </div>
          <Package className="h-12 w-12 text-[#D97706] opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Critical Items</p>
            <p className="text-3xl font-bold text-[#EF4444]">{criticalItems}</p>
          </div>
          <AlertTriangle className="h-12 w-12 text-[#EF4444] opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Warning Items</p>
            <p className="text-3xl font-bold text-[#D97706]">{warningItems}</p>
          </div>
          <Package className="h-12 w-12 text-[#D97706] opacity-20" />
        </div>
      </div>
    </div>
  );
};
