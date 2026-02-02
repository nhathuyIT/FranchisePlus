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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COFFEE_PRODUCTS.map((coffee, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col border border-[#E8DFD6]"
              style={{ minHeight: 500 }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 bg-[#fffbea]/80 text-[#6D4C41] font-semibold text-xs px-4 py-1 rounded-full shadow backdrop-blur-sm tracking-wide uppercase">
                  Signature
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-between p-8">
                <h3 className="text-2xl font-serif font-bold text-[#3E2723] mb-2 group-hover:text-[#6D4C41] transition-colors">
                  {coffee.name}
                </h3>
                <p className="text-[#5D4037] leading-relaxed text-base mb-4 font-sans">
                  {coffee.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="ghost"
                    className="text-[#6D4C41] hover:text-[#fffbea] hover:bg-[#6D4C41] border border-[#6D4C41] font-semibold rounded-full px-6 py-2 transition-all duration-200 shadow-sm"
                  >
                    Learn More
                  </Button>
                  <span className="text-xs text-[#BCAAA4] italic font-serif">
                    100% Arabica
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
