import { Link, useLocation, useNavigate } from "react-router-dom";
import { Coffee, LogOut, KeyRound, UserCircle } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  AlertTriangle,
  Grid3x3,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ADMIN_MENU } from "@/router/admin/admin.menu";
import { useLogout } from "@/hooks/auth/useAuth.hooks";
import { useAuthStore } from "@/stores/auth-store";
import { RoleSwitcher } from "@/pages/admin/role-selector/role-switcher";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  user: Users,
  store: Store,
  package: Package,
  "alert-triangle": AlertTriangle,
  category: Grid3x3,
  product: ShoppingBag,
};

const sidebarMenuItems = ADMIN_MENU.filter((item) => {
  const path = item.path.toLowerCase();
  return (
    !path.includes("detail") &&
    !path.includes("create") &&
    !path.includes("edit") &&
    !path.includes(":id")
  );
});

interface AdminSidebarProps {
  collapsed?: boolean;
}

const AdminSideBar = ({ collapsed = false }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const {
    authUser,
    getAvailableContexts,
    getCurrentPermissions,
    getCurrentRole,
  } = useAuthStore();
  const user = authUser?.user;
  const currentRole = getCurrentRole();
  const roleName = currentRole?.name || "User";
  const availableContexts = getAvailableContexts();
  const userPermissions = getCurrentPermissions();

  // Filter menu items based on user permissions
  const visibleMenuItems = sidebarMenuItems.filter((item) => {
    // If no permissions defined, show to everyone
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }
    // Check if user has at least one of the required permissions
    return item.permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  });

  const isActive = (path: string) => {
    const fullPath = `/admin/${path}`;
    return (
      location.pathname === fullPath ||
      location.pathname.startsWith(fullPath + "/")
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-amber-700  text-amber-50 transition-all duration-300 flex flex-col shadow-2xl",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="h-14 flex items-center justify-center border-b border-amber-800/50 px-4">
        {collapsed ? (
          <Coffee size={24} className="text-amber-300" />
        ) : (
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <Coffee size={24} className="text-amber-300" />
            <div className="flex flex-col">
              <span className="font-bold text-sm">FranchisePlus</span>
              <span className="text-xs text-amber-300">Admin</span>
            </div>
          </Link>
        )}
      </div>

      {!collapsed && (
        <div className="p-4 border-b border-amber-800/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-amber-300">
              <AvatarImage
                src={user?.avatarUrl || undefined}
                alt={user?.name}
              />
              <AvatarFallback className="bg-amber-700 text-amber-100">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-amber-300 truncate">{roleName}</p>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="p-2 border-b border-amber-800/50 flex justify-center">
          <Avatar className="h-8 w-8 border-2 border-amber-300">
            <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name} />
            <AvatarFallback className="bg-amber-700 text-amber-100 text-xs">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={`/admin/${item.path}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-amber-800/50",
                    active && "bg-amber-700 shadow-lg font-semibold",
                    collapsed && "justify-center px-2",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "shrink-0",
                        active ? "text-amber-100" : "text-amber-300",
                      )}
                    />
                  )}
                  {!collapsed && (
                    <span
                      className={cn(
                        "text-sm",
                        active ? "text-amber-50" : "text-amber-200",
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-amber-800/50">
        {/* Role Switcher - Only show if multiple roles available */}
        {!collapsed && availableContexts.length > 1 && (
          <div className="p-3 border-b border-amber-800/50">
            <RoleSwitcher />
          </div>
        )}

        <div className="p-4 flex flex-col gap-1">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/my-profile")}
            className={cn(
              "w-full gap-3 text-amber-200 hover:text-amber-50 hover:bg-amber-800/50",
              location.pathname === "/admin/my-profile" && "bg-amber-800/50 text-amber-50 font-semibold",
              collapsed ? "justify-center px-2" : "justify-start",
            )}
            title={collapsed ? "My Profile" : undefined}
          >
            <UserCircle size={20} />
            {!collapsed && <span>My Profile</span>}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/change-password")}
            className={cn(
              "w-full gap-3 text-amber-200 hover:text-amber-50 hover:bg-amber-800/50",
              collapsed ? "justify-center px-2" : "justify-start",
            )}
            title={collapsed ? "Change Password" : undefined}
          >
            <KeyRound size={20} />
            {!collapsed && <span>Change Password</span>}
          </Button>
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            className={cn(
              "w-full gap-3 text-amber-200 hover:text-amber-50 hover:bg-amber-800/50",
              collapsed ? "justify-center px-2" : "justify-start",
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSideBar;
