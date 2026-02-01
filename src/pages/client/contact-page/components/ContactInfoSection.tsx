import { contactInfo, socialLinks } from "@/const/contact.const";

export const ContactInfoSection = () => {
  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#3E2723] mb-4">
            Other Ways to Reach Us
          </h2>
          <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">
            We're available through multiple channels. Choose what works best
            for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const contentLines = info.content.split("\n");

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] text-center"
              >
                <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723] mb-3">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-[#5D4037] hover:text-[#6D4C41] transition-colors"
                  >
                    {contentLines.map((line, i) => (
                      <p key={i} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </a>
                ) : (
                  <div className="text-[#5D4037]">
                    {contentLines.map((line, i) => (
                      <p key={i} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h3 className="text-2xl font-bold text-[#3E2723] mb-6">
            Follow Us on Social Media
          </h3>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  className="w-14 h-14 bg-[#6D4C41] rounded-full flex items-center justify-center hover:bg-[#5D4037] transition-colors cursor-pointer"
                  aria-label={social.name}
                >
                  <Icon className="w-6 h-6 text-white" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
