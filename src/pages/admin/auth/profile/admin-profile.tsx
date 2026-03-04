import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  Phone,
  UserCircle,
  Shield,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  Globe,
  Store,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAdminProfile } from "@/api/admin/admin.api";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTER_URL } from "@/router/route.const";

const formatDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon size={18} className="text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-500 font-medium uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <div className="text-sm text-gray-800">{children}</div>
      </div>
    </div>
  );
}

function AdminProfile() {
  const { getCurrentRole } = useAuthStore();
  const currentRole = getCurrentRole();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
  });

  const user = data?.user;
  const roles = data?.roles ?? [];
  const activeContext = data?.activeContext;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-amber-700 text-sm">Loading profile...</div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500 text-sm">Failed to load profile.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 gap-2 px-0"
        >
          <Link to={`/admin/${ROUTER_URL.ADMIN_ROUTER.DASHBOARD}`}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
        <Avatar className="h-20 w-20 border-4 border-amber-300 shadow-md">
          <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
          <AvatarFallback className="bg-amber-600 text-amber-100 text-2xl font-bold">
            {user.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-amber-600 mt-1">
            {currentRole?.name ?? "Admin"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {user.isActive ? (
              <Badge className="bg-green-100 text-green-700 border border-green-300">
                <CheckCircle size={12} className="mr-1" /> Active
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 border border-red-300">
                <XCircle size={12} className="mr-1" /> Inactive
              </Badge>
            )}
            {user.isDeleted && (
              <Badge className="bg-gray-100 text-gray-600 border border-gray-300">
                Deleted
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Account Information
        </h2>
        <Separator className="mb-4 bg-amber-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
          <InfoRow icon={Hash} label="User ID">
            <span className="font-mono text-xs bg-amber-50 px-2 py-0.5 rounded break-all">
              {user.id}
            </span>
          </InfoRow>
          <InfoRow icon={Mail} label="Email">
            {user.email}
          </InfoRow>
          <InfoRow icon={UserCircle} label="Full Name">
            {user.name}
          </InfoRow>
          <InfoRow icon={Phone} label="Phone">
            {user.phone ?? "—"}
          </InfoRow>
          <InfoRow icon={Calendar} label="Created At">
            {formatDate(user.createdAt)}
          </InfoRow>
          <InfoRow icon={Calendar} label="Updated At">
            {formatDate(user.updatedAt)}
          </InfoRow>
        </div>
      </section>

      {/* Active Context */}
      {activeContext && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Active Context
          </h2>
          <Separator className="mb-4 bg-amber-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
            <InfoRow icon={Shield} label="Current Role">
              <Badge className="bg-amber-100 text-amber-800 border border-amber-300">
                {activeContext.role}
              </Badge>
            </InfoRow>
            <InfoRow icon={Globe} label="Scope">
              {activeContext.scope}
            </InfoRow>
            {activeContext.franchiseId && (
              <InfoRow icon={Store} label="Franchise ID">
                <span className="font-mono text-xs bg-amber-50 px-2 py-0.5 rounded break-all">
                  {activeContext.franchiseId}
                </span>
              </InfoRow>
            )}
          </div>
        </section>
      )}

      {/* Roles & Franchises */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Roles & Franchises
        </h2>
        <Separator className="mb-4 bg-amber-200" />

        {roles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-amber-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-amber-100 text-amber-800">
                  <th className="text-left px-4 py-2.5 font-semibold">#</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Role</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Scope</th>
                  <th className="text-left px-4 py-2.5 font-semibold">
                    Franchise
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t border-amber-100 hover:bg-amber-50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <Badge className="bg-amber-100 text-amber-800 border border-amber-300">
                        {r.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant="outline"
                        className={
                          r.scope === "GLOBAL"
                            ? "border-blue-300 text-blue-700"
                            : "border-green-300 text-green-700"
                        }
                      >
                        {r.scope}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">
                      {r.franchiseName ?? (r.franchiseId ? r.franchiseId : "—")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No roles assigned.</p>
        )}
      </section>

      {/* Actions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Actions</h2>
        <Separator className="mb-4 bg-amber-200" />
        <Button
          variant="outline"
          asChild
          className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-900 gap-2"
        >
          <Link to={`/admin/${ROUTER_URL.ADMIN_ROUTER.CHANGE_PASSWORD}`}>
            <KeyRound size={16} />
            Change Password
          </Link>
        </Button>
      </section>
    </div>
  );
}

export default AdminProfile;
