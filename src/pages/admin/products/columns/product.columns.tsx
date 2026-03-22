import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StatusToggleCell } from "@/components/common/StatusToggleCell";
import type { Product } from "@/types/product.type";

type ProductRow = Product & { quantity?: number };

interface ColumnOptions {
  onStatusToggle?: (row: ProductRow, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
  isManagerView?: boolean;
}

export const createProductColumns = (options?: ColumnOptions): ColumnDef<ProductRow>[] => {
  const columns: ColumnDef<ProductRow>[] = [];

  if (!options?.isManagerView) {
    columns.push(
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
          <span className="font-mono text-sm text-[#5D4037]">
            {row.original.sku}
          </span>
        ),
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        enableSorting: false,
        cell: ({ row }) => (
          row.original.imageUrl ? (
            <img
              src={row.original.imageUrl}
              alt={row.original.name}
              className="w-12 h-12 object-cover rounded-lg border border-[#E8DFD6]"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )
        ),
      }
    );
  }

  columns.push({
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-[#3E2723]">{row.original.name}</span>
    ),
  });

  if (!options?.isManagerView) {
    columns.push({
      accessorKey: "isHaveTopping",
      header: "Has Topping",
      enableSorting: false,
      cell: ({ row }) => {
        const v = row.original.isHaveTopping;
        if (v === null || v === undefined) {
          return <span className="text-gray-400">—</span>;
        }

        return (
          <Badge
            variant={v ? "default" : "secondary"}
            className={
              v
                ? "bg-green-600 hover:bg-green-700 rounded-full"
                : "bg-gray-500 hover:bg-gray-600 rounded-full"
            }
          >
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    });
  }

  columns.push({
    id: "price_range",
    accessorFn: (row) => `${row.minPrice}-${row.maxPrice}`,
    header: options?.isManagerView ? "Price" : "Price Range",
    enableSorting: false,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {options?.isManagerView 
          ? `${row.original.minPrice.toLocaleString()}₫`
          : `${row.original.minPrice.toLocaleString()}₫ – ${row.original.maxPrice.toLocaleString()}₫`
        }
      </span>
    ),
  },
  ...(options?.isManagerView
    ? ([
        {
          accessorKey: "quantity",
          header: "Quantity",
          cell: ({ row }) => (
            <span className="text-[#5D4037] tabular-nums">
              {(row.original.quantity ?? 0).toLocaleString("en-US")}
            </span>
          ),
        },
      ] as ColumnDef<ProductRow>[]) 
    : []),
  {
    accessorKey: "isActive",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      return row.original.isActive === filterValue;
    },
    cell: ({ row }) => {
      if (options?.onStatusToggle && options.canEdit) {
        return (
          <StatusToggleCell
            isActive={row.original.isActive}
            onToggle={(val) => options.onStatusToggle!(row.original, val)}
            isPending={options.statusPendingId === String(row.original.id)}
          />
        );
      }
      return (
        <Badge
          variant={row.original.isActive ? "default" : "secondary"}
          className={
            row.original.isActive
              ? "bg-green-600 hover:bg-green-700 rounded-full"
              : "bg-gray-500 hover:bg-gray-600 rounded-full"
          }
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  });

  return columns;
};
