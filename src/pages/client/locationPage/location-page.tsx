import { useState } from "react";
import { STORE_LOCATIONS, LOCATION_THEME } from "@/const/location.const";
import type { StoreLocationData } from "@/const/location.const";
import { Search, MapPin } from "lucide-react";
import { StoreMap } from "./components/storeMap";

const LocationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreLocationData | null>(null);
  const filteredStores = STORE_LOCATIONS.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: LOCATION_THEME.bgKem }}>
      {/* Header */}
      <div className="bg-white p-6 shadow-sm z-10 border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <h2 className="text-2xl font-black uppercase text-[#6D4C41]">Store Locator</h2>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by city, street or store name..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:border-[#6D4C41] outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <div className="w-[400px] bg-white border-r overflow-y-auto">
          {filteredStores.map(store => (
            <div
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`p-6 border-b cursor-pointer transition-all ${
                selectedStore?.id === store.id ? "bg-amber-50" : "hover:bg-gray-50"
              }`}
            >
              <h3 className="font-bold text-[#6D4C41]">{store.name}</h3>
              <p className="text-sm opacity-60 flex items-start gap-2 mt-1">
                <MapPin size={14} className="mt-1 shrink-0" /> {store.address}
              </p>
            </div>
          ))}
        </div>

        {/* Right Map */}
        <div className="flex-1">
          <StoreMap stores={filteredStores} selectedStore={selectedStore} />
        </div>
      </div>
    </div>
  );
};

export default LocationPage;