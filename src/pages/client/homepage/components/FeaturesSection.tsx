import { Heart, Award } from "lucide-react";
import CoffeeCupIcon from "@/assets/icons/coffee-cup.png";
import LeafIcon from "@/assets/icons/leaves.png";

const features = [
  {
    icon: "coffee",
    title: "Premium Quality",
    subtitle: "From Bean to Cup",
    description:
      "Sourced from the finest coffee plantations in Ethiopia, Colombia, and Brazil. Each bean is hand-selected to ensure only the top 1% makes it to your cup.",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    stats: { value: "100%", label: "Arabica" },
  },
  {
    icon: "leaf",
    title: "Sustainable Sourcing",
    subtitle: "Earth First, Always",
    description:
      "We partner directly with farmers who use regenerative practices. Our zero-waste roasting process ensures every step honors our planet.",
    image:
      "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800&q=80",
    stats: { value: "50+", label: "Partner Farms" },
  },
  {
    icon: Heart,
    title: "Crafted with Passion",
    subtitle: "Artisan Roasting",
    description:
      "Our master roasters bring 30+ years of expertise to every small batch. The result? A flavor profile that's unmistakably ours.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    stats: { value: "30+", label: "Years Expertise" },
  },
  {
    icon: Award,
    title: "Award Winning",
    subtitle: "Globally Recognized",
    description:
      "From the Golden Bean Award to World Barista Championships, our commitment to excellence has been celebrated worldwide.",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    stats: { value: "15+", label: "Global Awards" },
  },
];

export const FeaturesSection = () => {
  return (
    <section className="relative bg-[#1A1612] overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block text-[#C4A77D] tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            The Art of
            <span className="block text-[#C4A77D] italic">
              Exceptional Coffee
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-transparent via-[#C4A77D] to-transparent mx-auto" />
        </div>
      </div>

      <div className="relative">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="relative min-h-[80vh] lg:min-h-screen flex items-center"
            >
              {/* Background Image with Parallax Effect */}
              <div
                className={`absolute inset-0 w-full lg:w-3/5 ${
                  isEven ? "lg:right-0 lg:left-auto" : "lg:left-0"
                }`}
              >
                <div className="relative h-full overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${
                      isEven
                        ? "from-[#1A1612] via-[#1A1612]/80 to-transparent"
                        : "from-transparent via-[#1A1612]/80 to-[#1A1612]"
                    } lg:block hidden`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1A1612] via-[#1A1612]/60 to-[#1A1612]/40 lg:hidden" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 container mx-auto px-4 py-20 lg:py-0">
                <div
                  className={`lg:w-1/2 ${isEven ? "lg:mr-auto" : "lg:ml-auto"}`}
                >
                  <div
                    className={`max-w-lg ${
                      isEven ? "lg:pr-8" : "lg:pl-8 lg:ml-auto"
                    }`}
                  >
                    {/* Icon */}
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C4A77D]/10 border border-[#C4A77D]/30 backdrop-blur-sm">
                      {typeof Icon === "string" ? (
                        <img
                          src={Icon === "coffee" ? CoffeeCupIcon : LeafIcon}
                          alt={feature.title}
                          className="w-8 h-8"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(70%) sepia(20%) saturate(800%) hue-rotate(8deg) brightness(95%) contrast(86%)",
                          }}
                        />
                      ) : (
                        <Icon className="w-8 h-8 text-[#C4A77D]" />
                      )}
                    </div>

                    {/* Subtitle */}
                    <span className="block text-[#C4A77D] tracking-[0.2em] uppercase text-xs font-medium mb-3">
                      {feature.subtitle}
                    </span>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-white/70 leading-relaxed mb-8">
                      {feature.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-center px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                        <span className="block text-3xl lg:text-4xl font-bold text-[#C4A77D]">
                          {feature.stats.value}
                        </span>
                        <span className="text-xs text-white/50 uppercase tracking-wider">
                          {feature.stats.label}
                        </span>
                      </div>
                      <div className="h-12 w-px bg-white/10" />
                      <div className="flex-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full bg-[#C4A77D]"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-white/40 mt-2 block">
                          Excellence Rating
                        </span>
                      </div>
                    </div>

                    {/* Decorative line */}
                    <div
                      className={`mt-12 h-px w-32 bg-linear-to-r ${
                        isEven
                          ? "from-[#C4A77D] to-transparent"
                          : "from-transparent to-[#C4A77D] ml-auto"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section indicator */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-2">
                {features.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === index
                        ? "bg-[#C4A77D] scale-125"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom flourish */}
      <div className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#C4A77D]/20 to-transparent flex items-center justify-center border border-[#C4A77D]/20 group-hover:border-[#C4A77D]/50 transition-all duration-300 group-hover:scale-110">
                      {typeof Icon === "string" ? (
                        <img
                          src={Icon === "coffee" ? CoffeeCupIcon : LeafIcon}
                          alt={feature.title}
                          className="w-8 h-8 transition-all duration-300"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(70%) sepia(20%) saturate(800%) hue-rotate(8deg) brightness(95%) contrast(86%)",
                          }}
                        />
                      ) : (
                        <Icon className="w-8 h-8 text-[#C4A77D] group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>
                    <div className="absolute -inset-2 rounded-full bg-[#C4A77D]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <span className="text-white/60 text-sm font-medium group-hover:text-[#C4A77D] transition-colors duration-300">
                    {feature.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative coffee bean shapes */}
        <div className="absolute -left-20 bottom-0 w-40 h-40 rounded-full bg-[#C4A77D]/5 blur-3xl" />
        <div className="absolute -right-20 top-0 w-60 h-60 rounded-full bg-[#C4A77D]/5 blur-3xl" />
      </div>
    </section>
  );
};
