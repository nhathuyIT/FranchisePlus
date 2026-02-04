import { DataTable } from "@/components/common/DataTable";
import { franchiseColumns } from "../columns/franchise.columns";
import type { Franchise } from "@/types/franchise";

interface FranchiseTableProps {
  franchises: Franchise[];
}

export const FranchiseTable = ({ franchises }: FranchiseTableProps) => {
  return (
    <DataTable
      columns={franchiseColumns}
      data={franchises}
      searchable
      searchPlaceholder="Search franchises by name, code, or address..."
      emptyMessage="No franchises found matching your search."
      initialPageSize={5}
    />
  );
};
