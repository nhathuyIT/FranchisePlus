import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRightLeft } from "lucide-react";
import { ROUTER_URL } from "@/router/route.const";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import { RoleSwitcher } from "@/pages/admin/role-selector/role-switcher";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const {
    authUser,
    getAvailableContexts,
    getCurrentPermissions,
    getCurrentRole,
  } = useAuthStore();

  const availableContexts = getAvailableContexts();
  const permissions = getCurrentPermissions();
  const currentRole = getCurrentRole();
  const canViewDashboard =
    permissions.includes(Permission.ACCESS_ADMIN_PORTAL) &&
    permissions.includes(Permission.VIEW_DASHBOARD);
  const contextKey = `${authUser?.currentRoleId ?? "none"}-${authUser?.currentFranchiseId ?? "global"}`;
  const initialContextKeyRef = useRef(contextKey);

  useEffect(() => {
    if (!authUser) {
      navigate(ROUTER_URL.ADMIN_ROUTER.LOGIN, { replace: true });
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (!authUser) return;

    if (
      contextKey !== initialContextKeyRef.current &&
      canViewDashboard
    ) {
      navigate(ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.DASHBOARD, {
        replace: true,
      });
    }
  }, [authUser, canViewDashboard, contextKey, navigate]);

  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(92,51,23,0.12)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-stone-900">
            You do not have permission to view this page
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
            Your current role is{" "}
            <span className="font-semibold text-amber-800">
              {currentRole?.name || currentRole?.code || "Unknown Role"}
            </span>
            . Switch to another role or go back to the admin dashboard.
          </p>

          {availableContexts.length > 1 && (
            <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-left">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-900">
                <ArrowRightLeft className="h-4 w-4" />
                <span>Switch role</span>
              </div>
              <RoleSwitcher />
              <p className="mt-3 text-xs text-amber-800/80">
                When the new role has dashboard access, we will take you to
                `admin/dashboard` automatically.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={
                canViewDashboard
                  ? ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.DASHBOARD
                  : ROUTER_URL.HOME
              }
              className="rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-800"
            >
              {canViewDashboard ? "Go to Dashboard" : "Go Home"}
            </Link>

            <button
              onClick={() => window.history.back()}
              className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
