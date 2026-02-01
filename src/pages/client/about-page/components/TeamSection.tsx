import { teamMembers } from "@/const/about.const";

export const TeamSection = () => {
  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#3E2723] mb-4">
            Meet the People Behind the Passion
          </h2>
          <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">
            Our team is dedicated to bringing you the best coffee experience
            every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] text-center"
              >
                <div className="w-24 h-24 bg-[#6D4C41] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723] mb-2">
                  {member.name}
                </h3>
                <p className="text-[#6D4C41] font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-[#5D4037] text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
