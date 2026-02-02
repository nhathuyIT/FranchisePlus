import {
  AboutHeroSection,
  TeamSection,
  TestimonialsSection,
} from "./components";
import { HighlandsSection } from "./components/HighlandsSection";
import { ABOUT_CONTENT } from "@/const/about.const";
import { FooterInfo } from "@/components/common/FooterInfo";

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <AboutHeroSection />
      
      {/* Hàng 1: Script trái, ảnh phải */}
      <HighlandsSection {...ABOUT_CONTENT.hero} isReversed={false} />
      
      {/* Hàng 2: Ảnh trái, script phải */}
      <HighlandsSection {...ABOUT_CONTENT.tech} isReversed={true} />
      
      {/* Hàng 3: Script trái, ảnh phải */}
      <HighlandsSection {...ABOUT_CONTENT.aiBooking} isReversed={false} />
      
      <TeamSection />
      <TestimonialsSection />
      <FooterInfo />
    </div>
  );
};

export default AboutPage;
