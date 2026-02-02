import { HighlandsSection } from "./HighlandsSection";
import { ABOUT_CONTENT } from "@/const/about.const";

export const BentoGridStorySection = () => {
  return <HighlandsSection {...ABOUT_CONTENT.tech} isReversed={true} />;
};