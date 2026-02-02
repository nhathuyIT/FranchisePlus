import { ABOUT_THEME, awards, certifications, testimonials } from "@/const/about.const";
import { Award, CheckCircle2 } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase" style={{ color: ABOUT_THEME.textTitle }}>Sự Tin Cậy Toàn Cầu</h2>
            <div className="bg-[#FAF8F5] p-10 border-l-8" style={{ borderColor: ABOUT_THEME.primary }}>
              <p className="text-2xl font-medium italic mb-6">"{testimonials[0].quote}"</p>
            <div className="flex items-center gap-4">
                <div className="font-bold uppercase tracking-widest">{testimonials[0].name}</div>
                <div className="flex gap-1">
                  {[...Array(testimonials[0].rating)].map((_, i) => <span key={i} className="text-[#F59E0B]">★</span>)}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {awards.map((a, i) => (
              <div key={i} className="p-8 border text-center hover:bg-[#FAF8F5] transition-colors">
                <Award size={32} className="mx-auto mb-4" style={{ color: ABOUT_THEME.primary }} />
                <div className="text-2xl font-bold">{a.year}</div>
                <div className="text-xs uppercase opacity-60">{a.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-4">
          {certifications.map((cert, i) => (
            <div key={i} className="flex items-center gap-2 px-6 py-3 rounded-full border border-amber-200 bg-amber-50/30">
              <CheckCircle2 size={18} className="text-[#6D4C41]" />
              <span className="text-sm font-bold opacity-80" style={{ color: ABOUT_THEME.textTitle }}>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};