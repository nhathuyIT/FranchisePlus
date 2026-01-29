import { FEATURES } from "@/const/features.const";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#3E2723] mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">
            We're committed to bringing you the best coffee experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#E8DFD6]"
              >
                <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#5D4037] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
