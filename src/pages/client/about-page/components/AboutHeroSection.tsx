import { useState } from "react";
import { ABOUT_THEME } from "@/const/about.const";
import { Coffee, Users, Heart } from "lucide-react";

export const AboutHeroSection = () => {
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const sections = [
    {
      id: "who",
      icon: Coffee,
      title: "Chúng Tôi Là Ai",
      subtitle: "Capital Corp",
      description: "Hệ thống cửa hàng cà phê hàng đầu Việt Nam",
      detail: "Với hơn 25 năm kinh nghiệm, chúng tôi là một chuỗi cửa hàng cà phê uy tín, nổi tiếng với chất lượng hàng đầu và dịch vụ xuất sắc. Mỗi chi nhánh đều là không gian ấm áp, nơi khách hàng tìm được sự yên tĩnh và kết nối."
    },
    {
      id: "serve",
      icon: Users,
      title: "Chúng Tôi Phục Vụ Cho Ai",
      subtitle: "Cộng Đồng Đa Dạng",
      description: "Từ chuyên gia đến sinh viên, từ pháp sư đến doanh nhân",
      detail: "Khách hàng của chúng tôi là những người yêu thích cà phê chất lượng, những người đánh giá cao sự tận tâm và chi tiết. Chúng tôi phục vụ những ai muốn trải nghiệm không chỉ một tách cà phê, mà là một hành trình khám phá hương vị."
    },
    {
      id: "dedicate",
      icon: Heart,
      title: "Chúng Tôi Cống Hiến Thế Nào",
      subtitle: "Cam Kết Toàn Tâm",
      description: "Từ hạt cà phê đến tách cà phê hoàn hảo",
      detail: "Chúng tôi cống hiến bằng cách lựa chọn những hạt cà phê tốt nhất từ các vùng trồng truyền thống, chế biến tỉ mỉ, và phục vụ với tình yêu. Mỗi tách cà phê là câu chuyện về sự tôn trọng đối với khách hàng và tự hào về sản phẩm."
    }
  ];

  return (
    <section className="py-24 bg-white" style={{ backgroundImage : `url('https://images.unsplash.com/photo-1650513973771-06337f083e7a?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 uppercase tracking-tighter" style={{ color: ABOUT_THEME.textTitle }}>
            Capital Corp
          </h2>
          <p className="text-xl md:text-2xl mb-2" style={{ color: ABOUT_THEME.primary }}>
            Chuỗi cửa hàng cà phê tinh thần Việt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="group cursor-pointer">
                <div className="p-8 rounded-lg border-2 border-amber-100 hover:border-amber-300 transition-all hover:shadow-xl h-full flex flex-col" style={{ backgroundColor: ABOUT_THEME.bgKem }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto text-white group-hover:scale-110 transition-transform" style={{ backgroundColor: ABOUT_THEME.primary }}>
                    <Icon size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-center mb-2 uppercase" style={{ color: ABOUT_THEME.textTitle }}>
                    {section.title}
                  </h3>
                  
                  <p className="text-sm font-bold text-center mb-4 uppercase tracking-widest" style={{ color: ABOUT_THEME.primary }}>
                    {section.subtitle}
                  </p>
                  
                  <p className="text-center text-lg font-bold mb-6" style={{ color: ABOUT_THEME.textTitle }}>
                    {section.description}
                  </p>
                  
                  <button
                    onClick={() => setShowDetail(section.id)}
                    className="mt-auto px-6 py-2 border-2 font-bold uppercase text-sm tracking-widest transition-all"
                    style={{ borderColor: ABOUT_THEME.primary, color: ABOUT_THEME.primary }}
                  >
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Detail */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-lg p-12 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDetail(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
              ✕
            </button>
            {sections.map((section) => {
              if (section.id === showDetail) {
                const Icon = section.icon;
                return (
                  <div key={section.id}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: ABOUT_THEME.primary }}>
                        <Icon size={24} />
                      </div>
                      <h3 className="text-3xl font-bold uppercase" style={{ color: ABOUT_THEME.textTitle }}>
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-lg leading-relaxed" style={{ color: ABOUT_THEME.textBody }}>
                      {section.detail}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </section>
  );
};