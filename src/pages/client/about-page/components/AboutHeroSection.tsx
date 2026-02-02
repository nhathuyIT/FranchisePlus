import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

export const AboutHeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD]">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#6D4C41] rounded-full flex items-center justify-center">
              <Coffee className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#3E2723] leading-tight tracking-tight">
            Our Story Begins with
            <br />
            <span className="bg-gradient-to-r from-[#8D6E63] to-[#5D4037] bg-clip-text text-transparent">
              a Simple Passion
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#5D4037] max-w-2xl mx-auto leading-relaxed">
            From a small coffee shop to a beloved franchise, we've stayed true
            to our mission: bringing exceptional coffee to every cup. Every bean
            tells a story of quality, sustainability, and the communities we
            serve.
          </p>
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-8 py-6 text-lg rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            >
              Explore Our Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
