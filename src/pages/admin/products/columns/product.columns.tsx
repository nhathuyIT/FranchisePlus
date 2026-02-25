import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_CATEGORY_MAP } from "@/const/product.const";
import { CATEGORIES } from "@/const/category.const";
import type { Product } from "@/types/product.type";

const getCategoryName = (productId: string | number) => {
  const categoryId = PRODUCT_CATEGORY_MAP[Number(productId)];
  return CATEGORIES.find((cat) => cat.id === categoryId)?.name || "Uncategorized";
};

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-[#5D4037]">
        {row.original.id}
      </span>
    ),
  },
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
    id: "category",
    accessorFn: (row) => getCategoryName(row.id),
    header: "Category",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {getCategoryName(row.original.id)}
      </span>
    ),
  },
  {
    id: "price_range",
    accessorFn: (row) => `${row.minPrice}-${row.maxPrice}`,
    header: "Price Range",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        ${row.original.minPrice.toFixed(2)} - ${row.original.maxPrice.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      return row.original.is_active === filterValue;
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_active ? "default" : "secondary"}
        className={
          row.original.is_active
            ? "bg-green-600 hover:bg-green-700 rounded-full"
            : "bg-gray-500 hover:bg-gray-600 rounded-full"
        }
      >
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];
