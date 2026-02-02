import featureImg1 from "@/assets/carousel_1.jpg";
import featureImg2 from "@/assets/carousel_2.jpg";
import featureImg3 from "@/assets/mike-kenneally-tNALoIZhqVM-unsplash.jpg";
const featureImages = [featureImg1, featureImg2, featureImg3, featureImg1];
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
            const img = featureImages[index % featureImages.length];
            return (
              <div
                key={index}
                className="group bg-white p-0 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#E8DFD6] overflow-hidden flex flex-col"
                style={{ minHeight: 420 }}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={img}
                    alt={feature.title}
                    className="object-cover w-full h-full group-hover:scale-150 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-7 flex flex-col gap-15">
                  <h3 className="text-2xl font-bold text-[#3E2723] mb-2 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-[#5D4037] leading-relaxed text-base mb-2 font-sans">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
