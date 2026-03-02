import { useEffect, useCallback, useState } from "react";
import { ABOUT_THEME } from "@/const/about.const";

interface SectionProps {
  title: string;
  subTitle: string;
  summary: string;
  detail: string;
  image: string;
  isReversed?: boolean;
  bgColor?: string;
  prevBgColor?: string;
  nextBgColor?: string;
}

const RevealWrapper = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackRef = useCallback((el: HTMLDivElement | null) => { setNode(el); }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
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

const ImageReveal = ({ src, alt, isVisible }: { src: string; alt: string; isVisible: boolean }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${isVisible ? "scale-100 opacity-100" : "scale-105 opacity-60"}`}
    />
  );
};

export const HighlandsSection = ({ title, subTitle, summary, detail, image, isReversed, bgColor, prevBgColor, nextBgColor }: SectionProps) => {
  const backgroundColor = bgColor || ABOUT_THEME.bgKem;
  const isDark = bgColor === ABOUT_THEME.primary;
  const textColor = isDark ? "#FFF" : ABOUT_THEME.textTitle;
  const subColor = isDark ? "#FAF8F5" : ABOUT_THEME.primary;
  const bodyColor = isDark ? "#FFF" : ABOUT_THEME.textBody;
  const borderColor = isDark ? "#FFF" : ABOUT_THEME.primary;

  const [sectionNode, setSectionNode] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useCallback((el: HTMLDivElement | null) => { setSectionNode(el); }, []);

  useEffect(() => {
    if (!sectionNode) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(sectionNode);
    return () => observer.disconnect();
  }, [sectionNode]);

  return (
    <div className="relative shrink-0">
      {/* Top gradient blend from previous section */}
      {prevBgColor && prevBgColor !== backgroundColor && (
        <div
          className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${prevBgColor}, transparent)` }}
        />
      )}

      <div
        ref={sectionRef}
        className={`relative w-full flex flex-col md:flex-row min-h-[550px] overflow-hidden ${isReversed ? "md:flex-row-reverse" : ""}`}
      >
        {/* Content Column */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-20 z-10" style={{ backgroundColor }}>
          <RevealWrapper className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter" style={{ color: textColor }}>
              {title}
            </h2>
            <h3 className="text-sm font-bold mb-6 uppercase tracking-[0.2em]" style={{ color: subColor }}>
              {subTitle}
            </h3>
            <p className="text-lg leading-relaxed mb-6 opacity-90" style={{ color: bodyColor }}>
              {summary}
            </p>
            <div className="border-l-4 pl-5 italic text-base leading-relaxed opacity-80" style={{ borderColor, color: bodyColor }}>
              {detail}
            </div>
          </RevealWrapper>
        </div>

        {/* Image Column with gradient mask */}
        <div className="w-full md:w-1/2 relative min-h-[400px]">
          <ImageReveal src={image} alt={title} isVisible={isVisible} />
          <div
            className="absolute inset-0"
            style={{
              background: isReversed
                ? `linear-gradient(90deg, transparent 0%, transparent 40%, ${backgroundColor} 100%)`
                : `linear-gradient(90deg, ${backgroundColor} 0%, transparent 60%, transparent 100%)`
            }}
          />
        </div>
      </div>

      {/* Bottom gradient blend to next section */}
      {nextBgColor && nextBgColor !== backgroundColor && (
        <div
          className="absolute bottom-0 left-0 right-0 h-20 z-20 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${nextBgColor}, transparent)` }}
        />
      )}
    </div>
  );
};