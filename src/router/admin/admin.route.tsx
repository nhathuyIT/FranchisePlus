import { Navigate, Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { ADMIN_MENU } from "./admin.menu";
import type { AdminMenuItem } from "./admin.menu"; // Import đúng type ở đây
import AdminLayout from "@/layouts/admin/adminLayout";

export const AdminRoutes = (
  <Route path={ROUTER_URL.ADMIN} element={<AdminLayout />}>
    <Route
      index
      element={<Navigate to={ROUTER_URL.ADMIN_ROUTER.DASHBOARD} replace />}
    />

    {/* Sửa lỗi Hình {CA26...}: item phải có kiểu là AdminMenuItem */}
    {ADMIN_MENU.map((item: AdminMenuItem) => (
      <Route 
        key={item.path} 
        path={item.path} 
        element={<item.component />} 
      />
    ))}
  </Route>
);