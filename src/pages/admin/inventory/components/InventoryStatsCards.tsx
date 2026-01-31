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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="group bg-gradient-to-br from-white to-[#FAF8F5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E8DFD6] p-6 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5D4037]/70 mb-1">Total Low Stock</p>
            <p className="text-3xl font-bold text-[#D97706]">{totalLowStock}</p>
          </div>
          <div className="bg-[#D97706] rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Package className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      <div className="group bg-gradient-to-br from-white to-[#FAF8F5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E8DFD6] p-6 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5D4037]/70 mb-1">Critical Items</p>
            <p className="text-3xl font-bold text-[#EF4444]">{criticalItems}</p>
          </div>
          <div className="bg-[#EF4444] rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <AlertTriangle className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      <div className="group bg-gradient-to-br from-white to-[#FAF8F5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E8DFD6] p-6 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5D4037]/70 mb-1">Warning Items</p>
            <p className="text-3xl font-bold text-[#D97706]">{warningItems}</p>
          </div>
          <div className="bg-[#D97706] rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Package className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
