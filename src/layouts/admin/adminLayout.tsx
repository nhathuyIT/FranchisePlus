import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-amber-50">
      {/* Sidebar nằm cố định bên trái */}
      <Sidebar />

      {/* Vùng nội dung chính - Data-Dense Layout */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (optional header) */}
        <div className="border-b border-amber-200 bg-white px-8 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-amber-950">Bảng Điều Khiển</h1>
          <p className="text-sm text-amber-700 mt-1">Quản lý hoạt động hệ thống</p>
        </div>

        {/* Content area - optimized for data density */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;