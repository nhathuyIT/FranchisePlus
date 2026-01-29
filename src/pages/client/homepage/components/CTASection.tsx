import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#6D4C41] to-[#5D4037] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Start Your Coffee Journey Today
        </h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
          Join thousands of coffee lovers who have made us their daily ritual.
          Experience the difference of truly exceptional coffee.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-white text-[#6D4C41] hover:bg-[#FAF8F5] px-10 py-6 text-lg rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            Order Now
          </Button>
          <Button
            size="lg"
            className="bg-white text-[#6D4C41] hover:bg-[#FAF8F5] px-10 py-6 text-lg rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            View Locations
          </Button>
        </div>
      </div>
    </section>
  );
};
