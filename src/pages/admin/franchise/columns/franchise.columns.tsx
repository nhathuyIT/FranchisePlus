import type { ColumnDef } from "@tanstack/react-table";
import { Store, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Franchise } from "@/types/franchise";

const TIME_DISPLAY_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d(?:[:][0-5]\d)?$/;

const formatFranchiseHours = (openedAt: string | null, closedAt: string | null) => {
  if (!openedAt) {
    return "N/A";
  }

  if (TIME_DISPLAY_REGEX.test(openedAt)) {
    const opened = openedAt.slice(0, 5);
    const closed = closedAt && TIME_DISPLAY_REGEX.test(closedAt) ? closedAt.slice(0, 5) : "N/A";
    return `${opened} - ${closed}`;
  }

  return new Date(openedAt).toLocaleDateString();
};

export const franchiseColumns: ColumnDef<Franchise>[] = [
  {
    accessorKey: "logoUrl",
    header: "Logo",
    enableSorting: false,
    cell: ({ row }) => (
      <Avatar className="h-10 w-10 rounded-lg border-2 border-[#E8DFD6]">
        <AvatarImage
          src={row.original.logoUrl || undefined}
          alt={row.original.name}
          className="object-cover"
        />
        <AvatarFallback className="rounded-lg bg-[#6D4C41] text-white">
          <Store className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-[#5D4037] whitespace-nowrap">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-[#3E2723] line-clamp-1">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "hotline",
    header: "Hotline",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-[#5D4037]">
        {row.original.hotline ? (
          <>
            <Phone className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span className="text-sm whitespace-nowrap">{row.original.hotline}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400 italic">—</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) =>
      row.original.address ? (
        <span className="text-sm text-[#5D4037] line-clamp-1 max-w-[200px]">
          {row.original.address}
        </span>
      ) : (
        <span className="text-sm text-gray-400 italic">—</span>
      ),
  },
  {
    accessorKey: "openedAt",
    header: "Hours",
    cell: ({ row }) => {
      const hours = formatFranchiseHours(row.original.openedAt, row.original.closedAt);
      return <span className="text-sm text-[#5D4037] whitespace-nowrap">{hours}</span>;
    },
  },
  {
    accessorKey: "closedAt",
    header: "Closed At",
    cell: ({ row }) => (
      <span className="text-sm text-[#5D4037]">
        {row.original.closedAt || <span className="text-gray-400 italic">—</span>}
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
            ? "bg-green-600 hover:bg-green-700 rounded-full text-xs"
            : "bg-gray-500 hover:bg-gray-600 rounded-full text-xs"
        }
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];
