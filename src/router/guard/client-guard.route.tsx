import { useAuthStore } from "@/stores/auth-store";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTER_URL } from "../route.const";

const ClientGuard = () => {
  const { authUser, isInitialized } = useAuthStore();

  if (!isInitialized) return null;

  if (!authUser) {
    return <Navigate to={ROUTER_URL.CLIENT_ROUTER.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ClientGuard;
