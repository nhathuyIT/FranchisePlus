import { LOCATION_THEME } from "@/const/location.const";

export const LocationHero = () => {
  return (
    <section className="relative py-20 overflow-hidden" style={{ backgroundColor: LOCATION_THEME.bgKem }}>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h4 className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: LOCATION_THEME.primary }}>
          Our Network
        </h4>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6" style={{ color: LOCATION_THEME.primary }}>
          Finding Your <br /> Favorite Spot
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-80 leading-relaxed" style={{ color: LOCATION_THEME.primary }}>
          With over 100+ locations across Vietnam and growing globally, we are always close to you. 
          Discover the unique atmosphere of each store.
        </p>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none translate-x-1/2 -translate-y-1/2 rounded-full border-[40px]" style={{ borderColor: LOCATION_THEME.primary }} />
    </section>
  );
};