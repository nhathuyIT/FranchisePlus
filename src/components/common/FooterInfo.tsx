export const FooterInfo = () => {
  return (
    <section className="py-16 bg-[#3E2723] text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold mb-4">Fresh Daily</h3>
            <p className="text-[#BCAAA4] leading-relaxed">
              All our beans are roasted daily to ensure maximum freshness and
              flavor in every cup.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Ethically Sourced</h3>
            <p className="text-[#BCAAA4] leading-relaxed">
              We partner directly with farmers to ensure fair trade and
              sustainable practices.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Expert Crafted</h3>
            <p className="text-[#BCAAA4] leading-relaxed">
              Our master baristas bring years of experience to perfect every
              brewing method.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
