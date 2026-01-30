import { useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FRANCHISES_MOCK } from "@/const/franchises.const";
import { ROUTER_URL } from "@/router/route.const";
import { FranchiseTable } from "./components/FranchiseTable";
import type { Franchise } from "@/types/franchise";

const FranchiseList = () => {
  const [franchises] = useState<Franchise[]>(FRANCHISES_MOCK);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFranchises = franchises.filter(
    (franchise) =>
      franchise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchise.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchise.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#4A3B2A]">Franchise Management</h1>
            <p className="text-gray-600 mt-1">Manage all your franchise locations</p>
          </div>
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES_CREATE}`}>
            <Button className="bg-[#4A3B2A] hover:bg-[#3A2B1A] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Franchise
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <Input
              placeholder="Search by name, code, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <FranchiseTable franchises={filteredFranchises} />
        </div>
      </div>
    </div>
  );
};

export default FranchiseList;
