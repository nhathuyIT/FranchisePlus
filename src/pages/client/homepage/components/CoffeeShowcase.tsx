import { Button } from "@/components/ui/button";
import { COFFEE_PRODUCTS } from "@/const/coffee.const";
import { Star, ArrowRight } from "lucide-react";

export const CoffeeShowcase = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-[#F8F5F0] overflow-hidden">
      {/* Decorative vintage pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='none' stroke='%233E2723' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Decorative corner ornaments */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#C4A77D]/30" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#C4A77D]/30" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-[#C4A77D]/30" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[#C4A77D]/30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Classic Style */}
        <div className="text-center mb-20">
          {/* Vintage decorative element */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#C4A77D]" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-[#C4A77D] fill-[#C4A77D]"
                />
              ))}
            </div>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#C4A77D]" />
          </div>

          <span className="inline-block text-[#8B7355] tracking-[0.4em] uppercase text-xs font-medium mb-4">
            Artisan Collection
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#3E2723] mb-6">
            Our Signature
            <span className="block italic text-[#6D4C41] mt-2">Blends</span>
          </h2>

          <p className="text-lg text-[#6D4C41]/80 max-w-xl mx-auto leading-relaxed font-light">
            Discover a curated selection of our finest coffees, each crafted
            with passion and perfected over generations
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-12 h-px bg-[#C4A77D]/50" />
            <div className="w-2 h-2 rotate-45 border border-[#C4A77D]/50" />
            <div className="w-12 h-px bg-[#C4A77D]/50" />
          </div>
        </div>

        {/* Coffee Products - Elegant Masonry Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {COFFEE_PRODUCTS.map((coffee, index) => (
            <div
              key={index}
              className={`group relative ${
                index === 0 || index === 3
                  ? "lg:mt-0"
                  : index % 3 === 1
                    ? "lg:mt-12"
                    : "lg:mt-6"
              }`}
            >
              {/* Card */}
              <div className="relative bg-white rounded-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#E8DFD6]">
                {/* Vintage corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#C4A77D] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#C4A77D] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#C4A77D] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#C4A77D] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Elegant overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#1A1612]/80 via-[#1A1612]/20 to-transparent" />

                  {/* Vintage Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-[#C4A77D] flex items-center justify-center shadow-lg">
                        <div className="w-14 h-14 rounded-full border border-white/50 flex flex-col items-center justify-center">
                          <span className="text-[8px] text-white/80 uppercase tracking-wider">
                            Est.
                          </span>
                          <span className="text-sm font-serif font-bold text-white">
                            1892
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product number */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-6xl font-serif font-bold text-white/10 group-hover:text-white/20 transition-colors duration-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-8 bg-white">
                  {/* Decorative line */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-[#C4A77D]/30 to-transparent" />

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-px bg-[#C4A77D]" />
                    <span className="text-[10px] text-[#8B7355] uppercase tracking-[0.2em] font-medium">
                      Signature Blend
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-serif font-bold text-[#3E2723] mb-3 group-hover:text-[#6D4C41] transition-colors duration-300">
                    {coffee.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[#6D4C41]/70 leading-relaxed text-sm mb-6 font-light">
                    {coffee.description}. Roasted in small batches to preserve
                    the delicate flavors and aromatic complexity.
                  </p>

                  {/* Flavor profile indicators */}
                  <div className="flex items-center gap-4 mb-6 py-4 border-y border-[#E8DFD6]">
                    <div className="flex-1 text-center">
                      <span className="block text-[10px] text-[#8B7355] uppercase tracking-wider mb-1">
                        Body
                      </span>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < 4 ? "bg-[#C4A77D]" : "bg-[#E8DFD6]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-[#E8DFD6]" />
                    <div className="flex-1 text-center">
                      <span className="block text-[10px] text-[#8B7355] uppercase tracking-wider mb-1">
                        Acidity
                      </span>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < 3 ? "bg-[#C4A77D]" : "bg-[#E8DFD6]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-[#E8DFD6]" />
                    <div className="flex-1 text-center">
                      <span className="block text-[10px] text-[#8B7355] uppercase tracking-wider mb-1">
                        Aroma
                      </span>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < 5 ? "bg-[#C4A77D]" : "bg-[#E8DFD6]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8B7355] italic font-serif">
                      100% Arabica
                    </span>
                    <Button
                      variant="ghost"
                      className="group/btn text-[#6D4C41] hover:text-[#C4A77D] hover:bg-transparent font-medium text-sm px-0 py-0 transition-all duration-300"
                    >
                      Discover
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col items-center">
            <p className="text-[#6D4C41]/60 text-sm mb-6 font-light italic">
              "Every cup tells a story of tradition and excellence"
            </p>
            <Button className="group bg-[#3E2723] hover:bg-[#5D4037] text-white font-medium px-10 py-6 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl">
              <span className="tracking-wider uppercase text-sm">
                View Full Collection
              </span>
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-px bg-[#C4A77D]/50" />
              <span className="text-[10px] text-[#8B7355] uppercase tracking-[0.3em]">
                Since 1892
              </span>
              <div className="w-8 h-px bg-[#C4A77D]/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
