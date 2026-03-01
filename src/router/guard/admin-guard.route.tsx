import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import type { Permission } from "@/config/permission";
import { userCanAccess } from "@/config/permission-mapping";

interface PermissionGuardProps {
  requiredPermissions: Permission[];
  redirectTo?: string;
  children: React.ReactNode;
}

export const PermissionGuard = ({
  requiredPermissions,
  redirectTo = "/unauthorized",
  children,
}: PermissionGuardProps) => {
  const { authUser, getCurrentPermissions } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const userPermissions = getCurrentPermissions();
  const canAccess = userCanAccess(requiredPermissions, userPermissions);

  if (!canAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
