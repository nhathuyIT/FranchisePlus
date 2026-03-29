import type { KeyboardEvent } from "react";
import type { MenuProduct } from "@/types/menu.type";
import { formatPrice, getMinPrice } from "../lib/helpers";
import { Cookie } from "lucide-react";

export const MenuProductCard = ({
  product,
  onViewDetail,
}: {
  product: MenuProduct;
  onViewDetail: () => void;
}) => {
  const minPrice = getMinPrice(product.sizes);
  const canViewDetail = product.sizes.some((size) => size.isAvailable);
  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canViewDetail) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onViewDetail();
    }
  };

  return (
    <div
      role={canViewDetail ? "button" : undefined}
      tabIndex={canViewDetail ? 0 : -1}
      onClick={canViewDetail ? onViewDetail : undefined}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${product.name}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white 
                 border border-stone-200/60 shadow-sm text-left
                 transition-all duration-500 ease-out
                 hover:shadow-[0_8px_30px_rgba(120,80,40,0.12)]
                 hover:-translate-y-1 hover:border-amber-200/80
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 ${
                   canViewDetail ? "cursor-pointer" : "cursor-default"
                 }`}
    >
      {/* Image */}
      <div
        className="relative h-52 w-full overflow-hidden bg-stone-100 text-left"
      >
        <img
          src={product.imageUrl || "/placeholder-coffee.jpg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out
                     group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Has topping badge */}
        {product.isHaveTopping && (
          <span
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 
                        bg-amber-600/90 text-white text-xs font-medium rounded-full
                        shadow-lg backdrop-blur-sm"
          >
            <Cookie className="h-3 w-3" />
            Has Topping
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="font-serif text-lg font-bold text-stone-800 leading-snug 
                      group-hover:text-amber-800 transition-colors duration-300
                      line-clamp-2"
        >
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 text-sm text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {minPrice !== null && (
          <div className="mt-auto pt-4">
            <span className="flex items-center justify-center rounded-xl border border-gray-50-200/70 bg--50/80 px-4 py-3 font-serif text-2xl font-bold text-amber-700 transition-colors group-hover:text-amber-600">
              {formatPrice(minPrice)}
            </span>
          </div>
        )}
      </div>

      {/* Decorative bottom border on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-400 via-amber-600 to-amber-400
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
      />
    </div>
  );
};
