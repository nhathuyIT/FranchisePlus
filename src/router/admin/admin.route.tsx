import { Navigate, Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { ADMIN_MENU } from "./admin.menu";
import React from "react";

const CategoryCreate = React.lazy(
  () => import("@/pages/admin/categories/create")
);
const CategoryEdit = React.lazy(
  () => import("@/pages/admin/categories/edit")
);
const ProductCreate = React.lazy(
  () => import("@/pages/admin/products/create")
);
const ProductEdit = React.lazy(() => import("@/pages/admin/products/edit"));
const ProductDetail = React.lazy(
  () => import("@/pages/admin/products/detail")
);

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

      {/* Category Routes */}
      <Route
        path={ROUTER_URL.ADMIN_ROUTER.CATEGORIES_CREATE}
        element={<CategoryCreate />}
      />
      <Route
        path={ROUTER_URL.ADMIN_ROUTER.CATEGORIES_EDIT}
        element={<CategoryEdit />}
      />

      {/* Product Routes */}
      <Route
        path={ROUTER_URL.ADMIN_ROUTER.PRODUCTS_CREATE}
        element={<ProductCreate />}
      />
      <Route
        path={ROUTER_URL.ADMIN_ROUTER.PRODUCTS_EDIT}
        element={<ProductEdit />}
      />
      <Route
        path={ROUTER_URL.ADMIN_ROUTER.PRODUCTS_DETAIL}
        element={<ProductDetail />}
      />
    </Route>
  </Route>
);
