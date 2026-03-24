import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTER_URL } from "@/router/route.const";
import { FranchiseInfoCard } from "./components/general/FranchiseInfoCard";
import { FranchiseStaffTab } from "./components/staff/FranchiseStaffTab";
import { FranchiseInventoryTab } from "./components/inventory/FranchiseInventoryTab";
import { useFranchise } from "@/hooks/franchise";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import { FranchiseCategoryTab } from "./components/categories/FranchiseCategoryTab";

const FranchiseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { authUser, getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();
  const canViewFranchises = userPermissions.includes(
    Permission.VIEW_FRANCHISES,
  );
  const canManageFranchises = userPermissions.includes(
    Permission.MANAGE_FRANCHISES,
  );
  const canManageOwnFranchise = userPermissions.includes(
    Permission.MANAGE_OWN_FRANCHISE,
  );
  const currentFranchiseId = authUser?.currentFranchiseId
    ? String(authUser.currentFranchiseId)
    : null;

  const canReadDetail =
    canViewFranchises &&
    (canManageFranchises ||
      (canManageOwnFranchise && id === currentFranchiseId));
  const franchiseScopeKey = authUser
    ? `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`
    : "anonymous";

  const {
    data: franchise,
    isLoading,
    error,
  } = useFranchise(id ?? "", {
    enabled: canReadDetail,
    scopeKey: franchiseScopeKey,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);

  const [staffList] = useState([
    {
      id: "staff-001",
      name: "Staff Member 1",
      email: "staff1@example.com",
      role: "STAFF",
    },
    {
      id: "staff-002",
      name: "Staff Member 2",
      email: "staff2@example.com",
      role: "STAFF",
    },
  ]);

  const handleAddStaff = () => {};

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-[#3E2723]">
          Loading franchise...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-[#3E2723]">
          Failed to load franchise
        </h1>
        <p className="text-[#5D4037] mt-2">Please try again later.</p>
        <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
          <Button className="mt-4 bg-[#6D4C41] hover:bg-[#5D4037] rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
            Back to Franchises
          </Button>
        </Link>
      </div>
    );
  }

  const canAccessDetail =
    canReadDetail &&
    !!franchise &&
    (canManageFranchises ||
      (canManageOwnFranchise && String(franchise.id) === currentFranchiseId));

  if (!canAccessDetail) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-[#3E2723]">
          Franchise not found
        </h1>
        <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
          <Button className="mt-4 bg-[#6D4C41] hover:bg-[#5D4037] rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
            Back to Franchises
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-screen-2xl mx-auto w-full">
        <div className="mb-6 shrink-0">
          <Link
            to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}
          >
            <Button
              variant="outline"
              className="mb-4 border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-full transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#3E2723]">
                {franchise.name}
              </h1>
              <p className="text-[#5D4037] mt-1">
                Franchise Details & Management
              </p>
            </div>
            <Badge
              variant={franchise.isActive ? "default" : "secondary"}
              className={
                franchise.isActive
                  ? "bg-green-600 hover:bg-green-700 text-lg px-4 py-1 rounded-full"
                  : "bg-gray-500 hover:bg-gray-600 text-lg px-4 py-1 rounded-full"
              }
            >
              {franchise.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex items-center justify-between gap-3 shrink-0">
            <TabsList className="bg-white border border-[#E8DFD6] rounded-xl">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200"
              >
                General Info
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200"
              >
                Staff List
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200"
              >
                Inventory
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-[#6D4C41] data-[state=active]:text-white rounded-lg transition-colors duration-200"
              >
                Categories
              </TabsTrigger>
            </TabsList>

            {activeTab === "inventory" && (
              <Button
                onClick={() => setCreateProductOpen(true)}
                className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Item
              </Button>
            )}

            {activeTab === "categories" && (
              <Button
                onClick={() => setCreateCategoryOpen(true)}
                className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Item
              </Button>
            )}
          </div>

          <TabsContent
            value="general"
            className="mt-6 flex-1 min-h-0 overflow-auto"
          >
            <FranchiseInfoCard franchise={franchise} />
          </TabsContent>

          <TabsContent
            value="staff"
            className="mt-6 flex-1 min-h-0 overflow-auto"
          >
            <FranchiseStaffTab
              staffList={staffList}
              onAddStaff={handleAddStaff}
            />
          </TabsContent>

          <TabsContent
            value="inventory"
            className="mt-6 flex-1 min-h-0 flex flex-col"
          >
            <FranchiseInventoryTab
              franchiseId={id!}
              createOpen={createProductOpen}
              onCreateOpenChange={setCreateProductOpen}
            />
          </TabsContent>

          <TabsContent
            value="categories"
            className="mt-6 flex-1 min-h-0 overflow-auto"
          >
            <FranchiseCategoryTab
              franchiseId={id!}
              franchiseName={franchise.name}
              createOpen={createCategoryOpen}
              onCreateOpenChange={setCreateCategoryOpen}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FranchiseDetail;
