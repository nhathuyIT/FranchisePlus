import { DataTable } from "@/components/common/DataTable";
import { createLowStockColumns } from "../columns/low-stock.columns";
import type { InventoryItemView } from "@/types/inventory";

interface LowStockTableProps {
  items: InventoryItemView[];
  onUpdateStock?: (item: InventoryItemView) => void;
}

export const LowStockTable = ({ items, onUpdateStock }: LowStockTableProps) => {
  const columns = createLowStockColumns({ onUpdateStock });

  return (
    <DataTable
      columns={columns}
      data={items}
      searchable
      searchPlaceholder="Search low stock items by product, SKU, or franchise..."
      emptyMessage="No low stock items found. All inventory levels are healthy!"
      initialPageSize={5}
    />
  );
};
