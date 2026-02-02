import { teamMembers, ABOUT_THEME } from "@/const/about.const";

export const TeamSection = () => {
  return (
    <section className="py-24" style={{ backgroundColor: ABOUT_THEME.bgKem }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h2 className="text-4xl font-black mb-4 uppercase" style={{ color: ABOUT_THEME.textTitle }}>Đội Ngũ Vận Hành</h2>
            <p className="text-lg opacity-80" style={{ color: ABOUT_THEME.textBody }}>Phân quyền Actor chuẩn xác theo kiến trúc CFMS Microservices.</p>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => {
              const Icon = member.icon;
              return (
                <div key={i} className="bg-white p-8 border hover:shadow-2xl transition-all cursor-default group">
                  <div className="w-12 h-12 flex items-center justify-center mb-6 text-white transition-transform group-hover:scale-110" style={{ backgroundColor: ABOUT_THEME.primary }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <p className="text-xs uppercase tracking-widest mb-4 opacity-60" style={{ color: ABOUT_THEME.primary }}>{member.role}</p>
                  <p className="text-sm opacity-70 leading-relaxed">{member.summary}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};