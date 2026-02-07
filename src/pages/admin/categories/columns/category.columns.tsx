import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/category";

export const categoryColumns: ColumnDef<Category>[] = [
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
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-[#5D4037]">
        {row.original.code}
      </span>
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.description || "N/A"}
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
