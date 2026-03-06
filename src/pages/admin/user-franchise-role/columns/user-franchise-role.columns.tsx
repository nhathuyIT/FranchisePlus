import type { ColumnDef } from "@tanstack/react-table";
import { User, Store, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserFranchiseRoleItem } from "@/api/user-franchise-role";

export const userFranchiseRoleColumns: ColumnDef<UserFranchiseRoleItem>[] = [
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="bg-[#6D4C41] rounded-full w-8 h-8 flex items-center justify-center shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-[#3E2723] text-sm">
            {row.original.userName || (
              <span className="text-gray-400 italic">—</span>
            )}
          </p>
          <p className="text-xs text-[#5D4037]/70">
            {row.original.userEmail || ""}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "franchiseName",
    header: "Franchise",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-[#5D4037]">
        {row.original.franchiseName ? (
          <>
            <Store className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span className="text-sm">{row.original.franchiseName}</span>
          </>
        ) : (
          <Badge
            variant="outline"
            className="text-xs border-[#6D4C41] text-[#6D4C41]"
          >
            Global
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "roleName",
    header: "Role",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5 text-[#8D6E63]" />
        <Badge
          className={
            row.original.roleCode === "ADMIN"
              ? "bg-[#3E2723] hover:bg-[#2E1B14] rounded-full text-xs"
              : row.original.roleCode === "MANAGER"
                ? "bg-[#6D4C41] hover:bg-[#5D4037] rounded-full text-xs"
                : "bg-[#A1887F] hover:bg-[#8D6E63] rounded-full text-xs"
          }
        >
          {row.original.roleName || row.original.roleCode || "—"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Assigned At",
    cell: ({ row }) => (
      <span className="text-sm text-[#5D4037]">
        {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    filterFn: (row, _columnId, filterValue) => {
      return String(row.original.isDeleted) === filterValue;
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.isDeleted ? "secondary" : "default"}
        className={
          row.original.isDeleted
            ? "bg-gray-500 hover:bg-gray-600 rounded-full text-xs"
            : "bg-green-600 hover:bg-green-700 rounded-full text-xs"
        }
      >
        {row.original.isDeleted ? "Inactive" : "Active"}
      </Badge>
    ),
  },
];
