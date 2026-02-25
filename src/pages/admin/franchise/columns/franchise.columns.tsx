import type { ColumnDef } from "@tanstack/react-table";
import { Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Franchise } from "@/types/franchise";

export const franchiseColumns: ColumnDef<Franchise>[] = [
  {
    accessorKey: "logoUrl",
    header: "Logo",
    enableSorting: false,
    cell: ({ row }) => (
      <Avatar className="h-12 w-12 rounded-lg border-2 border-[#E8DFD6]">
        <AvatarImage
          src={row.original.logoUrl || undefined}
          alt={row.original.name}
          className="object-cover"
        />
        <AvatarFallback className="rounded-lg bg-[#6D4C41] text-white">
          <Store className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
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
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">{row.original.address}</span>
    ),
  },
  {
    accessorKey: "openedAt",
    header: "Opened Date",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.openedAt
          ? new Date(row.original.openedAt).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      // filterValue will be boolean after conversion in DataTable
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
