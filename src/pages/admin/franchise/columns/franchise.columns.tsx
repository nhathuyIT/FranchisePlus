import type { ColumnDef } from "@tanstack/react-table";
import { Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Franchise } from "@/types/franchise";

export const franchiseColumns: ColumnDef<Franchise>[] = [
  {
    accessorKey: "logo_url",
    header: "Logo",
    enableSorting: false,
    cell: ({ row }) => (
      <Avatar className="h-12 w-12 rounded-lg border-2 border-[#E8DFD6]">
        <AvatarImage
          src={row.original.logo_url || undefined}
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
    accessorKey: "opened_at",
    header: "Opened Date",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {row.original.opened_at
          ? new Date(row.original.opened_at).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      // filterValue will be boolean after conversion in DataTable
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
