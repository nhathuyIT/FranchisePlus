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

const AdminMyProfilePage = React.lazy(
  () => import("@/pages/admin/profile/MyProfilePage"),
);

const RoleSelectorPage = React.lazy(
  () => import("@/pages/admin/role-selector/role-selector-page"),
);

const AdminCartCheckoutPage = React.lazy(
  () => import("@/pages/admin/cart/checkout"),
);

const AdminOrderDetailPage = React.lazy(
  () => import("@/pages/admin/orders/detail"),
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
          path={ROUTER_URL.ADMIN_ROUTER.ORDERS_DETAIL}
          element={
            <PermissionGuard requiredPermissions={[Permission.VIEW_ORDERS]}>
              <AdminOrderDetailPage />
            </PermissionGuard>
          }
        />
        <Route
          path={ROUTER_URL.ADMIN_ROUTER.CART_CHECKOUT}
          element={
            <PermissionGuard requiredPermissions={[Permission.MANAGE_CART]}>
              <AdminCartCheckoutPage />
            </PermissionGuard>
          }
        />
        <Route
          path={ROUTER_URL.ADMIN_ROUTER.MY_PROFILE}
          element={<AdminMyProfilePage />}
        />
        <Route
          path={ROUTER_URL.ADMIN_ROUTER.CHANGE_PASSWORD}
          element={<AdminChangePassword />}
        />
      </Route>
    </Route>
  </>
);
