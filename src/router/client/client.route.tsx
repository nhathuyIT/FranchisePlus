import { Navigate, Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { CLIENT_MENU } from "./client.menu";
import ClientLayout from "@/layouts/client-layout/client.layout";
import ClientGuard from "../guard/client-guard.route";
import React from "react";

const PaymentPage = React.lazy(() => import("@/pages/client/payment/PaymentPage"));
const QRTransactionPage = React.lazy(() =>
  import("@/pages/client/payment").then((module) => ({
    default: module.QRTransactionPage,
  })),
);

export const ClientRoute = (
  <Route element={<ClientGuard />}>
    <Route element={<ClientLayout />}>
      <Route path={ROUTER_URL.CLIENT}>
        <Route
          index
          element={<Navigate to={ROUTER_URL.CLIENT_ROUTER.CART} replace />}
        />

        {CLIENT_MENU.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={<item.component />}
          />
        ))}

        <Route
          path={ROUTER_URL.CLIENT_ROUTER.PAYMENT}
          element={<PaymentPage />}
        />
        <Route
          path={ROUTER_URL.CLIENT_ROUTER.PAYMENT_QR}
          element={<QRTransactionPage />}
        />
      </Route>
    </Route>
  </Route>
);
