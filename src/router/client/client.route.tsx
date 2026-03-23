import { Navigate, Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { CLIENT_MENU } from "./client.menu";
import ClientLayout from "@/layouts/client-layout/client.layout";
import ClientGuard from "../guard/client-guard.route";

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
      </Route>
    </Route>
  </Route>
);
