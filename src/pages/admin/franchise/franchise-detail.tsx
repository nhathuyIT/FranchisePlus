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

  // Mock staff data for this franchise
  const [staffList] = useState([
    {
      id: "staff-001",
      name: "Tran Van A",
      email: "tran.vana@coffeehouse.vn",
      role: "STAFF",
    },
    {
      id: "staff-002",
      name: "Nguyen Thi B",
      email: "nguyen.thib@coffeehouse.vn",
      role: "STAFF",
    },
  ]);

  const franchiseInventory = id ? getInventoryByFranchiseId(id) : [];

  const handleAddStaff = () => {
    // TODO: Implement add staff modal
    console.log("Add staff clicked");
  };

  if (!franchise) {
    return (
      <div className="p-6 bg-[#FAF9F6] min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#4A3B2A]">Franchise not found</h1>
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
            <Button className="mt-4 bg-[#4A3B2A] hover:bg-[#3A2B1A]">
              Back to Franchises
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
            <Button variant="outline" className="mb-4 border-[#4A3B2A] text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#4A3B2A]">{franchise.name}</h1>
              <p className="text-gray-600 mt-1">Franchise Details & Management</p>
            </div>
            <Badge
              variant={franchise.is_active ? "default" : "secondary"}
              className={
                franchise.is_active
                  ? "bg-green-600 hover:bg-green-700 text-lg px-4 py-1"
                  : "bg-gray-500 hover:bg-gray-600 text-lg px-4 py-1"
              }
            >
              {franchise.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#4A3B2A] data-[state=active]:text-white">
              General Info
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-[#4A3B2A] data-[state=active]:text-white">
              Staff List
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-[#4A3B2A] data-[state=active]:text-white">
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
