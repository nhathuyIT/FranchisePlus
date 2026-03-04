import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product.type";

export const productColumns: ColumnDef<Product>[] = [
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
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-[#3E2723]">{row.original.name}</span>
    ),
  },
  {
    id: "price_range",
    accessorFn: (row) => `${row.minPrice}-${row.maxPrice}`,
    header: "Price Range",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.minPrice.toLocaleString()}₫ – {row.original.maxPrice.toLocaleString()}₫
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      return row.original.isActive === filterValue;
    },
    cell: ({ row }) => (
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
    ),
  },
];
