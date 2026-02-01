import {
  HeroSection,
  FeaturesSection,
  CoffeeShowcase,
  CTASection,
  FooterInfo,
} from "./components";

const HomePage = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CoffeeShowcase />
      <CTASection />
      <FooterInfo />
    </div>
  );
};

export default HomePage;
