import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface LowStockTableProps {
  items: InventoryItemView[];
  onUpdateStock?: (item: InventoryItemView) => void;
}

export const LowStockTable = ({ items, onUpdateStock }: LowStockTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#FAF9F6]">
            <TableHead className="font-semibold text-[#4A3B2A]">Product</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">SKU</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Franchise</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Current</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Threshold</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Shortage</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Status</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const shortage = item.inventory.alert_threshold - item.inventory.quantity;
            return (
              <TableRow key={item.inventory.id} className="hover:bg-[#FAF9F6]">
                <TableCell className="font-medium text-[#4A3B2A]">
                  {item.product.name}
                </TableCell>
                <TableCell className="text-gray-700 font-mono text-sm">
                  {item.product.SKU}
                </TableCell>
                <TableCell className="text-gray-700">
                  {item.franchiseName}
                </TableCell>
                <TableCell className="text-gray-900 font-semibold">
                  {item.inventory.quantity} kg
                </TableCell>
                <TableCell className="text-gray-700">
                  {item.inventory.alert_threshold} kg
                </TableCell>
                <TableCell className="text-[#EF4444] font-semibold">
                  -{shortage} kg
                </TableCell>
                <TableCell>
                  <StockStatusBadge
                    quantity={item.inventory.quantity}
                    lowStockThreshold={item.inventory.alert_threshold}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white"
                    onClick={() => onUpdateStock?.(item)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Stock
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
