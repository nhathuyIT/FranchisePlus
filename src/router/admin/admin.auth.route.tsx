import { Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import React from "react";

const AdminLoginPage = React.lazy(
  () => import("@/pages/admin/auth/login/admin-login"),
);
const AdminAuthRoute = (
  <>
    <Route path={ROUTER_URL.ADMIN_ROUTER.LOGIN} element={<AdminLoginPage />} />
  </>
);
export default AdminAuthRoute;
