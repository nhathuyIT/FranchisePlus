import { ADMIN_STYLES } from "@/const/theme.const";

const TopProducts = () => {
  const products = [
    { name: "Cà phê Muối", category: "Coffee", sold: 450, growth: "+12%" },
    { name: "Bạc xỉu", category: "Coffee", sold: 320, growth: "+5%" },
    { name: "Trà Đào", category: "Tea", sold: 280, growth: "+2%" },
  ];

  return (
    <div className={ADMIN_STYLES.card}>
      <div className="p-4 border-b border-amber-100">
        <h3 className="font-bold text-amber-950">Sản phẩm bán chạy</h3>
      </div>
      <div className="p-4 space-y-4">
        {products.map((p, i) => (
          <div key={i} className="flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center font-bold text-amber-800 border border-amber-100">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-amber-950 leading-none">{p.name}</p>
                <p className="text-[10px] text-amber-600 mt-1 uppercase font-semibold">{p.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-amber-900">{p.sold}</p>
              <p className="text-[10px] text-green-600 font-bold">{p.growth}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;