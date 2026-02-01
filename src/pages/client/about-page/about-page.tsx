import {
  AboutHeroSection,
  BentoGridStorySection,
  TeamSection,
  TestimonialsSection,
  AboutCTASection,
} from "./components";
import { FooterInfo } from "@/components/common/FooterInfo";

const AboutPage = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <AboutHeroSection />
      <BentoGridStorySection />
      <TeamSection />
      <TestimonialsSection />
      <AboutCTASection />
      <FooterInfo />
    </div>
  );
};

export default AboutPage;
