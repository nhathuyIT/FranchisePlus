import type { MenuProduct } from "@/types/menu.type";
import { formatPrice, getMinPrice, getSizeLabel } from "../lib/helpers";
import { Cookie, Eye } from "lucide-react";

export const MenuProductCard = ({
  product,
  onViewDetail,
}: {
  product: MenuProduct;
  onViewDetail: (productId: string | number) => void;
}) => {
  const minPrice = getMinPrice(product.sizes);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white 
                 border border-stone-200/60 shadow-sm
                 transition-all duration-500 ease-out
                 hover:shadow-[0_8px_30px_rgba(120,80,40,0.12)]
                 hover:-translate-y-1 hover:border-amber-200/80"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100 h-52">
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

        {/* View detail button */}
        <button
          type="button"
          onClick={() => onViewDetail(product.productId)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 
                     bg-white/90 text-stone-800 text-xs font-semibold rounded-full
                     shadow-lg backdrop-blur-sm
                     opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-300 ease-out
                     hover:bg-white hover:shadow-xl"
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </button>
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

        {/* Sizes & Prices */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          {product.sizes.map((s) => (
            <div
              key={s.size}
              className={`group/row flex items-center justify-between px-4 py-2.5 rounded-xl 
                          border transition-all duration-300 cursor-default
                          ${
                            s.isAvailable
                              ? "bg-amber-50/80 border-amber-200/70 hover:bg-red-500 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.03]"
                              : "bg-stone-50 border-stone-200/40 opacity-50"
                          }`}
            >
              <span
                className={`text-sm font-semibold transition-colors duration-300
                            ${
                              s.isAvailable
                                ? "text-stone-700 group-hover/row:text-white"
                                : "text-stone-400 line-through"
                            }`}
              >
                {getSizeLabel(s.size)}
              </span>
              <span
                className={`font-serif text-lg font-bold transition-colors duration-300 flex justify-center w-full
                            ${
                              s.isAvailable
                                ? "text-amber-700 group-hover/row:text-white"
                                : "text-stone-400 line-through"
                            }`}
              >
                {formatPrice(s.price)}
              </span>
            </div>
          ))}
        </div>

        {/* Price */}
        {minPrice !== null && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-stone-400 italic">From</span>
            <span
              className="font-serif text-xl font-bold text-amber-700 
                          group-hover:text-amber-600 transition-colors"
            >
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
