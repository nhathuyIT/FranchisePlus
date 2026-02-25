import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { LOCATION_THEME } from "@/const/location.const";
// Sử dụng đúng alias StoreLocationData (tương đương Franchise)
import type { StoreLocationData } from "@/const/location.const"; 

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface StoreMapProps {
  stores: StoreLocationData[];
  selectedStore: StoreLocationData | null;
}

// Fix lỗi: Ép kiểu center về [number, number] để Leaflet chấp nhận
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

export const StoreMap = ({ stores, selectedStore }: StoreMapProps) => {
  const defaultCenter: [number, number] = [10.7769, 106.7009];

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='© Google Maps'
        />
        
        {stores.map((store) => (
          // FIX: Chỉ render Marker nếu lat và lng tồn tại (không bị undefined)
          store.lat !== undefined && store.lng !== undefined && (
            <Marker 
              key={store.id} 
              position={[store.lat, store.lng]} 
              icon={customIcon}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <h4 className="font-bold text-[#6D4C41] uppercase mb-1">{store.name}</h4>
                  <p className="text-[11px] opacity-70 mb-3">{store.address}</p>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`, '_blank')}
                    className="w-full py-2 bg-[#8B181B] text-white text-[10px] font-bold rounded-lg hover:bg-black transition-colors uppercase"
                  >
                    Open in Google Maps
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* FIX: Chỉ ChangeView khi selectedStore có đủ tọa độ */}
        {selectedStore && selectedStore.lat !== undefined && selectedStore.lng !== undefined && (
          <ChangeView center={[selectedStore.lat, selectedStore.lng]} />
        )}
      </MapContainer>
    </div>
  );
};