import { Link } from "react-router-dom";
import { Pencil, UserX, UserCheck } from "lucide-react";
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
import type { Customer } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
}

export const CustomerTable = ({ customers }: CustomerTableProps) => {
  const handleToggleActive = (customer: Customer) => {
    // In real app, this would be an API call
    console.log("Toggle active for customer:", customer);
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      // In real app, this would be an API call
      console.log("Delete customer:", customer);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8DFD6]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] hover:bg-gradient-to-br hover:from-[#FAF8F5] hover:to-[#F5F1EB]">
            <TableHead className="font-semibold text-[#3E2723]">
              Avatar
            </TableHead>
            <TableHead className="font-semibold text-[#3E2723]">Name</TableHead>
            <TableHead className="font-semibold text-[#3E2723]">
              Phone
            </TableHead>
            <TableHead className="font-semibold text-[#3E2723]">
              Email
            </TableHead>
            <TableHead className="font-semibold text-[#3E2723]">
              Created Date
            </TableHead>
            <TableHead className="font-semibold text-[#3E2723]">
              Status
            </TableHead>
            <TableHead className="font-semibold text-[#3E2723] text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              className="hover:bg-[#FAF8F5] transition-colors duration-200 border-b border-[#E8DFD6] cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center">
                  <img
                    src={
                      customer.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`
                    }
                    alt={customer.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#E8DFD6]"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-[#3E2723]">
                {customer.name}
              </TableCell>
              <TableCell className="font-mono text-sm text-[#5D4037]">
                {customer.phone}
              </TableCell>
              <TableCell className="text-[#5D4037]">
                {customer.email || "N/A"}
              </TableCell>
              <TableCell className="text-[#5D4037]">
                {new Date(customer.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={customer.is_active ? "default" : "secondary"}
                  className={
                    customer.is_active
                      ? "bg-green-600 hover:bg-green-700 rounded-full"
                      : "bg-gray-500 hover:bg-gray-600 rounded-full"
                  }
                >
                  {customer.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(customer)}
                    className={`border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      customer.is_active
                        ? "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    }`}
                  >
                    {customer.is_active ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
                  <Link
                    to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.USER_CONTROL_EDIT.replace(":id", customer.id.toString())}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(customer)}
                    className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {customers.length === 0 && (
        <div className="text-center py-8 text-[#5D4037]">
          No customers found matching your search.
        </div>
      )}
    </div>
  );
};
