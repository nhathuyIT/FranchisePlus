import { Navigate, Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import ClientGuard from "../guard/client-guard.route";
import React from "react";
import MyOrderDetails from "@/pages/client/my-order-details";

const AccountLayout = React.lazy(
  () => import("@/layouts/account-layout/account-layout"),
);
const ProfilePage = React.lazy(() => import("@/pages/client/profile"));
const MyOrderPage = React.lazy(() => import("@/pages/client/my-order"));

export const AccountRoute = (
  <Route element={<ClientGuard />}>
    <Route element={<AccountLayout />}>
      <Route path={ROUTER_URL.ACCOUNT}>
        <Route
          index
          element={
            <Navigate to={ROUTER_URL.ACCOUNT_ROUTER.MY_PROFILE} replace />
          }
        />
        <Route
          path={ROUTER_URL.ACCOUNT_ROUTER.MY_PROFILE}
          element={<ProfilePage />}
        />
        <Route
          path={ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}
          element={<MyOrderPage />}
        />
        <Route
          path={ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER_DETAIL}
          element={<MyOrderDetails />}
        />
      </Route>
    </Route>
  </Route>
);
