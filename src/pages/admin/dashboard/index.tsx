import { ADMIN_STYLES } from "@/const/theme.const";
import StatsGrid from "./StatsGrid";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";
const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header: Chuyên nghiệp hơn với Avatar và lời chào */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Tổng quan kinh doanh</h2>
          <p className="text-gray-500 font-medium mt-1">Hệ thống Franchise Coffee Plus | 02/02/2026</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-full hover:bg-gray-50 transition-all">
             Bộ lọc
           </button>
           <button className={ADMIN_STYLES.buttonPrimary}>
             Xuất dữ liệu
           </button>
        </div>
      </div>
      
      {/* Phần KPIs */}
      <StatsGrid />

      {/* Grid: Tăng Gap để layout thoáng đãng như Highland */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <RecentOrders />
        </div>
        <div className="lg:col-span-4">
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;