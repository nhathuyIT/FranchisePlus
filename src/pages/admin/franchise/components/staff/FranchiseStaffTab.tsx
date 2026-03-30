import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/common/DataTable";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  roleName: string;
  roleCode: string;
}

interface FranchiseStaffTabProps {
  staffList: StaffMember[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

// const getNameFallback = (name: string) => {
//   const nameParts = name.trim().split(/\s+/);
//   const first = nameParts[0]?.[0] ?? "";
//   const last = nameParts.length > 1 ? nameParts[nameParts.length - 1]?.[0] : "";
//   return `${first}${last}`.toUpperCase() || "U";
// };

export const FranchiseStaffTab = ({
  staffList,
  isLoading = false,
  error = null,
  onRetry,
}: FranchiseStaffTabProps) => {
  const columns = useMemo<ColumnDef<StaffMember>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const staff = row.original;

          return (
            <div className="flex items-center gap-3">
              {/* <Avatar className="h-9 w-9 border border-[#E8DFD6]">
                <AvatarImage src={staff.image || undefined} alt={staff.name} />
                <AvatarFallback className="bg-[#F4ECE2] text-[#4A3B2A]">
                  {getNameFallback(staff.name)}
                </AvatarFallback>
              </Avatar> */}
              <span className="font-medium text-[#4A3B2A]">{staff.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-gray-700">{row.original.email || "-"}</span>
        ),
      },
      {
        accessorKey: "roleName",
        header: "Role",
        cell: ({ row }) => (
          <Badge className="bg-[#4A3B2A] hover:bg-[#3A2B1A]">
            {row.original.roleName || "Unknown"}
          </Badge>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-gray-700">{row.original.phone || "-"}</span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4A3B2A]">Staff Members</h2>
      </div>

      <DataTable
        columns={columns}
        data={staffList}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        searchable
        searchPlaceholder="Search staff by name, email, or role..."
        emptyMessage="No users found for this franchise."
        initialPageSize={5}
        enableColumnVisibility
        defaultHiddenColumns={[]}
      />
    </div>
  );
};
