import { ADMIN_STYLES } from "@/const/theme.const";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Coffee } from "lucide-react";

const StatsGrid = () => {
  const stats = [
    { label: "Doanh thu hôm nay", value: "2,450,000đ", trend: "+15%", isUp: true, icon: DollarSign },
    { label: "Tổng đơn hàng", value: "86", trend: "+8%", isUp: true, icon: ShoppingBag },
    { label: "Khách hàng mới", value: "12", trend: "-2%", isUp: false, icon: Users },
    { label: "Sản phẩm đã bán", value: "154", trend: "+10%", isUp: true, icon: Coffee },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div key={index} className={ADMIN_STYLES.card + " p-5"}>
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <item.icon size={20} />
            </div>
            <span className={`flex items-center gap-1 text-xs font-bold ${item.isUp ? "text-green-600" : "text-red-600"}`}>
              {item.trend}
              {item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600/80">{item.label}</p>
            <p className="text-2xl font-bold text-amber-950 mt-1">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;