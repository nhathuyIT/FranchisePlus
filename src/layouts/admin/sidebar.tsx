import { NavLink } from "react-router-dom";
import { ADMIN_MENU } from "@/router/admin/admin.menu";
import type { AdminMenuItem } from "@/router/admin/admin.menu"; // Import type
import { 
  UserCircle as UserIcon, 
  Coffee,
  LogOut,
  LayoutDashboard,
  UserCog,
  KeyRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react"; // Import type
import { useAuthStore } from "@/stores/auth-store";

// Fix lỗi Hình {6181...}: Thay any bằng LucideIcon
const iconMap: Record<string, LucideIcon> = {
  "dashboard": LayoutDashboard,
  "user": UserCog,
  "profile-icon": UserIcon,
  "key-icon": KeyRound,
  "lock-icon": Coffee,
  "reset-icon": Coffee
};

const Sidebar = () => {
  const { logout, user } = useAuthStore();

  return (
    <aside className="w-64 h-screen bg-white border-r border-amber-100 flex flex-col shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b border-amber-50">
        <div className="bg-amber-700 p-2 rounded-lg text-white">
          <Coffee size={24} />
        </div>
        <span className="font-bold text-xl text-amber-900 tracking-tight">FranchisePlus</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Fix lỗi Hình {FCEC...}: Thêm type AdminMenuItem cho item */}
        {ADMIN_MENU.map((item: AdminMenuItem) => {
          const Icon = iconMap[item.icon] || Coffee;
          if (["forgot-password", "reset-password"].includes(item.path)) return null;

          return (
            <NavLink
              key={item.path}
              to={`/admin/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-amber-50 text-amber-700 shadow-sm"
                    : "text-gray-500 hover:bg-amber-50 hover:text-amber-900"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t bg-amber-50/30">
        <div className="px-2 mb-4">
          <p className="text-sm font-bold text-amber-950 truncate">{user?.name || "Admin"}</p>
          <p className="text-xs text-amber-600 truncate">{user?.email}</p>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;