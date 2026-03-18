import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StatusToggleCell } from "@/components/common/StatusToggleCell";
import type { Category } from "@/types/category";

interface ColumnOptions {
  onStatusToggle?: (row: Category, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
}

export const createCartColumns = (
  options?: ColumnOptions,
): ColumnDef<Category>[] => [
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
    cell: ({ row }) => {
      const description = row.original.description || "N/A";
      const words = description.split(" ");
      const truncated =
        words.length > 13 ? words.slice(0, 13).join(" ") + "..." : description;
      return <span className="text-[#5D4037]">{truncated}</span>;
    },
  },
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
  },
];
