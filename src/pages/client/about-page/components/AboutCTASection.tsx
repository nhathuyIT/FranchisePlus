import { HighlandsSection } from "./HighlandsSection"; 
import { ABOUT_CONTENT } from "@/const/about.const";

export const AboutCTASection = () => {
  return <HighlandsSection {...ABOUT_CONTENT.hero} isReversed={false} />;
};