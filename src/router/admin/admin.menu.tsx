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
];
