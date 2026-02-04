import { DataTable } from "@/components/common/DataTable";
import { createInventoryColumns } from "../columns/inventory.columns";
import type { InventoryItemView } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItemView[];
  onEdit?: (item: InventoryItemView) => void;
}

export const InventoryTable = ({ items, onEdit }: InventoryTableProps) => {
  const columns = createInventoryColumns({ onEdit });

  return (
    <DataTable
      columns={columns}
      data={items}
      searchable
      searchPlaceholder="Search by product name, SKU, or franchise..."
      emptyMessage="No inventory items found matching your criteria."
      initialPageSize={5}
    />
  );
};
