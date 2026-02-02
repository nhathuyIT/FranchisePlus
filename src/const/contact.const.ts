import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

interface ContactInfo {
  icon: typeof MapPin;
  title: string;
  content: string;
  link?: string;
}

export const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    title: "Visit Us",
    content: "123 Coffee Street\nSan Francisco, CA 94102\nUnited States",
  },
  {
    icon: Phone,
    title: "Call Us",
    content: "+1 (555) 123-4567",
    link: "tel:+15551234567",
  },
  {
    icon: Mail,
    title: "Email Us",
    content: "hello@franchiseplus.com",
    link: "mailto:hello@franchiseplus.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    content: "Mon - Fri: 7:00 AM - 8:00 PM\nSat - Sun: 8:00 AM - 9:00 PM",
  },
];

export const socialLinks = [
  { icon: Facebook, name: "Facebook", url: "#" },
  { icon: Instagram, name: "Instagram", url: "#" },
  { icon: Twitter, name: "Twitter", url: "#" },
];
