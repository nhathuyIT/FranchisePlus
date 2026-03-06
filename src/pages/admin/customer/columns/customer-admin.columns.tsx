import type { ColumnDef } from "@tanstack/react-table";
import { User as UserIcon, Phone, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { CustomerProfile } from "@/types/customer";

export const customerAdminColumns: ColumnDef<CustomerProfile>[] = [
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    enableSorting: false,
    cell: ({ row }) => (
      <Avatar className="h-10 w-10 rounded-lg border-2 border-[#E8DFD6]">
        <AvatarImage
          src={row.original.avatarUrl || undefined}
          alt={row.original.name}
          className="object-cover"
        />
        <AvatarFallback className="rounded-lg bg-[#6D4C41] text-white">
          <UserIcon className="h-5 w-5" />
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
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-[#5D4037]">
        {row.original.phone ? (
          <>
            <Phone className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span className="text-sm font-mono">{row.original.phone}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400 italic">—</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-[#5D4037]">
        {row.original.email ? (
          <>
            <Mail className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span className="text-sm">{row.original.email}</span>
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
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-[#5D4037]">
        {row.original.address ? (
          <>
            <MapPin className="h-3.5 w-3.5 text-[#8D6E63] shrink-0" />
            <span className="text-sm line-clamp-1 max-w-45">
              {row.original.address}
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-400 italic">—</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => (
      <Badge
        variant={row.original.isVerified ? "default" : "secondary"}
        className={
          row.original.isVerified
            ? "bg-blue-600 hover:bg-blue-700 rounded-full text-xs"
            : "bg-gray-400 hover:bg-gray-500 rounded-full text-xs"
        }
      >
        {row.original.isVerified ? "Verified" : "Unverified"}
      </Badge>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      return String(row.original.isActive) === filterValue;
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
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-sm text-[#5D4037]">
        {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
];
