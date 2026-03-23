import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Coffee,
  LogOut,
  KeyRound,
  UserRound,
  ShoppingCart,
  BadgePercent,
} from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  AlertTriangle,
  Grid3x3,
  ShoppingBag,
  ShieldCheck,
  UserCheck,
  CalendarDays,
  TicketPercent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ADMIN_MENU } from "@/router/admin/admin.menu";
import { ROUTER_URL } from "@/router/route.const";
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
  promotion: TicketPercent,
  voucher: BadgePercent,
  shield: ShieldCheck,
  customers: UserCheck,
  calendar: CalendarDays,
  cart: ShoppingCart,
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

function formatRoleName(rawRoleName: string): string {
  return rawRoleName
    .replace(/^ROLE_/i, "")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
  const roleNameRaw =
    currentRole?.name ||
    currentRole?.code ||
    (currentRole as unknown as { role?: string })?.role ||
    "User";
  const roleName = formatRoleName(roleNameRaw);
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

  const isMyProfileActive =
    location.pathname === `/admin/${ROUTER_URL.ADMIN_ROUTER.MY_PROFILE}`;

  return (
    <aside
      className={cn(
        "relative h-screen bg-[#38220f]  text-amber-200 transition-all duration-300 flex flex-col shadow-2xl",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="h-14 flex items-center  border-b border-amber-800/50 px-4">
        {collapsed ? (
          <Coffee size={30} className="text-amber-300" />
        ) : (
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <Coffee size={30} className="text-amber-500" />
            <div className="flex flex-col">
              <span className="font-bold text-md text-amber-400">
                Goat Coffee
              </span>
            </div>
          </Link>
        )}
      </div>

      {!collapsed && (
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/${ROUTER_URL.ADMIN_ROUTER.MY_PROFILE}`)
          }
          className="p-4 border-amber-800/50 text-left hover:bg-amber-900/20 transition-colors"
        >
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
        </button>
      )}

      {collapsed && (
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/${ROUTER_URL.ADMIN_ROUTER.MY_PROFILE}`)
          }
          className="p-2 border-b border-amber-800/50 flex justify-center w-full hover:bg-amber-900/20 transition-colors"
          title="My Profile"
        >
          <Avatar className="h-8 w-8 border-2 border-amber-300">
            <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name} />
            <AvatarFallback className="bg-amber-700 text-amber-100 text-xs">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
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
                    "hover:bg-[#967259]",
                    active && "bg-[#634832] shadow-lg font-semibold",
                    collapsed && "justify-center px-2",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "shrink-0",
                        active ? "text-[#dbc1ac]" : "text-amber-100",
                      )}
                    />
                  )}
                  {!collapsed && (
                    <span
                      className={cn(
                        "text-sm",
                        active ? "text-[#dbc1ac}" : "text-amber-100",
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
            onClick={() =>
              navigate(`/admin/${ROUTER_URL.ADMIN_ROUTER.MY_PROFILE}`)
            }
            className={cn(
              "w-full gap-3 text-amber-200 hover:text-amber-50 hover:bg-amber-800/50",
              isMyProfileActive && "bg-amber-800/60 text-amber-50",
              collapsed ? "justify-center px-2" : "justify-start",
            )}
            title={collapsed ? "My Profile" : undefined}
          >
            <UserRound size={20} />
            {!collapsed && <span>My Profile</span>}
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`/admin/${ROUTER_URL.ADMIN_ROUTER.CHANGE_PASSWORD}`)
            }
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
