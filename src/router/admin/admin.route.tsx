import { Navigate, Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { ADMIN_MENU } from "./admin.menu";

export const AdminRoutes = (
  <Route>
    <Route path={ROUTER_URL.ADMIN}>
      <Route
        index
        element={<Navigate to={ROUTER_URL.ADMIN_ROUTER.DASHBOARD} replace />}
      />

      {ADMIN_MENU.map((item) => (
        <Route key={item.path} path={item.path} element={<item.component />} />
      ))}
    </Route>
  </Route>
);
