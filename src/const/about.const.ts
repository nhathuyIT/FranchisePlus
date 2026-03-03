import React from "react";
import { Users, ShieldCheck, Coffee } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  summary: string;
  detail: string;
  icon: React.ElementType;
}

export const ABOUT_THEME = {
  primary: "#6D4C41",
  secondary: "#f7c6a3",
  bgKem: "#FAF8F5",
  textTitle: "#3E2723",
  textBody: "#5D4037",
};

export const ABOUT_CONTENT = {
  hero: {
    title: "OUR ORIGINS",
    subTitle: "THIS STORY IS OURS TO TELL",
    summary: "Capital Corp was founded in 1999, born from a deep love for Vietnamese land, coffee, and the communities that thrive here.",
    detail: "From the very beginning, our goal has been to serve and nurture communities by strengthening the bonds between people through our CFMS ecosystem.",
    image: "https://plus.unsplash.com/premium_photo-1675237625862-d982e7f44696?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "#6D4C41"
  },
  tech: {
    title: "OUR SERVICES",
    subTitle: "TECHNOLOGY THAT EMPOWERS US",
    summary: "A modern Microservices ecosystem ensures stable operations across 100+ global branches with 99.9% uptime.",
    detail: "Our architecture comprises independent services: IAM (Security), Inventory, Product, and Payment. Data is secured with AES-256 encryption standards.",
    image: "https://images.unsplash.com/photo-1763343030530-d76455f7526f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "#f7c6a3"
  },
  aiBooking: {
    title: "AI BREAKTHROUGH",
    subTitle: "AUTOMATED BOOKING EXPERIENCE",
    summary: "AI-powered voice ordering works even offline, optimizing the entire sales pipeline for maximum efficiency.",
    detail: "Our modern POS solution handles 50 concurrent orders per branch. Integrated artificial intelligence elevates customer experience and operational performance.",
    image: "https://media.istockphoto.com/id/2184518485/vi/anh/b%E1%BA%A1n-b%C3%A8-s%E1%BB%AD-d%E1%BB%A5ng-%E1%BB%A9ng-d%E1%BB%A5ng-giao-%C4%91%E1%BB%93-%C4%83n-di-%C4%91%E1%BB%99ng-%C4%91%E1%BB%83-duy%E1%BB%87t-th%E1%BB%B1c-%C4%91%C6%A1n-v%C3%A0-%C4%91%E1%BA%B7t-h%C3%A0ng-tr%E1%BB%B1c-tuy%E1%BA%BFn.jpg?s=612x612&w=0&k=20&c=svRZNgvgC9XfA9x-UK9qUsCvldEs8pygGDo7U6ACKmo=",
    bgColor: "#ffeadd"
  },
};

export const teamMembers: TeamMember[] = [
  {
    name: "Administrator",
    role: "System Administrator",
    summary: "Full control through IAM services and security configuration.",
    detail: "Manages accounts, permissions, payment oversight, and promotion campaigns following SRS v2.0.",
    icon: ShieldCheck,
  },
  {
    name: "Manager",
    role: "Operations Manager",
    summary: "Oversees business performance and branch staffing.",
    detail: "Interacts with Shift Management and Inventory Service to ensure smooth operations.",
    icon: Users,
  },
  {
    name: "Staff",
    role: "Store Associate",
    summary: "Executes daily operations and optimizes customer experience.",
    detail: "Uses POS to process orders, update order statuses, and coordinate deliveries.",
    icon: Coffee,
  },
];

export const awards = [
  { year: "2024", name: "Excellence in Management Systems" },
  { year: "2023", name: "AI Retail Breakthrough" },
];

export const certifications = [
  "ISO 27001 - Security",
  "Rainforest Alliance",
  "Global Franchise Partner",
];

export const testimonials = [
  {
    quote: "CFMS has completely transformed how we operate our chain of 100+ stores.",
    name: "Alex Nguyen",
    location: "CEO, Capital Corp",
    rating: 5,
  },
];