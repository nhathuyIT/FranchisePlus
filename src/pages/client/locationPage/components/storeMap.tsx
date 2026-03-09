import { useMemo } from 'react';
import type { Franchise } from "@/types/franchise";
import { MapPin } from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Extract the src URL from a Google Maps embed iframe tag or return as-is if already a URL. */
const extractEmbedSrc = (script: string): string | null => {
  const srcMatch = script.match(/src=["']([^"']+)["']/);
  if (srcMatch) return srcMatch[1];
  // If it's already a URL (not an iframe tag), return directly
  if (script.startsWith('https://')) return script;
  return null;
};

/** Get the embed URL from a franchise, checking both snake_case and camelCase field names. */
const getEmbedUrl = (store: Franchise): string | null => {
  const raw = store as unknown as Record<string, unknown>;
  const script = store.google_map_script
    ?? (raw['googleMapScript'] as string | undefined);
  if (!script) return null;
  return extractEmbedSrc(script);
};

// Default HCM city center embed
const DEFAULT_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125415.38783965728!2d106.6296295!3d10.823098800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3583%3A0xf3e0b20bce20a6e6!2zSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s';

// ── Component ───────────────────────────────────────────────────────────────

interface StoreMapProps {
  stores: Franchise[];
  selectedStore: Franchise | null;
  onSelectStore?: (store: Franchise) => void;
}

export const StoreMap = ({ selectedStore }: StoreMapProps) => {
  const embedSrc = useMemo(() => {
    if (!selectedStore) return DEFAULT_EMBED_SRC;
    return getEmbedUrl(selectedStore) ?? DEFAULT_EMBED_SRC;
  }, [selectedStore]);

  return (
    <div className="h-full w-full relative">
      {!selectedStore && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-lg">
            <MapPin size={32} className="mx-auto mb-2 text-[#8B181B]" />
            <p className="text-sm font-semibold text-[#6D4C41]">Select a store from the list</p>
            <p className="text-xs text-gray-400 mt-1">to see its location on Google Maps</p>
          </div>
        </div>
      )}
      <iframe
        key={embedSrc}
        src={embedSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={selectedStore ? `Map: ${selectedStore.name}` : 'Google Maps'}
      />
    </div>
  );
};