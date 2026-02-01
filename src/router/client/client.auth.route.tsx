import { Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import React from "react";

const ClientLoginPage = React.lazy(
  () => import("@/pages/client/auth/login/client-login"),
);
const ClientAuthRoute = (
  <>
    <Route
      path={ROUTER_URL.CLIENT_ROUTER.LOGIN}
      element={<ClientLoginPage />}
    />
  </>
);
export default ClientAuthRoute;
