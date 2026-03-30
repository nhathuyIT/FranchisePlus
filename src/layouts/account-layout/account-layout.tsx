import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { User, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { EditProfileDialog } from "@/pages/client/profile/components/edit-profile-dialog";
import Header from "@/components/common/Header";
import { FooterInfo } from "@/components/common/FooterInfo";

const SIDEBAR_ITEMS = [
  {
    label: "My Profile",
    path: "/account/my-profile",
    icon: User,
  },
  {
    label: "My Order",
    path: "/account/my-order",
    icon: ClipboardList,
  },
];

const AccountLayout = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const user = authUser?.user;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* ═══ Sidebar ═══ */}
          <aside className="hidden md:block w-56 shrink-0">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div
                className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E8E0D8] cursor-pointer group"
                onClick={() => setEditDialogOpen(true)}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EFEBE9] flex items-center justify-center group-hover:bg-[#E8E0D8] transition-colors">
                    <span className="text-lg font-bold text-[#6D4C41]">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                {/* Edit overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                    alt="Edit"
                    className="w-4 h-4 brightness-0 invert"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#3E2723] truncate">
                  {user?.name || "User"}
                </p>
                <button
                  onClick={() => setEditDialogOpen(true)}
                  className="text-xs text-[#8D6E63] hover:text-[#C97B3D] transition-colors cursor-pointer"
                >
                  Sửa hồ sơ
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E8E0D8] mb-4" />

            {/* Nav Items */}
            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.startsWith(`${item.path}/`);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#C97B3D]/10 text-[#C97B3D] border-l-3 border-[#C97B3D]"
                        : "text-[#5D4037] hover:bg-[#EFEBE9] hover:text-[#3E2723]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* ═══ Main Content ═══ */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <FooterInfo />

      {/* Edit Profile Dialog */}
      {user && (
        <EditProfileDialog
          user={user}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  );
};

export default AccountLayout;
