import { useAuthStore } from "@/stores/auth-store";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  const { authUser, isInitialized, isAdmin } = useAuthStore();

  if (!isInitialized) return null;

  if (!authUser || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
