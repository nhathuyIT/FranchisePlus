import { ADMIN_STYLES } from "@/const/theme.const";

const RecentOrders = () => {
  const orders = [
    { id: "ORD-001", branch: "Quận 1", status: "Hoàn thành", total: "145k", time: "5 phút trước" },
    { id: "ORD-002", branch: "Quận 3", status: "Đang pha", total: "55k", time: "10 phút trước" },
    { id: "ORD-003", branch: "Bình Thạnh", status: "Chờ xác nhận", total: "210k", time: "12 phút trước" },
    { id: "ORD-004", branch: "Quận 1", status: "Hoàn thành", total: "45k", time: "15 phút trước" },
  ];

  return (
    <div className={ADMIN_STYLES.card}>
      <div className="p-4 border-b border-amber-100 flex justify-between items-center">
        <h3 className="font-bold text-amber-950">Đơn hàng gần đây</h3>
        <button className="text-xs text-amber-700 font-semibold hover:underline cursor-pointer">Xem tất cả</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-amber-50/50 text-amber-900 text-[11px] font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Chi nhánh</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Giá trị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50">
            {orders.map((order) => (
              <tr key={order.id} className={ADMIN_STYLES.tableRow + " cursor-pointer"}>
                <td className="px-4 py-3 font-medium text-amber-900">{order.id}</td>
                <td className="px-4 py-3 text-gray-600">{order.branch}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    order.status === "Hoàn thành" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-amber-950">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;