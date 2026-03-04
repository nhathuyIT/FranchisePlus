import { Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import React from "react";
import VerifyAccount from "@/pages/client/auth/verify-account/verify-account";

const AuthContainer = React.lazy(
  () => import("@/pages/client/auth/AuthContainer"),
);

const ClientForgotPasswordPage = React.lazy(
  () => import("@/pages/client/auth/forgot-password/client-forgot-password"),
);

const ClientChangePasswordPage = React.lazy(
  () => import("@/pages/client/auth/change-password/client-change-password"),
);

const ClientAuthRoute = (
  <>
    <Route path={ROUTER_URL.CLIENT_ROUTER.LOGIN} element={<AuthContainer />} />
    <Route
      path={ROUTER_URL.CLIENT_ROUTER.REGISTER}
      element={<AuthContainer />}
    />
    <Route
      path={ROUTER_URL.CLIENT_ROUTER.FORGOT_PASSWORD}
      element={<ClientForgotPasswordPage />}
    />
    <Route
      path={ROUTER_URL.CLIENT_ROUTER.CHANGE_PASSWORD}
      element={<ClientChangePasswordPage />}
    />
    <Route path={ROUTER_URL.VERIFY_EMAIL} element={<VerifyAccount />} />
  </>
);
export default ClientAuthRoute;
