import type { ColumnDef } from "@tanstack/react-table";
import { User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StatusToggleCell } from "@/components/common/StatusToggleCell";
import type { User } from "@/types/user.type";

interface ColumnOptions {
  onStatusToggle?: (row: User, isActive: boolean) => void;
  statusPendingId?: string | null;
  canEdit?: boolean;
}

export const createCustomerColumns = (options?: ColumnOptions): ColumnDef<User>[] => [
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    enableSorting: false,
    cell: ({ row }) => (
      <Avatar className="h-12 w-12 rounded-lg border-2 border-[#E8DFD6]">
        <AvatarImage
          src={row.original.avatarUrl || undefined}
          alt={row.original.name}
          className="object-cover"
        />
        <AvatarFallback className="rounded-lg bg-[#6D4C41] text-white">
          <UserIcon className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
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
    accessorKey: "",
    header: "Role",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-[#5D4037]">
        {row.original.phone}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">{row.original.email || "N/A"}</span>
    ),
  },
  {
    accessorKey: "",
    header: "Franchise",
  },

  {
    accessorKey: "isActive",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      // filterValue will be boolean after conversion in DataTable
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
