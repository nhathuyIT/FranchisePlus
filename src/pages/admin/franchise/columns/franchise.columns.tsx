import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Eye, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ROUTER_URL } from "@/router/route.const";
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
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Link
          to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}/${row.original.id}`}
        >
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}/${row.original.id}/edit`}
        >
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];
