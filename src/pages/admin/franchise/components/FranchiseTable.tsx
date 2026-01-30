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
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#FAF9F6]">
            <TableHead className="font-semibold text-[#4A3B2A]">Code</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Name</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Address</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Opened Date</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Status</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {franchises.map((franchise) => (
            <TableRow key={franchise.id} className="hover:bg-[#FAF9F6]">
              <TableCell className="font-mono text-sm text-gray-700">
                {franchise.code}
              </TableCell>
              <TableCell className="font-medium text-[#4A3B2A]">
                {franchise.name}
              </TableCell>
              <TableCell className="text-gray-700">{franchise.address}</TableCell>
              <TableCell className="text-gray-700">
                {franchise.opened_at
                  ? new Date(franchise.opened_at).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={franchise.is_active ? "default" : "secondary"}
                  className={
                    franchise.is_active
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-500 hover:bg-gray-600"
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
                    <Button variant="outline" size="sm" className="border-[#4A3B2A] text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}/${franchise.id}/edit`}
                  >
                    <Button variant="outline" size="sm" className="border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white">
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
        <div className="text-center py-8 text-gray-500">
          No franchises found matching your search.
        </div>
      )}
    </>
  );
};
