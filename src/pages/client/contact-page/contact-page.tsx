import {
  ContactHeroSection,
  ContactFormSection,
  ContactInfoSection,
  LocationSection,
} from "./components";
import { FooterInfo } from "@/components/common/FooterInfo";

const ContactPage = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <ContactHeroSection />
      <ContactFormSection />
      <ContactInfoSection />
      <LocationSection />
      <FooterInfo />
    </div>
  );
};

export default ContactPage;
