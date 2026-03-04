import { useEffect, useCallback, useState } from "react";
import { ABOUT_THEME, awards, certifications, testimonials } from "@/const/about.const";
import { Award, CheckCircle2 } from "lucide-react";

const useScrollReveal = () => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { ref, isVisible };
};

export const TestimonialsSection = () => {
  const quoteReveal = useScrollReveal();
  const awardsReveal = useScrollReveal();
  const certsReveal = useScrollReveal();

  return (
    <section className="py-24 bg-white shrink-0">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Quote */}
          <div
            ref={quoteReveal.ref}
            className={`space-y-8 transition-all duration-1000 ease-out ${quoteReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <h2 className="text-4xl font-black uppercase" style={{ color: ABOUT_THEME.textTitle }}>
              Trusted Worldwide
            </h2>
            <div className="border-l-8 pl-8 py-4" style={{ borderColor: ABOUT_THEME.primary, backgroundColor: ABOUT_THEME.bgKem }}>
              <p className="text-2xl font-medium italic mb-6" style={{ color: ABOUT_THEME.textTitle }}>
                "{testimonials[0].quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="font-bold uppercase tracking-widest" style={{ color: ABOUT_THEME.textTitle }}>
                  {testimonials[0].name}
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonials[0].rating)].map((_, i) => (
                    <span key={i} className="text-[#F59E0B]">&#9733;</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Awards */}
          <div
            ref={awardsReveal.ref}
            className={`grid grid-cols-2 gap-6 transition-all duration-1000 ease-out ${awardsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            style={{ transitionDelay: "200ms" }}
          >
            {awards.map((a, i) => (
              <div
                key={i}
                className={`p-8 border text-center hover:bg-[#FAF8F5] transition-all duration-700 ${awardsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                <Award size={32} className="mx-auto mb-4" style={{ color: ABOUT_THEME.primary }} />
                <div className="text-2xl font-bold" style={{ color: ABOUT_THEME.textTitle }}>{a.year}</div>
                <div className="text-xs uppercase opacity-60">{a.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div
          ref={certsReveal.ref}
          className={`mt-20 flex flex-wrap justify-center gap-4 transition-all duration-1000 ease-out ${certsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {certifications.map((cert, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-6 py-3 border border-amber-200 bg-amber-50/30 transition-all duration-700 ${certsReveal.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <CheckCircle2 size={18} className="text-[#6D4C41]" />
              <span className="text-sm font-bold opacity-80" style={{ color: ABOUT_THEME.textTitle }}>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};