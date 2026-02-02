import { Coffee, Award, Leaf, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { milestones, values } from "@/const/about.const";

export const BentoGridStorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Our Origin (span 5) */}
          <div className="md:col-span-5 bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]">
            <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center mb-6">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#3E2723] mb-4">
              Where It All Started
            </h2>
            <p className="text-[#5D4037] leading-relaxed mb-4">
              Founded in 1999 with a simple vision: to bring exceptional coffee
              to every neighborhood. What began as a single coffee shop has
              grown into a beloved franchise, but our commitment to quality and
              community remains unchanged.
            </p>
            <p className="text-[#5D4037] leading-relaxed italic">
              "Every cup is a promise of quality, every sip a moment of
              connection."
            </p>
          </div>

          {/* Card 2: Core Values (span 4) */}
          <div className="md:col-span-4 bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-xl border border-[#E8DFD6] p-8 hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-6">
              What We Stand For
            </h2>
            <div className="space-y-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#6D4C41] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3E2723]">
                        {value.title}
                      </h3>
                      <p className="text-sm text-[#5D4037]">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Impact Stats (span 3) */}
          <div className="md:col-span-3 bg-[#6D4C41] text-white rounded-xl p-8 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6">Our Impact</h2>
            <div className="space-y-6">
              <div>
                <div className="text-4xl font-bold mb-1">50+</div>
                <div className="text-sm opacity-90">Locations</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">1M+</div>
                <div className="text-sm opacity-90">Cups Served</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">100+</div>
                <div className="text-sm opacity-90">Awards Won</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">25+</div>
                <div className="text-sm opacity-90">Years</div>
              </div>
            </div>
          </div>

          {/* Card 4: Journey Timeline (span 12 - full width) */}
          <div className="md:col-span-12 bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-[#3E2723] mb-8 text-center">
              Our Journey
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-[#6D4C41] via-[#8D6E63] to-[#6D4C41]"></div>

              {/* Timeline Items */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="w-24 h-24 bg-[#6D4C41] rounded-full flex items-center justify-center mb-4 relative z-10 shadow-lg">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#6D4C41] mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="font-semibold text-[#3E2723] mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-[#5D4037]">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 5: Quality Promise (span 4) */}
          <div className="md:col-span-4 bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]">
            <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">
              Quality Promise
            </h2>
            <p className="text-[#5D4037] leading-relaxed mb-4">
              Every bean is carefully selected, roasted to perfection, and
              brewed with precision. Our quality assurance process ensures
              consistency in every cup, every day.
            </p>
            <ul className="space-y-2 text-[#5D4037]">
              <li className="flex items-center gap-2">
                <span className="text-[#6D4C41]">✓</span>
                Direct trade partnerships
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#6D4C41]">✓</span>
                Daily fresh roasting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#6D4C41]">✓</span>
                Expert barista training
              </li>
            </ul>
          </div>

          {/* Card 6: Sustainability (span 8) */}
          <div className="md:col-span-8 bg-gradient-to-r from-[#8D6E63] to-[#6D4C41] text-white rounded-xl p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">
                  Sustainability Commitment
                </h2>
              </div>
              <p className="text-lg mb-6 opacity-95 max-w-2xl">
                We're committed to environmental responsibility. From
                sustainable farming practices to eco-friendly packaging, we're
                building a better future, one cup at a time.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm opacity-90">Fair Trade</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50%</div>
                  <div className="text-sm opacity-90">Carbon Neutral</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">Zero</div>
                  <div className="text-sm opacity-90">Waste Goal</div>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
