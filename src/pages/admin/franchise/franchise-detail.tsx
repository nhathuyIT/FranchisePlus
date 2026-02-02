import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FRANCHISES_MOCK } from "@/const/franchises.const";
import { getInventoryByFranchiseId } from "@/const/inventory.const";
import { ROUTER_URL } from "@/router/route.const";
import { FranchiseInfoCard } from "./components/FranchiseInfoCard";
import { FranchiseStaffTab } from "./components/FranchiseStaffTab";
import { FranchiseInventoryTab } from "./components/FranchiseInventoryTab";

const FranchiseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const franchise = FRANCHISES_MOCK.find((f) => f.id === id);

  const [staffList] = useState([
    { id: "staff-001", name: "Tran Van A", email: "tran.vana@coffeehouse.vn", role: "STAFF" },
    { id: "staff-002", name: "Nguyen Thi B", email: "nguyen.thib@coffeehouse.vn", role: "STAFF" },
  ]);

  const franchiseInventory = id ? getInventoryByFranchiseId(id) : [];

  const handleAddStaff = () => {
    console.log("Add staff clicked");
  };

  if (!franchise) {
    return (
      <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#3E2723]">Franchise not found</h1>
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
            <Button className="mt-4 bg-[#6D4C41] hover:bg-[#5D4037] rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              Back to Franchises
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
            <Button variant="outline" className="mb-4 border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-full transition-all duration-300 cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#3E2723]">{franchise.name}</h1>
              <p className="text-[#5D4037] mt-1">Franchise Details & Management</p>
            </div>
            <Badge
              variant={franchise.is_active ? "default" : "secondary"}
              className={
                franchise.is_active
                  ? "bg-green-600 hover:bg-green-700 text-lg px-4 py-1 rounded-full"
                  : "bg-gray-500 hover:bg-gray-600 text-lg px-4 py-1 rounded-full"
              }
            >
              {franchise.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-white border border-[#E8DFD6] rounded-xl">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200">
              General Info
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200">
              Staff List
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200">
              Inventory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <FranchiseInfoCard franchise={franchise} />
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <FranchiseStaffTab staffList={staffList} onAddStaff={handleAddStaff} />
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <FranchiseInventoryTab inventoryItems={franchiseInventory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FranchiseDetail;
