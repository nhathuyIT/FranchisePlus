import { awards, certifications, testimonials } from "@/const/about.const";
import { Star, Quote, Award } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#3E2723] mb-4">
            Trusted by Coffee Lovers Worldwide
          </h2>
          <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">
            See what our community has to say about their experience
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <div className="bg-linear-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex justify-center mb-6">
              <Quote className="w-12 h-12 text-[#6D4C41] opacity-50" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-[#3E2723] text-center mb-8 leading-relaxed">
              {testimonials[0].quote}
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {testimonials[0].name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-[#3E2723]">
                  {testimonials[0].name}
                </div>
                <div className="text-sm text-[#5D4037]">
                  {testimonials[0].location}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(testimonials[0].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {awards.map((award, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 text-center border border-[#E8DFD6]"
            >
              <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#6D4C41] mb-2">
                {award.year}
              </div>
              <div className="text-sm text-[#5D4037] font-medium">
                {award.name}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-xl p-8 border border-[#E8DFD6]">
          <h3 className="text-2xl font-bold text-[#3E2723] mb-6 text-center">
            Certifications & Partnerships
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-[#6D4C41] font-semibold">{cert}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
