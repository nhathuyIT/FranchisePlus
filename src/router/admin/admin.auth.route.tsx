import { Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import React from "react";
import AdminVerifyAccount from "@/pages/admin/auth/verify-account/AdminVerify";
const AdminForgotPassword = React.lazy(
  () => import("@/pages/admin/auth/forgot-password/admin-forgot-password"),
);

const AdminLoginPage = React.lazy(
  () => import("@/pages/admin/auth/login/admin-login"),
);
const AdminAuthRoute = (
  <>
    <Route path={ROUTER_URL.ADMIN_ROUTER.LOGIN} element={<AdminLoginPage />} />
    <Route
      path={ROUTER_URL.ADMIN_ROUTER.Forgot_PASSWORD}
      element={<AdminForgotPassword />}
    />
    <Route
      path={ROUTER_URL.VERIFIED_ACCOUNT}
      element={<AdminVerifyAccount />}
    />
  </>
);
export default AdminAuthRoute;
