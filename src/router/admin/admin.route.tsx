import { Navigate, Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { ADMIN_MENU } from "./admin.menu";
import { AdminLayout } from "@/layouts";
import { PermissionGuard } from "../guard/admin-guard.route";
import { Permission } from "@/config/permission";
import React from "react";

const AdminChangePassword = React.lazy(
  () => import("@/pages/admin/auth/change-password/admin-change-password"),
);

const AdminProfile = React.lazy(
  () => import("@/pages/admin/auth/profile/admin-profile"),
);

const RoleSelectorPage = React.lazy(
  () => import("@/pages/admin/role-selector/role-selector-page"),
);

export const AdminRoutes = (
  <>
    <Route path={ROUTER_URL.ADMIN}>
      <Route
        path={ROUTER_URL.ADMIN_ROUTER.ROLE_SELECTOR}
        element={<RoleSelectorPage />}
      />
    </Route>

    <Route
      element={
        <PermissionGuard requiredPermissions={[Permission.ACCESS_ADMIN_PORTAL]}>
          <AdminLayout />
        </PermissionGuard>
      }
    >
      <Route path={ROUTER_URL.ADMIN}>
        <Route
          index
          element={<Navigate to={ROUTER_URL.ADMIN_ROUTER.DASHBOARD} replace />}
        />

        {ADMIN_MENU.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={
              item.permissions && item.permissions.length > 0 ? (
                <PermissionGuard requiredPermissions={item.permissions}>
                  <item.component />
                </PermissionGuard>
              ) : (
                <item.component />
              )
            }
          />
        ))}
        <Route
          path={ROUTER_URL.ADMIN_ROUTER.MY_PROFILE}
          element={<AdminProfile />}
        />
        <Route
          path={ROUTER_URL.ADMIN_ROUTER.CHANGE_PASSWORD}
          element={<AdminChangePassword />}
        />
      </Route>
    </Route>
  </>
);
