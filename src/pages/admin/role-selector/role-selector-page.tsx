import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Coffee } from "lucide-react";
import { toast } from "sonner";
import { RoleSelector } from "./role-selector";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTER_URL } from "@/router/route.const";
import type { AvailableContext } from "@/config/permission";
import type { Role, User, UserFranchiseRole } from "@/types/user.type";
import * as authApi from "@/api/auth.api";
import LoadingLayout from "@/layouts/loading-layout";

interface LocationState {
  user: User;
  roles: Role[];
  franchiseRoles: UserFranchiseRole[] | null;
}

export const RoleSelectorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state || !state.franchiseRoles || state.franchiseRoles.length === 0) {
      navigate(ROUTER_URL.ADMIN_ROUTER.LOGIN, { replace: true });
    }
  }, [state, navigate]);

  const handleSelectRole = async (context: AvailableContext) => {
    if (!state || isLoading) return;

    setIsLoading(true);
    try {
      // Step 1: Call switchContext to set the selected role/franchise on the backend
      // Must send both roleId AND franchiseId for backend to properly set context
      await authApi.switchContext({
        franchiseId: context.franchiseId,
        role_id: context.roleId,
      });

      // Step 2: Call getProfile to get the confirmed activeContext after the switch
      const freshProfile = await authApi.getProfile();

      // Resolve from activeContext returned by getProfile
      const activeContext = freshProfile.activeContext ?? {
        role: context.roleCode,
        scope: context.isGlobal ? "GLOBAL" : "FRANCHISE",
        franchiseId: context.franchiseId,
      };

      const matchedFR = (state.franchiseRoles || []).find(
        (fr) =>
          fr.roleId === context.roleId &&
          (fr.franchiseId ?? null) === (activeContext.franchiseId ?? null),
      );

      const authUser = {
        user: freshProfile.user,
        // PRESERVE original roles & franchiseRoles so user can switch again later
        roles: state.roles,
        franchiseRoles: state.franchiseRoles || [],
        currentRoleId: matchedFR?.roleId ?? context.roleId,
        currentFranchiseId: activeContext.franchiseId ?? context.franchiseId,
      };

      login(authUser);

      toast.success("Role selected!", {
        description: `You are now ${context.roleName}`,
      });

      navigate(ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.DASHBOARD, {
        replace: true,
      });
    } catch (error) {
      console.error("Failed to select role:", error);
      toast.error("Failed to select role", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!state || !state.franchiseRoles || state.franchiseRoles.length === 0) {
    return null;
  }

  const availableContexts: AvailableContext[] = state.franchiseRoles.map(
    (fr) => {
      const role = state.roles.find((r) => r.id === fr.roleId)!;
      return {
        id: `${fr.roleId}-${fr.franchiseId || "global"}`,
        roleId: fr.roleId,
        roleName: role.name || role.code,
        roleCode: role.code,
        franchiseId: fr.franchiseId,
        franchiseName: fr.franchiseName || null,
        isGlobal: !fr.franchiseId,
      };
    },
  );

  return (
    <>
      {isLoading && <LoadingLayout forceVisible message="Switching role" />}

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 p-4">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-amber-900">
            <Coffee size={120} />
          </div>
          <div className="absolute bottom-20 right-20 text-amber-900">
            <Coffee size={150} />
          </div>
        </div>

        <div className="w-full max-w-md relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="bg-linear-to-br from-amber-600 to-amber-800 rounded-full p-6 shadow-2xl">
              <Coffee size={48} className="text-amber-50" strokeWidth={2.5} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 pt-16 border border-amber-200">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-amber-900">
                Welcome, {state.user.name}!
              </h1>
              <p className="text-amber-700 mt-2">
                You have multiple roles. Please select one to continue.
              </p>
            </div>

            <RoleSelector
              availableRoles={availableContexts}
              onSelectRole={handleSelectRole}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-amber-700 flex items-center justify-center gap-2">
              <Coffee size={16} />
              <span>FranchisePlus Coffee Management System</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelectorPage;
