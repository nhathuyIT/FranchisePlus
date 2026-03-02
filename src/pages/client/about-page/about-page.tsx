import {
  AboutHeroSection,
  TeamSection,
  TestimonialsSection,
} from "./components";
import { HighlandsSection } from "./components/HighlandsSection";
import { ABOUT_CONTENT } from "@/const/about.const";
import { FooterInfo } from "@/components/common/FooterInfo";

const AboutPage = () => {
  const heroBg = ABOUT_CONTENT.hero.bgColor;
  const techBg = ABOUT_CONTENT.tech.bgColor;
  const aiBg = ABOUT_CONTENT.aiBooking.bgColor;

  return (
    <div className="bg-white min-h-screen">
      <AboutHeroSection />

      {/* Row 1: Text left, image right */}
      <HighlandsSection {...ABOUT_CONTENT.hero} isReversed={false} prevBgColor={heroBg} nextBgColor={techBg} />

      {/* Row 2: Image left, text right */}
      <HighlandsSection {...ABOUT_CONTENT.tech} isReversed={true} prevBgColor={heroBg} nextBgColor={aiBg} />

      {/* Row 3: Text left, image right */}
      <HighlandsSection {...ABOUT_CONTENT.aiBooking} isReversed={false} prevBgColor={techBg} nextBgColor="#FAF8F5" />

      <TeamSection />
      <TestimonialsSection />
      <FooterInfo />
    </div>
  );
};

export default AboutPage;
