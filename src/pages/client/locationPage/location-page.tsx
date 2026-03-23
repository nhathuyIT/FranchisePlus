import { useState } from "react";
import { LOCATION_THEME } from "@/const/location.const";
import { Search, MapPin, Phone, Clock, Coffee } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllFranchise,
  useGetFranchiseDetail,
} from "@/hooks/client/useProduct.hook";

const LocationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: franchises = [], isLoading } = useGetAllFranchise();
  const { data: selectedStore, isLoading: isLoadingDetail } =
    useGetFranchiseDetail(selectedId ?? "");

  const filteredStores = franchises.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: LOCATION_THEME.bgKem }}
    >
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm z-10 border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-5">
          <div className="flex items-center gap-2.5 shrink-0">
            <Coffee size={20} className="text-[#6D4C41]" />
            <h2 className="text-lg font-black uppercase text-[#6D4C41] tracking-wider">
              Store Locator
            </h2>
          </div>
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchTerm}
              placeholder="Tìm theo tên hoặc mã cửa hàng..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#6D4C41] outline-none transition-all text-sm bg-stone-50"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              size={15}
            />
          </div>
          <span className="text-xs text-stone-400 shrink-0">
            {filteredStores.length} cửa hàng
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <div className="w-85 bg-white border-r overflow-y-auto shrink-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3.5 px-1 py-2 border-b border-stone-100"
                >
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-stone-400">
              <MapPin size={22} className="opacity-40" />
              <p className="text-sm">Không tìm thấy cửa hàng</p>
            </div>
          ) : (
            filteredStores.map((store) => {
              const isActive = selectedId === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setSelectedId(store.id)}
                  className={`flex items-center gap-3.5 px-5 py-4 border-b border-l-[3px] cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "bg-amber-50 border-l-[#6D4C41]"
                      : "hover:bg-stone-50 border-l-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? "bg-[#6D4C41]" : "bg-stone-100"
                    }`}
                  >
                    <MapPin
                      size={14}
                      className={isActive ? "text-white" : "text-stone-400"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isActive ? "text-[#6D4C41]" : "text-stone-700"
                      }`}
                    >
                      {store.name}
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {store.code}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Map + Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoadingDetail ? (
            <div className="flex-1 bg-stone-50 p-6 space-y-4">
              <div className="bg-white border rounded-xl px-6 py-4 flex items-center gap-5">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-60" />
                  <Skeleton className="h-4 w-80" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <Skeleton className="h-[calc(100vh-250px)] w-full rounded-xl" />
            </div>
          ) : selectedStore ? (
            <>
              {/* Store Info Banner */}
              <div className="bg-white border-b px-6 py-4 flex items-center gap-5 shrink-0 shadow-sm">
                {selectedStore.logoUrl ? (
                  <img
                    src={selectedStore.logoUrl}
                    alt={selectedStore.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    <Coffee size={20} className="text-stone-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#6D4C41] text-base truncate">
                    {selectedStore.name}
                  </h3>
                  {selectedStore.address && (
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={10} className="shrink-0" />
                      {selectedStore.address}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-5 text-xs text-stone-500 shrink-0">
                  {selectedStore.hotline && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                        <Phone size={11} className="text-[#8B181B]" />
                      </div>
                      <span className="font-medium">
                        {selectedStore.hotline}
                      </span>
                    </div>
                  )}
                  {selectedStore.openedAt && selectedStore.closedAt && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                        <Clock size={11} className="text-green-600" />
                      </div>
                      <span>
                        {selectedStore.openedAt} – {selectedStore.closedAt}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Google Maps Embed */}
              {selectedStore.googleMapScript ? (
                <iframe
                  key={selectedStore.id}
                  src={selectedStore.googleMapScript}
                  className="flex-1 w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-stone-400 bg-stone-50">
                  <MapPin size={32} className="opacity-25" />
                  <p className="text-sm">
                    Chưa có dữ liệu bản đồ cho cửa hàng này.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-stone-400 bg-stone-50">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center">
                <MapPin size={28} className="opacity-30" />
              </div>
              <p className="text-sm font-medium text-stone-500">
                Chọn một cửa hàng để xem bản đồ
              </p>
              <p className="text-xs text-stone-300">
                Danh sách cửa hàng ở bên trái
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
