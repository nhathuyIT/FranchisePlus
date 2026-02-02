import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Coffee-themed images (local assets)
import carousel1 from "@/assets/carousel_1.jpg";
import carousel2 from "@/assets/carousel_2.jpg";
import mikeCoffee from "@/assets/mike-kenneally-tNALoIZhqVM-unsplash.jpg";

const slides = [
  {
    image: carousel1,
    title: "Crafted with Passion",
    description:
      "Experience the finest selection of artisanal coffee beans, roasted to perfection.",
    accent: "Every Bean, Every Moment",
  },
  {
    image: carousel2,
    title: "A Sensory Journey",
    description:
      "Every cup tells a story of quality, sustainability, and exceptional taste.",
    accent: "From Farm to Cup",
  },
  {
    image: mikeCoffee,
    title: "Moments to Savor",
    description: "Indulge in the warmth and aroma of our signature blends.",
    accent: "Pure Coffee Excellence",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.1,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

const textVariants = {
  initial: { y: 60, opacity: 0 },
  animate: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: delay * 0.15,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

export const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [activeIndex, isAutoPlaying, nextSlide]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-linear-to-br from-[#3E2723] to-[#1A1612]">
      {/* Slides Container */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Background Image with Ken Burns effect */}
            <div className="absolute inset-0 w-full h-full">
              <motion.img
                src={slides[activeIndex].image}
                alt={slides[activeIndex].title}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 6, ease: "linear" }}
              />
              {/* Multi-layer gradient overlay for depth */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-linear-to-r from-[#3E2723]/60 via-transparent to-[#3E2723]/60" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeIndex}`}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -30 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Accent text */}
              <motion.div
                variants={textVariants}
                custom={0}
                className="flex items-center justify-center gap-3"
              >
                <div className="h-px w-12 bg-linear-to-r from-transparent to-[#C4A77D]" />
                <span className="text-[#C4A77D] tracking-[0.3em] uppercase text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  {slides[activeIndex].accent}
                </span>
                <div className="h-px w-12 bg-linear-to-l from-transparent to-[#C4A77D]" />
              </motion.div>

              {/* Main title */}
              <motion.h1
                variants={textVariants}
                custom={1}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight"
                style={{
                  textShadow:
                    "0 4px 24px rgba(0,0,0,0.6), 0 8px 48px rgba(0,0,0,0.4)",
                }}
              >
                {slides[activeIndex].title}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={textVariants}
                custom={2}
                className="text-lg sm:text-xl md:text-2xl font-sans text-white/90 max-w-3xl mx-auto leading-relaxed"
                style={{
                  textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                {slides[activeIndex].description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={textVariants}
                custom={3}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <button className="group relative px-8 py-4 bg-[#C4A77D] text-white font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#C4A77D]/50 hover:scale-105">
                  <span className="relative z-10">Explore Our Coffee</span>
                  <div className="absolute inset-0 bg-linear-to-r from-[#D4B78D] to-[#C4A77D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-full border-2 border-white/30 transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105">
                  Our Story
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          prevSlide();
          setIsAutoPlaying(false);
        }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={() => {
          nextSlide();
          setIsAutoPlaying(false);
        }}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`group transition-all duration-300 ${
              index === activeIndex ? "w-12" : "w-3"
            } h-3 rounded-full overflow-hidden`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-[#C4A77D]"
                  : "bg-white/30 group-hover:bg-white/50"
              }`}
            >
              {index === activeIndex && (
                <motion.div
                  className="h-full bg-linear-to-r from-[#C4A77D] to-[#D4B78D]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Decorative scroll indicator */}
      <div className="absolute bottom-8 left-8 z-20 hidden lg:flex flex-col items-center gap-2 text-white/60">
        <span
          className="text-xs uppercase tracking-widest rotate-180"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll Down
        </span>
        <motion.div
          className="w-px h-12 bg-linear-to-b from-white/60 to-transparent"
          animate={{ height: [48, 24, 48] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
