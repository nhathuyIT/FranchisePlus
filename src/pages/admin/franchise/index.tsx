import { useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRANCHISES_MOCK } from "@/const/franchises.const";
import { ROUTER_URL } from "@/router/route.const";
import { FranchiseTable } from "./components/FranchiseTable";
import type { Franchise } from "@/types/franchise";

const FranchiseList = () => {
  const [franchises] = useState<Franchise[]>(FRANCHISES_MOCK);

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#3E2723]">Franchise Management</h1>
            <p className="text-[#5D4037] mt-1">Manage all your franchise locations</p>
          </div>
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES_CREATE}`}>
            <Button className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Franchise
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <FranchiseTable franchises={franchises} />
        </div>
      </div>
    </div>
  );
};

export default FranchiseList;
