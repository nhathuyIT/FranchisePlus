import { Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import React from "react";
import VerifyAccount from "@/pages/client/auth/verify-account/verify-account";
const ClientRegister = React.lazy(
  () => import("@/pages/client/auth/register/client-register"),
);

const ClientLoginPage = React.lazy(
  () => import("@/pages/client/auth/login/client-login"),
);

const ClientForgotPasswordPage = React.lazy(
  () => import("@/pages/client/auth/forgot-password/client-forgot-password"),
);
const ClientAuthRoute = (
  <>
    <Route
      path={ROUTER_URL.CLIENT_ROUTER.LOGIN}
      element={<ClientLoginPage />}
    />
    <Route
      path={ROUTER_URL.CLIENT_ROUTER.FORGOT_PASSWORD}
      element={<ClientForgotPasswordPage />}
    />
    <Route
      path={ROUTER_URL.CLIENT_ROUTER.REGISTER}
      element={<ClientRegister />}
    />
    <Route path={ROUTER_URL.VERIFY_EMAIL} element={<VerifyAccount />} />
  </>
);
export default ClientAuthRoute;
