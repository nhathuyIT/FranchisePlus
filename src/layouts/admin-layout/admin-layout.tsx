import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import LoadingLayout from "../loading-layout";
import { useAuthStore } from "@/stores/auth-store";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isSwitchingRole = useAuthStore((state) => state.isSwitchingRole);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF8F5]">
      {isSwitchingRole && (
        <LoadingLayout forceVisible message="Switching role" />
      )}
      <AdminSidebar collapsed={sidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14  bg-[#f0e8e1] border-b border-stone-200 flex items-center px-4 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-stone-600 hover:text-stone-900"
          >
            <Menu size={20} />
          </Button>
          <div className="flex-1"></div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col bg-[#f0e8e1]">
          <div className="flex h-full w-full flex-1 flex-col overflow-hidden p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
