import { Cookie, Plus } from "lucide-react";
import type { MenuProduct, ProductSize } from "@/types/menu.type";
import { Badge } from "@/components/ui/badge";
import { formatCartMoney } from "../utils/cartDisplay";
import { CartProductImage } from "./CartProductImage";

interface PosProductGridProps {
  products: MenuProduct[];
  isLoading?: boolean;
  onAddProduct: (product: MenuProduct, size: ProductSize) => void;
}

const getSizeLabel = (size?: string | null) => {
  const normalizedSize = size?.trim();

  if (!normalizedSize) {
    return "Default";
  }

  switch (normalizedSize.toUpperCase()) {
    case "DEFAULT":
      return "Default";
    case "SMALL":
      return "Small";
    case "MEDIUM":
      return "Medium";
    case "LARGE":
      return "Large";
    default:
      return normalizedSize;
  }
};

export const PosProductGrid = ({
  products,
  isLoading = false,
  onAddProduct,
}: PosProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-[#E8DFD6] bg-white p-4"
          >
            <div className="mb-4 h-32 rounded-xl bg-[#F3ECE6]" />
            <div className="mb-2 h-5 rounded bg-[#F3ECE6]" />
            <div className="mb-4 h-4 w-2/3 rounded bg-[#F7F1EB]" />
            <div className="space-y-2">
              <div className="h-10 rounded-xl bg-[#F7F1EB]" />
              <div className="h-10 rounded-xl bg-[#F7F1EB]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-8 text-sm text-[#8D6E63]">
        No products are available in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => {
        const availableSizes = product.sizes.filter((size) => size.isAvailable);

        return (
          <div
            key={String(product.productId)}
            className="rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-sm"
          >
            <div className="relative">
              <CartProductImage
                src={product.imageUrl}
                alt={product.name}
                className="h-32 w-full rounded-2xl"
              />
              {product.isHaveTopping ? (
                <Badge className="absolute left-3 top-3 border-0 bg-[#FFF3E0] text-[#A65A00]">
                  <Cookie className="mr-1 h-3 w-3" />
                  Has topping
                </Badge>
              ) : null}
            </div>

            <div className="mt-4 min-h-[48px]">
              <p className="line-clamp-2 font-semibold text-[#3E2723]">
                {product.name}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {availableSizes.map((size) => (
                <button
                  key={String(size.productFranchiseId)}
                  type="button"
                  onClick={() => onAddProduct(product, size)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E8DFD6] bg-[#FAF8F5] px-3 py-2 text-left transition-colors hover:border-[#C8B7A7] hover:bg-[#FFF8F1]"
                >
                  <div>
                    <p className="text-sm font-medium text-[#3E2723]">
                      {getSizeLabel(size.size)}
                    </p>
                    <p className="text-xs text-[#8D6E63]">
                      {formatCartMoney(size.price)}
                    </p>
                  </div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6D4C41] text-white">
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
