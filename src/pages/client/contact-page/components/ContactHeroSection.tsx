import { Mail, MessageSquare } from "lucide-react";

export const ContactHeroSection = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD]">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-[#6D4C41] rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3E2723] leading-tight tracking-tight">
            Get in Touch
            <br />
            <span className="bg-gradient-to-r from-[#8D6E63] to-[#5D4037] bg-clip-text text-transparent">
              We'd Love to Hear from You
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#5D4037] max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or just want to say hello? We're here
            to help. Reach out to us and we'll get back to you as soon as
            possible.
          </p>
        </div>
      </div>
    </section>
  );
};
