import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";

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
  },
  {
    image: carousel2,
    title: "A Sensory Journey",
    description:
      "Every cup tells a story of quality, sustainability, and exceptional taste.",
  },
  {
    image: mikeCoffee,
    title: "Moments to Savor",
    description: "Indulge in the warmth and aroma of our signature blends.",
  },
];

const textVariants = {
  initial: { x: "100vw", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { x: "-20vw", opacity: 0, transition: { duration: 1.2 } },
};

export const HeroSection = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        speed={1200}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                <AnimatePresence mode="wait">
                  {activeIndex === idx && (
                    <motion.div
                      key={slide.title}
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-center px-6"
                    >
                      <h1
                        className="text-5xl md:text-7xl font-serif font-bold text-[#fffbea] drop-shadow-lg mb-6"
                        style={{
                          textShadow:
                            "0 4px 24px rgba(0,0,0,0.45), 0 1px 0 #6D4C41",
                        }}
                      >
                        {slide.title}
                      </h1>
                      <p
                        className="text-xl md:text-2xl font-sans text-[#fffbea] drop-shadow-md max-w-2xl mx-auto"
                        style={{
                          textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                        }}
                      >
                        {slide.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
