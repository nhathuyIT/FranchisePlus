import type { JSX } from "react";
import { ROUTER_URL } from "../route.const";
import React from "react";

export type AdminMenuItem = {
  label: string;
  path: string;
  icon: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  isEnd?: boolean;
};

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    label: "Dashboard",
    path: ROUTER_URL.ADMIN_ROUTER.DASHBOARD,
    icon: "dashboard",
    component: React.lazy(() => import("@/pages/admin/dashboard/index")),
    isEnd: true,
  },
  {
    label: "User Control",
    path: ROUTER_URL.ADMIN_ROUTER.USER_CONTROL,
    icon: "user",
    component: React.lazy(() => import("@/pages/admin/user-crud/index")),
    isEnd: true,
  },
  {
    label: "User Create",
    path: ROUTER_URL.ADMIN_ROUTER.USER_CONTROL_CREATE,
    icon: "user",
    component: React.lazy(() => import("@/pages/admin/user-crud/create")),
    isEnd: true,
  },
  {
    label: "User Edit",
    path: ROUTER_URL.ADMIN_ROUTER.USER_CONTROL_EDIT,
    icon: "user",
    component: React.lazy(() => import("@/pages/admin/user-crud/edit")),
    isEnd: true,
  },
  {
    label: "Franchises",
    path: ROUTER_URL.ADMIN_ROUTER.FRANCHISES,
    icon: "store",
    component: React.lazy(() => import("@/pages/admin/franchise/index")),
    isEnd: true,
  },
  {
    label: "Franchise Detail",
    path: ROUTER_URL.ADMIN_ROUTER.FRANCHISES_DETAIL,
    icon: "store",
    component: React.lazy(
      () => import("@/pages/admin/franchise/franchise-detail"),
    ),
    isEnd: true,
  },
  {
    label: "Create Franchise",
    path: ROUTER_URL.ADMIN_ROUTER.FRANCHISES_CREATE,
    icon: "store",
    component: React.lazy(
      () => import("@/pages/admin/franchise/franchise-form"),
    ),
    isEnd: true,
  },
  {
    label: "Edit Franchise",
    path: ROUTER_URL.ADMIN_ROUTER.FRANCHISES_EDIT,
    icon: "store",
    component: React.lazy(
      () => import("@/pages/admin/franchise/franchise-form"),
    ),
    isEnd: true,
  },
  {
    label: "Inventory",
    path: ROUTER_URL.ADMIN_ROUTER.INVENTORY,
    icon: "package",
    component: React.lazy(() => import("@/pages/admin/inventory/index")),
    isEnd: true,
  },
  {
    label: "Low Stock Alert",
    path: ROUTER_URL.ADMIN_ROUTER.INVENTORY_LOW_STOCK,
    icon: "alert-triangle",
    component: React.lazy(
      () => import("@/pages/admin/inventory/low-stock-alert"),
    ),
  },
  {
    label: "Categories",
    path: ROUTER_URL.ADMIN_ROUTER.CATEGORIES,
    icon: "category",
    component: React.lazy(() => import("@/pages/admin/categories/index")),
    isEnd: true,
  },
  {
    label: "Products",
    path: ROUTER_URL.ADMIN_ROUTER.PRODUCTS,
    icon: "product",
    component: React.lazy(() => import("@/pages/admin/products/index")),
    isEnd: true,
  },
];
