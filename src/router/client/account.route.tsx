import { Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { ClientLayout } from "@/layouts";
import ClientGuard from "../guard/client-guard.route";
import React from "react";

const ProfilePage = React.lazy(() => import("@/pages/client/profile"));

export const AccountRoute = (
  <Route element={<ClientGuard />}>
    <Route element={<ClientLayout />}>
      <Route path={ROUTER_URL.ACCOUNT}>
        <Route
          path={ROUTER_URL.ACCOUNT_ROUTER.MY_PROFILE}
          element={<ProfilePage />}
        />
      </Route>
    </Route>
  </Route>
);
