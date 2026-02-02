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

interface InventoryTableProps {
  items: InventoryItemView[];
  onEdit?: (item: InventoryItemView) => void;
}

export const InventoryTable = ({ items, onEdit }: InventoryTableProps) => {
  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-[#E8DFD6]">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] hover:bg-gradient-to-br hover:from-[#FAF8F5] hover:to-[#F5F1EB]">
              <TableHead className="font-semibold text-[#3E2723]">Product</TableHead>
              <TableHead className="font-semibold text-[#3E2723]">SKU</TableHead>
              <TableHead className="font-semibold text-[#3E2723]">Franchise</TableHead>
              <TableHead className="font-semibold text-[#3E2723]">Quantity</TableHead>
              <TableHead className="font-semibold text-[#3E2723]">Threshold</TableHead>
              <TableHead className="font-semibold text-[#3E2723]">Status</TableHead>
              <TableHead className="font-semibold text-[#3E2723]">Last Updated</TableHead>
              <TableHead className="font-semibold text-[#3E2723] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.inventory.id}
                className="hover:bg-[#FAF8F5] transition-colors duration-200 border-b border-[#E8DFD6] cursor-pointer"
              >
                <TableCell className="font-medium text-[#3E2723]">
                  {item.product.name}
                </TableCell>
                <TableCell className="text-[#5D4037] font-mono text-sm">
                  {item.product.SKU}
                </TableCell>
                <TableCell className="text-[#5D4037]">{item.franchiseName}</TableCell>
                <TableCell className="text-[#3E2723] font-semibold">
                  {item.inventory.quantity} kg
                </TableCell>
                <TableCell className="text-[#5D4037]">{item.inventory.alert_threshold} kg</TableCell>
                <TableCell>
                  <StockStatusBadge
                    quantity={item.inventory.quantity}
                    lowStockThreshold={item.inventory.alert_threshold}
                  />
                </TableCell>
                <TableCell className="text-[#5D4037]">
                  {new Date(item.inventory.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                    onClick={() => onEdit?.(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-[#5D4037]">
          No inventory items found matching your criteria.
        </div>
      )}
    </>
  );
};
