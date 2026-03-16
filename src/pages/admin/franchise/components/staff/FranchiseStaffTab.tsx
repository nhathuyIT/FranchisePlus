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

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FranchiseStaffTabProps {
  staffList: StaffMember[];
  onAddStaff: () => void;
}

export const FranchiseStaffTab = ({ staffList, onAddStaff }: FranchiseStaffTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4A3B2A]">Staff Members</h2>
        <Button className="bg-[#4A3B2A] hover:bg-[#3A2B1A]" onClick={onAddStaff}>
          Add Staff
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-[#FAF9F6]">
            <TableHead className="font-semibold text-[#4A3B2A]">Name</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Email</TableHead>
            <TableHead className="font-semibold text-[#4A3B2A]">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.map((staff) => (
            <TableRow key={staff.id} className="hover:bg-[#FAF9F6]">
              <TableCell className="font-medium text-[#4A3B2A]">
                {staff.name}
              </TableCell>
              <TableCell className="text-gray-700">{staff.email}</TableCell>
              <TableCell>
                <Badge className="bg-[#4A3B2A] hover:bg-[#3A2B1A]">
                  {staff.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
