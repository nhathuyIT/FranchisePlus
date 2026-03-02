import { useEffect, useCallback, useState } from "react";
import { teamMembers, ABOUT_THEME } from "@/const/about.const";

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

export const TeamSection = () => {
  return (
    <section className="py-24 shrink-0" style={{ backgroundColor: ABOUT_THEME.bgKem }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start gap-16">
          {/* Left heading */}
          <RevealWrapper className="w-full md:w-1/3 text-center md:text-left">
            <h2 className="text-4xl font-black mb-4 uppercase" style={{ color: ABOUT_THEME.textTitle }}>
              Operations Team
            </h2>
            <p className="text-lg opacity-80" style={{ color: ABOUT_THEME.textBody }}>
              Precisely assigned actor roles following the CFMS Microservices architecture.
            </p>
          </RevealWrapper>

          {/* Right members */}
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => {
              const Icon = member.icon;
              return (
                <RevealWrapper key={i} delay={i * 120} className="group">
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-6 text-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: ABOUT_THEME.primary }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: ABOUT_THEME.textTitle }}>{member.name}</h3>
                  <p className="text-xs uppercase tracking-widest mb-4 opacity-60" style={{ color: ABOUT_THEME.primary }}>{member.role}</p>
                  <p className="text-sm opacity-70 leading-relaxed" style={{ color: ABOUT_THEME.textBody }}>{member.summary}</p>
                  <div className="mt-4 h-[1px] w-12 bg-amber-200 group-hover:w-20 transition-all duration-500" />
                </RevealWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};