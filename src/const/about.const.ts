import { Award, Users, Lightbulb, Leaf, Coffee } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  icon: typeof Coffee;
}

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

export const awards = [
  { year: "2024", name: "Best Coffee Chain" },
  { year: "2023", name: "Sustainability Award" },
  { year: "2022", name: "Customer Choice" },
  { year: "2021", name: "Quality Excellence" },
];

export const certifications = [
  "Fair Trade Certified",
  "Organic Certified",
  "Rainforest Alliance",
  "Carbon Neutral",
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The best coffee I've ever had! Every visit feels like coming home. The quality is unmatched and the atmosphere is warm and welcoming.",
    name: "Jennifer Martinez",
    location: "San Francisco, CA",
    rating: 5,
  },
  {
    quote:
      "As a coffee enthusiast, I've tried many places. This franchise consistently delivers exceptional quality and service. Highly recommend!",
    name: "Robert Thompson",
    location: "New York, NY",
    rating: 5,
  },
  {
    quote:
      "Their commitment to sustainability and quality is evident in every cup. I'm proud to support a business that cares about the environment.",
    name: "Amanda Lee",
    location: "Seattle, WA",
    rating: 5,
  },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Passionate about bringing exceptional coffee to communities worldwide.",
    icon: Coffee,
  },
  {
    name: "Michael Chen",
    role: "Head of Quality",
    bio: "Master roaster with 20+ years of experience in coffee excellence.",
    icon: Award,
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Sustainability",
    bio: "Leading our mission to create a more sustainable coffee industry.",
    icon: Leaf,
  },
  {
    name: "David Kim",
    role: "Community Director",
    bio: "Building connections between our coffee and the communities we serve.",
    icon: Users,
  },
];

export const values = [
  { icon: Award, title: "Quality", description: "Excellence in every cup" },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Eco-friendly practices",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building connections",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Always improving",
  },
];

export const milestones = [
  {
    year: "1999",
    title: "First Location",
    description: "Opened our first coffee shop",
  },
  {
    year: "2010",
    title: "First Franchise",
    description: "Welcomed first partner",
  },
  {
    year: "2015",
    title: "25 Locations",
    description: "Reached 25 locations milestone",
  },
  {
    year: "2020",
    title: "Sustainability",
    description: "Achieved certification",
  },
  { year: "2024", title: "50+ Locations", description: "Nationwide expansion" },
];
