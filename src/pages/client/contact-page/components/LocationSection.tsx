import { MapPin, Navigation, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LocationSection = () => {
  const locations = [
    {
      name: "Downtown Location",
      address: "123 Coffee Street, San Francisco, CA 94102",
      hours: "Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM",
      phone: "+1 (555) 123-4567",
    },
    {
      name: "Uptown Location",
      address: "456 Brew Avenue, San Francisco, CA 94103",
      hours: "Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM",
      phone: "+1 (555) 234-5678",
    },
    {
      name: "Waterfront Location",
      address: "789 Harbor Drive, San Francisco, CA 94104",
      hours: "Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM",
      phone: "+1 (555) 345-6789",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#3E2723] mb-4">
            Find Us Near You
          </h2>
          <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">
            Visit one of our locations and experience the perfect cup of coffee
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-xl p-6 border border-[#E8DFD6] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#6D4C41] rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723]">
                  {location.name}
                </h3>
              </div>
              <div className="space-y-3 text-[#5D4037]">
                <p className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#6D4C41]" />
                  <span>{location.address}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#6D4C41]" />
                  <span>{location.hours}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#6D4C41]" />
                  <a
                    href={`tel:${location.phone.replace(/\s/g, "")}`}
                    className="hover:text-[#6D4C41] transition-colors"
                  >
                    {location.phone}
                  </a>
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-xl overflow-hidden border border-[#E8DFD6]">
          <div className="aspect-video bg-[#E8DFD6] flex items-center justify-center relative">
            <div className="text-center z-10">
              <MapPin className="w-16 h-16 text-[#6D4C41] mx-auto mb-4" />
              <p className="text-[#5D4037] font-semibold">
                Interactive Map Coming Soon
              </p>
              <p className="text-sm text-[#5D4037] mt-2">
                Use the addresses above to find us on your preferred map
                application
              </p>
            </div>
            {/* Optional: Add actual map integration here (Google Maps, Mapbox, etc.) */}
          </div>
        </div>
      </div>
    </section>
  );
};
