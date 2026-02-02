import { Button } from "@/components/ui/button";
import { MapPin, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export const AboutCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#6D4C41] to-[#5D4037] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Join Our Coffee Community
        </h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
          Visit us in person, order online, or explore franchise opportunities.
          Become part of a community that values quality, sustainability, and
          exceptional coffee experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            asChild
            className="bg-white text-[#6D4C41] hover:bg-[#FAF8F5] px-10 py-6 text-lg rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            <Link to="/contact" className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Find a Location
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-10 py-6 text-lg rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
              <Handshake className="w-5 h-5" />
              Become a Partner
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
