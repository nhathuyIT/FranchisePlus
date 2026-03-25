import { useQuery } from "@tanstack/react-query";
import {
  getDashboard,
  normalizeDashboardResponse,
} from "@/api/dashboard/dashboard.api";
import { useAuthStore } from "@/stores/auth-store";

const useDashboardScopeKey = () => {
  const authUser = useAuthStore((state) => state.authUser);

  if (!authUser) {
    return "anonymous";
  }

  return `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`;
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  allFranchises: (scopeKey = "default") =>
    [...dashboardKeys.all, "all-franchises", scopeKey] as const,
  byFranchise: (franchiseId: string, scopeKey = "default") =>
    [...dashboardKeys.all, "franchise", scopeKey, franchiseId] as const,
};

export const useDashboardAll = (enabled = true) => {
  const scopeKey = useDashboardScopeKey();

  return useQuery({
    queryKey: dashboardKeys.allFranchises(scopeKey),
    queryFn: () => getDashboard(""),
    select: normalizeDashboardResponse,
    enabled,
  });
};

export const useDashboardByFranchise = (
  franchiseId: string,
  enabled = true,
) => {
  const scopeKey = useDashboardScopeKey();

  return useQuery({
    queryKey: dashboardKeys.byFranchise(franchiseId, scopeKey),
    queryFn: () => getDashboard(franchiseId),
    select: normalizeDashboardResponse,
    enabled: Boolean(franchiseId) && enabled,
  });
};
