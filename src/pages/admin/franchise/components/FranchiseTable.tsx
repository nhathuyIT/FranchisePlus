import { Link } from "react-router";
import { Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTER_URL } from "@/router/route.const";
import type { Franchise } from "@/types/franchise";

interface FranchiseTableProps {
  franchises: Franchise[];
}

export const FranchiseTable = ({ franchises }: FranchiseTableProps) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8DFD6]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] hover:bg-gradient-to-br hover:from-[#FAF8F5] hover:to-[#F5F1EB]">
            <TableHead className="font-semibold text-[#3E2723]">Code</TableHead>
            <TableHead className="font-semibold text-[#3E2723]">Name</TableHead>
            <TableHead className="font-semibold text-[#3E2723]">Address</TableHead>
            <TableHead className="font-semibold text-[#3E2723]">Opened Date</TableHead>
            <TableHead className="font-semibold text-[#3E2723]">Status</TableHead>
            <TableHead className="font-semibold text-[#3E2723] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {franchises.map((franchise) => (
            <TableRow
              key={franchise.id}
              className="hover:bg-[#FAF8F5] transition-colors duration-200 border-b border-[#E8DFD6] cursor-pointer"
            >
              <TableCell className="font-mono text-sm text-[#5D4037]">
                {franchise.code}
              </TableCell>
              <TableCell className="font-medium text-[#3E2723]">
                {franchise.name}
              </TableCell>
              <TableCell className="text-[#5D4037]">{franchise.address}</TableCell>
              <TableCell className="text-[#5D4037]">
                {franchise.opened_at
                  ? new Date(franchise.opened_at).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={franchise.is_active ? "default" : "secondary"}
                  className={
                    franchise.is_active
                      ? "bg-green-600 hover:bg-green-700 rounded-full"
                      : "bg-gray-500 hover:bg-gray-600 rounded-full"
                  }
                >
                  {franchise.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}/${franchise.id}`}
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
                    to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}/${franchise.id}/edit`}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {franchises.length === 0 && (
        <div className="text-center py-8 text-[#5D4037]">
          No franchises found matching your search.
        </div>
      )}
    </div>
  );
};
