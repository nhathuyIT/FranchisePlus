import { Coffee, Leaf, Heart, Award, type LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Coffee,
    title: "Premium Quality",
    description: "Sourced from the finest coffee plantations worldwide",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Eco-friendly practices from farm to cup",
  },
  {
    icon: Heart,
    title: "Crafted with Love",
    description: "Every blend is carefully perfected by our experts",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized globally for exceptional taste",
  },
];
