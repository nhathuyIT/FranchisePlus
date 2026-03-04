import { useEffect, useCallback, useState } from "react";
import { ABOUT_THEME } from "@/const/about.const";
import { Coffee, Users, Heart } from "lucide-react";

const RevealWrapper = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackRef = useCallback((el: HTMLDivElement | null) => { setNode(el); }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return (
    <div
      ref={callbackRef}
      className={`transition-all ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}
      style={{ transitionDuration: "1000ms", transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const highlights = [
  { icon: Coffee, label: "Who We Are", text: "Vietnam's leading coffee franchise with 25+ years of excellence" },
  { icon: Users, label: "Who We Serve", text: "Professionals, students, entrepreneurs — anyone who loves great coffee" },
  { icon: Heart, label: "How We Dedicate", text: "From heritage beans to the perfect cup, crafted with love" },
];

export const AboutHeroSection = () => {
  return (
    <section
      className="relative py-16 md:py-20 bg-cover bg-center bg-fixed shrink-0"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1650513973771-06337f083e7a?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
    >
      <div className="absolute inset-0 bg-white/85" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Compact Title + Highlights in one view */}
        <RevealWrapper className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-2 uppercase tracking-tighter" style={{ color: ABOUT_THEME.textTitle }}>
            Capital Corp
          </h2>
          <p className="text-lg md:text-xl font-medium" style={{ color: ABOUT_THEME.primary }}>
            The Spirit of Vietnamese Coffee
          </p>
        </RevealWrapper>

        {/* Compact 3-column highlights — no cards, just inline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <RevealWrapper key={item.label} delay={i * 120} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                  style={{ backgroundColor: ABOUT_THEME.primary }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide mb-1" style={{ color: ABOUT_THEME.textTitle }}>
                    {item.label}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-75" style={{ color: ABOUT_THEME.textBody }}>
                    {item.text}
                  </p>
                </div>
              </RevealWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};