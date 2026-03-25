import type { KeyboardEvent } from "react";
import type { ProductListItem } from "@/types/product.type";
import { formatPrice, getMinPrice, getSizeLabel } from "../lib/helpers";

export const ToppingCard = ({
  product,
  onViewDetail,
}: {
  product: ProductListItem;
  onViewDetail: () => void;
}) => {
  const fallbackSize =
    product.sizes.find((s) => s.isAvailable) ?? product.sizes[0];
  const minPrice =
    product.sizes.length > 0
      ? Math.min(...product.sizes.map((size) => size.price))
      : getMinPrice(product.sizes);
  const canViewDetail = fallbackSize?.productFranchiseId != null;
  const visibleSizes = product.sizes.filter(
    (size) => getSizeLabel(size.size) !== "Default",
  );
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
      className={`group relative flex items-center gap-4 rounded-2xl bg-white p-4
                 w-full text-left
                 border border-stone-200/60 shadow-sm
                 transition-all duration-500 ease-out
                 hover:shadow-[0_6px_24px_rgba(120,80,40,0.10)]
                 hover:-translate-y-0.5 hover:border-amber-200/80 ${
                   canViewDetail ? "cursor-pointer" : "cursor-default opacity-80"
                 }`}
    >
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        <img
          src={product.imageUrl || "/placeholder-coffee.jpg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className="font-serif text-base font-semibold text-stone-800 truncate
                      group-hover:text-amber-800 transition-colors duration-300"
        >
          {product.name}
        </h4>
        {product.description && (
          <p className="text-xs text-stone-500 truncate mt-0.5">
            {product.description}
          </p>
        )}
        {visibleSizes.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {visibleSizes.map((s) => (
              <span
                key={String(s.productFranchiseId)}
                className="text-[11px] px-2 py-0.5 bg-orange-50 text-orange-700 
                           rounded-full border border-orange-200/60 font-medium"
              >
                {getSizeLabel(s.size)}: {formatPrice(s.price)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        {minPrice !== null && (
          <span className="font-serif text-lg font-bold text-amber-700">
            {formatPrice(minPrice)}
          </span>
        )}
      </div>

      {/* Decorative left border */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 bg-amber-400 
                    scale-y-0 group-hover:scale-y-100 rounded-full
                    transition-transform duration-500 origin-top"
      />
    </div>
  );
};
