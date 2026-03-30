import type { JSX } from "react";
import { ROUTER_URL } from "../route.const";
import React from "react";
import type { Permission } from "@/config/permission";
import { Permission as PermissionEnum } from "@/config/permission";

export type AdminMenuItem = {
  label: string;
  path: string;
  icon: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  isEnd?: boolean;
  permissions?: Permission[];
};

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    label: "Dashboard",
    path: ROUTER_URL.ADMIN_ROUTER.DASHBOARD,
    icon: "dashboard",
    component: React.lazy(() => import("@/pages/admin/dashboard/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_DASHBOARD],
  },
  {
    label: "Customers",
    path: ROUTER_URL.ADMIN_ROUTER.CUSTOMERS,
    icon: "customers",
    component: React.lazy(() => import("@/pages/admin/customer/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_CUSTOMERS],
  },
  {
    label: "User Control",
    path: ROUTER_URL.ADMIN_ROUTER.USER_CONTROL,
    icon: "user",
    component: React.lazy(() => import("@/pages/admin/user-crud/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_USERS],
  },
  {
    label: "User Franchise Roles",
    path: ROUTER_URL.ADMIN_ROUTER.USER_FRANCHISE_ROLES,
    icon: "shield",
    component: React.lazy(
      () => import("@/pages/admin/user-franchise-role/index"),
    ),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_USER_FRANCHISE_ROLES],
  },

  {
    label: "Franchises",
    path: ROUTER_URL.ADMIN_ROUTER.FRANCHISES,
    icon: "store",
    component: React.lazy(() => import("@/pages/admin/franchise/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_FRANCHISES],
  },
  {
    label: "Franchise Detail",
    path: ROUTER_URL.ADMIN_ROUTER.FRANCHISES_DETAIL,
    icon: "store",
    component: React.lazy(
      () => import("@/pages/admin/franchise/franchise-detail"),
    ),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_FRANCHISES],
  },
  {
    label: "Franchise Product Assign",
    path: ROUTER_URL.ADMIN_ROUTER.FRANCHISES_PRODUCT_ASSIGN,
    icon: "store",
    component: React.lazy(
      () => import("@/pages/admin/franchise/FranchiseProductAssign"),
    ),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_FRANCHISES],
  },
  {
    label: "Shifts",
    path: ROUTER_URL.ADMIN_ROUTER.SHIFTS,
    icon: "calendar",
    component: React.lazy(() => import("@/pages/admin/shift/Shift.page")),
    isEnd: true,
  },
  {
    label: "Inventory",
    path: ROUTER_URL.ADMIN_ROUTER.INVENTORY,
    icon: "package",
    component: React.lazy(() => import("@/pages/admin/inventory/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_INVENTORY],
  },
  {
    label: "Low Stock Alert",
    path: ROUTER_URL.ADMIN_ROUTER.INVENTORY_LOW_STOCK,
    icon: "alert-triangle",
    component: React.lazy(
      () => import("@/pages/admin/inventory/low-stock-alert"),
    ),
    permissions: [PermissionEnum.VIEW_INVENTORY],
  },
  {
    label: "Categories",
    path: ROUTER_URL.ADMIN_ROUTER.CATEGORIES,
    icon: "category",
    component: React.lazy(() => import("@/pages/admin/categories/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_CATEGORY],
  },
  {
    label: "Products",
    path: ROUTER_URL.ADMIN_ROUTER.PRODUCTS,
    icon: "product",
    component: React.lazy(() => import("@/pages/admin/products/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_PRODUCTS],
  },
  {
    label: "Cart",
    path: ROUTER_URL.ADMIN_ROUTER.CART,
    icon: "cart",
    component: React.lazy(() => import("@/pages/admin/cart/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_CART],
  },
  {
    label: "Orders",
    path: ROUTER_URL.ADMIN_ROUTER.ORDERS,
    icon: "receipt",
    component: React.lazy(() => import("@/pages/admin/orders/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_ORDERS],
  },
  {
    label: "Payments",
    path: ROUTER_URL.ADMIN_ROUTER.PAYMENTS,
    icon: "credit-card",
    component: React.lazy(() => import("@/pages/admin/payments/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_ORDERS],
  },
  {
    label: "Promotions",
    path: ROUTER_URL.ADMIN_ROUTER.PROMOTIONS,
    icon: "promotion",
    component: React.lazy(() => import("@/pages/admin/promotions/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_PRODUCTS],
  },
  {
    label: "Vouchers",
    path: ROUTER_URL.ADMIN_ROUTER.VOUCHERS,
    icon: "voucher",
    component: React.lazy(() => import("@/pages/admin/vouchers/index")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_PRODUCTS],
  },
  {
    label: "Loyalty Rules",
    path: ROUTER_URL.ADMIN_ROUTER.LOYALTY_RULES,
    icon: "voucher",
    component: React.lazy(() => import("@/pages/admin/loyalty/index.tsx")),
    isEnd: true,
    permissions: [PermissionEnum.VIEW_PRODUCTS],
  },
];
