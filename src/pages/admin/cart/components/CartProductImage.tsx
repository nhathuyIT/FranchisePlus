import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CartProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export const CartProductImage = ({
  src,
  alt,
  className,
}: CartProductImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const shouldShowFallback = !src || failedSrc === src;

  if (shouldShowFallback) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-[#E8DFD6] bg-[#FAF8F5] text-[#8D6E63]",
          className,
        )}
      >
        <ImageOff className="h-4 w-4" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={cn(
        "rounded-xl border border-[#E8DFD6] object-cover",
        className,
      )}
    />
  );
};
