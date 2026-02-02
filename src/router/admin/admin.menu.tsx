import type { JSX } from "react";
import React from "react";

export type AdminMenuItem = {
  label: string;
  path: string;
  icon: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
};

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    label: "Bảng điều khiển",
    path: "dashboard",
    icon: "dashboard", // Lucide: LayoutDashboard
    component: React.lazy(() => import("@/pages/admin/dashboard/index").then(m => ({ default: m.default }))),
  },
  {
    label: "Quản lý Đơn hàng",
    path: "orders",
    icon: "shopping-cart", // Lucide: ShoppingCart
    component: React.lazy(() => import("@/pages/admin/orders/index").then(m => ({ default: m.default }))),
  },
  {
    label: "Sản phẩm & Menu",
    path: "products",
    icon: "coffee", // Lucide: Coffee
    component: React.lazy(() => import("@/pages/admin/products/index").then(m => ({ default: m.default }))),
  },
  {
    label: "Quản lý Kho",
    path: "inventory",
    icon: "archive", // Lucide: Archive
    component: React.lazy(() => import("@/pages/admin/inventory/index").then(m => ({ default: m.default }))),
  },
  {
    label: "Khách hàng (Loyalty)",
    path: "customers",
    icon: "users", // Lucide: Users
    component: React.lazy(() => import("@/pages/admin/loyalty/index").then(m => ({ default: m.default }))),
  },
  {
    label: "Báo cáo & Phân tích",
    path: "reports",
    icon: "bar-chart", // Lucide: BarChart3
    component: React.lazy(() => import("@/pages/admin/reports/index").then(m => ({ default: m.default }))),
  },
  {
    label: "Hệ thống & Quyền",
    path: "iam",
    icon: "shield", // Lucide: ShieldCheck
    component: React.lazy(() => import("@/pages/admin/iam/index").then(m => ({ default: m.default }))),
  },
  {
    label: "Hồ sơ cá nhân",
    path: "profile",
    icon: "profile-icon", // Lucide: UserCircle
    component: React.lazy(() => import("@/pages/admin/profile/index").then(m => ({ default: m.default }))),
  }
];