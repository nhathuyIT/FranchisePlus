import { useState, useMemo } from "react";
import { LOCATION_THEME } from "@/const/location.const";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { StoreMap } from "./components/storeMap";
import { useClientFranchises, useClientFranchiseById } from "@/hooks/client/useClientFranchise.hooks";

const LocationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const { data: franchises = [], isLoading, isError } = useClientFranchises();

  // Fetch full detail (including google_map_script) when a store is selected
  const { data: selectedStoreDetail } = useClientFranchiseById(selectedStoreId);

  const activeStores = useMemo(
    () => franchises.filter((f) => f.isActive !== false && f.isDeleted !== true),
    [franchises],
  );

  const filteredStores = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return activeStores.filter(
      (s) =>
        (s.name ?? '').toLowerCase().includes(term) ||
        (s.address ?? '').toLowerCase().includes(term),
    );
  }, [activeStores, searchTerm]);

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
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-amber-700">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-sm">Loading stores...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-red-500 p-6 text-center">
              <AlertCircle size={28} />
              <p className="text-sm">Failed to load stores. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && filteredStores.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 p-6 text-center">
              <MapPin size={28} />
              <p className="text-sm">No stores found matching your search.</p>
            </div>
          )}

          {!isLoading && !isError && filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`p-6 border-b cursor-pointer transition-all ${
                  selectedStoreId === store.id ? "bg-amber-50" : "hover:bg-gray-50"
                }`}
              >
                <h3 className="font-bold text-[#6D4C41]">{store.name}</h3>
                {store.address && (
                  <p className="text-sm opacity-60 flex items-start gap-2 mt-1">
                    <MapPin size={14} className="mt-1 shrink-0" /> {store.address}
                  </p>
                )}
                {store.hotline && (
                  <p className="text-xs text-amber-700 mt-1.5">
                    Hotline: {store.hotline}
                  </p>
                )}
              </div>
            ))}
        </div>

        {/* Right Map */}
        <div className="flex-1">
          <StoreMap stores={filteredStores} selectedStore={selectedStoreDetail ?? null} onSelectStore={(store) => setSelectedStoreId(store.id)} />
        </div>
      </div>
    </div>
  );
};


export default LocationPage;