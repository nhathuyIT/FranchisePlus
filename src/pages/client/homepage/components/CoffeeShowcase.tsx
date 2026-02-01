import { Button } from "@/components/ui/button";
import { COFFEE_PRODUCTS } from "@/const/coffee.const";

export const CoffeeShowcase = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#3E2723] mb-4">
            Our Signature Blends
          </h2>
          <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">
            Discover a world of flavors crafted for every taste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COFFEE_PRODUCTS.map((coffee, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#3E2723] mb-2">
                  {coffee.name}
                </h3>
                <p className="text-[#5D4037] leading-relaxed mb-4">
                  {coffee.description}
                </p>
                <Button
                  variant="ghost"
                  className="text-[#6D4C41] hover:text-[#5D4037] hover:bg-[#FAF8F5] transition-colors duration-200 cursor-pointer"
                >
                  Learn More →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
