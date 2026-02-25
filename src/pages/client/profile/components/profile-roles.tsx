import { ShieldCheck, Building2 } from "lucide-react";
import type { Role, UserFranchiseRole } from "@/types/user.type";

interface ProfileRolesProps {
  roles: Role[];
  franchiseRoles: UserFranchiseRole[];
}

export const ProfileRoles = ({ roles, franchiseRoles }: ProfileRolesProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8E0D8] bg-[#EFEBE9]/30">
        <h2 className="text-lg font-bold text-[#3E2723]">
          Roles & Permissions
        </h2>
        <p className="text-sm text-[#8D6E63]">
          Your assigned roles and franchise access
        </p>
      </div>

      <div className="p-6">
        {/* Global Roles */}
        {roles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <span
                  key={role.id}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[#EFEBE9] text-[#5D4037] border border-[#D7CCC8]"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      role.scope === "GLOBAL" ? "bg-amber-500" : "bg-blue-500"
                    }`}
                  />
                  {role.name}
                  <span className="text-xs text-[#A1887F] ml-1">
                    ({role.scope})
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Franchise Roles */}
        {franchiseRoles.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[#5D4037] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Franchise Assignments
            </h3>
            <div className="space-y-2">
              {franchiseRoles.map((fr) => {
                const role = roles.find((r) => r.id === fr.role_id);
                return (
                  <div
                    key={fr.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E8E0D8]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EFEBE9] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#6D4C41]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#3E2723]">
                          Franchise #{fr.franchise_id || "Global"}
                        </p>
                        <p className="text-xs text-[#A1887F]">
                          {role?.name || "Unknown Role"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-[#EFEBE9] text-[#6D4C41] font-medium">
                      {role?.scope || "N/A"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {roles.length === 0 && franchiseRoles.length === 0 && (
          <p className="text-sm text-[#A1887F] text-center py-4">
            No roles assigned yet.
          </p>
        )}
      </div>
    </div>
  );
};
