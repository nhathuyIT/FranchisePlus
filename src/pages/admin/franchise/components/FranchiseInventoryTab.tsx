import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockStatusBadge } from "@/components/common/StockStatusBadge";
import type { InventoryItemView } from "@/types/inventory";

interface FranchiseInventoryTabProps {
  inventoryItems: InventoryItemView[];
}

export const FranchiseInventoryTab = ({ inventoryItems }: FranchiseInventoryTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-[#4A3B2A] mb-4">
        Inventory Stock
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="bg-[#FAF9F6]">
            <TableHead className="font-semibold text-[#4A3B2A]">Product</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">SKU</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Quantity</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Alert Threshold</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Status</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.map((item) => (
            <TableRow key={item.inventory.id} className="hover:bg-[#FAF9F6]">
              <TableCell className="font-medium text-[#4A3B2A]">
                {item.product.name}
              </TableCell>
              <TableCell className="text-gray-700 font-mono text-sm">{item.product.SKU}</TableCell>
              <TableCell className="text-gray-700 font-semibold">
                {item.inventory.quantity} kg
              </TableCell>
              <TableCell className="text-gray-700">{item.inventory.alert_threshold} kg</TableCell>
              <TableCell>
                <StockStatusBadge
                  quantity={item.inventory.quantity}
                  lowStockThreshold={item.inventory.alert_threshold}
                />
              </TableCell>
              <TableCell className="text-gray-700">
                {new Date(item.inventory.updated_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {inventoryItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No inventory items found for this franchise.
        </div>
      )}
    </div>
  );
};
