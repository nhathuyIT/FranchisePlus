import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD]">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#3E2723] leading-tight tracking-tight">
              Crafted with <br />
              <span className="bg-gradient-to-r from-[#8D6E63] to-[#5D4037] bg-clip-text text-transparent">
                Passion
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#5D4037] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the finest selection of artisanal coffee beans, roasted
              to perfection. Every cup tells a story of quality, sustainability,
              and exceptional taste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-8 py-6 text-lg rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                Explore Our Menu
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-8 py-6 text-lg rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                Find a Location
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-[#8D6E63] rounded-full opacity-10 blur-3xl animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop"
                alt="Premium coffee cup"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
