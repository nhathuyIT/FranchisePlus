import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllFranchise,
  useGetProductsByFranchise,
} from "@/hooks/client/useProduct.hook";
import { useCart } from "../../cart/useCart";

const DEFAULT_FRANCHISE_NAME = "Goat Coffee";
const TOPPING_CATEGORY_NAME = "topping";
const SHOWCASE_LIMIT = 6;

type ShowcaseProduct = {
  productId: string | number;
  name: string;
  description: string;
  imageUrl: string;
  categoryName: string;
  minPrice: number;
  maxPrice: number;
  defaultProductFranchiseId: string;
};

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-sm border border-[#E8DFD6] bg-white shadow-lg">
    <div className="h-80 animate-pulse bg-stone-200" />
    <div className="space-y-4 p-8">
      <div className="h-3 w-28 animate-pulse rounded bg-stone-200" />
      <div className="h-8 w-3/4 animate-pulse rounded bg-stone-200" />
      <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100" />
      <div className="h-16 animate-pulse rounded border border-[#E8DFD6] bg-stone-100" />
      <div className="h-12 animate-pulse rounded border border-[#E8DFD6] bg-stone-100" />
    </div>
  </div>
);

const findPreferredFranchise = (
  franchises: Array<{ id: string; name: string }>,
) =>
  franchises.find(
    (franchise) =>
      franchise.name.trim().toLowerCase() ===
      DEFAULT_FRANCHISE_NAME.toLowerCase(),
  ) ??
  franchises.find((franchise) =>
    franchise.name
      .trim()
      .toLowerCase()
      .includes(DEFAULT_FRANCHISE_NAME.toLowerCase()),
  ) ??
  null;

export const CoffeeShowcase = () => {
  const { addItem } = useCart();
  const [selectedFranchiseId, setSelectedFranchiseId] = useState("");

  const { data: franchises = [], isLoading: isLoadingFranchises } =
    useGetAllFranchise();

  const preferredFranchise = findPreferredFranchise(franchises);
  const activeFranchiseId =
    selectedFranchiseId || preferredFranchise?.id || franchises[0]?.id || "";
  const activeFranchiseName =
    franchises.find((franchise) => franchise.id === activeFranchiseId)?.name ||
    preferredFranchise?.name ||
    DEFAULT_FRANCHISE_NAME;

  const {
    data: showcaseProducts = [],
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useGetProductsByFranchise<ShowcaseProduct[]>(activeFranchiseId, {
    enabled: !!activeFranchiseId,
    staleTime: 60 * 1000,
    select: (products) =>
      products
        .flatMap((product) => {
          const availableSizes = product.sizes.filter((size) => size.isAvailable);
          const isTopping =
            product.categoryName.trim().toLowerCase() === TOPPING_CATEGORY_NAME;

          if (!availableSizes.length || isTopping) {
            return [];
          }

          const prices = availableSizes.map((size) => size.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          return [
            {
              productId: product.productId,
              name: product.name,
              description: product.description,
              imageUrl: product.imageUrl,
              categoryName: product.categoryName,
              minPrice,
              maxPrice,
              defaultProductFranchiseId: String(
                availableSizes[0].productFranchiseId,
              ),
            },
          ];
        })
        .slice(0, SHOWCASE_LIMIT),
  });

  const isLoadingShowcase =
    isLoadingFranchises || isLoadingProducts || isFetchingProducts;

  const handleAddToCart = async (
    event: MouseEvent<HTMLButtonElement>,
    product: ShowcaseProduct,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!activeFranchiseId || !product.defaultProductFranchiseId) return;

    await addItem(
      product.defaultProductFranchiseId,
      product.name,
      product.minPrice,
      1,
      product.imageUrl || undefined,
      { franchiseId: activeFranchiseId },
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#F8F5F0] py-24 lg:py-32">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='none' stroke='%233E2723' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="absolute left-8 top-8 h-24 w-24 border-l-2 border-t-2 border-[#C4A77D]/30" />
      <div className="absolute right-8 top-8 h-24 w-24 border-r-2 border-t-2 border-[#C4A77D]/30" />
      <div className="absolute bottom-8 left-8 h-24 w-24 border-b-2 border-l-2 border-[#C4A77D]/30" />
      <div className="absolute bottom-8 right-8 h-24 w-24 border-b-2 border-r-2 border-[#C4A77D]/30" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-20 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#C4A77D]" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, index) => (
                <Star
                  key={index}
                  className="h-3 w-3 fill-[#C4A77D] text-[#C4A77D]"
                />
              ))}
            </div>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#C4A77D]" />
          </div>

          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.4em] text-[#8B7355]">
            Artisan Collection
          </span>

          <h2 className="mb-6 font-serif text-4xl font-bold text-[#3E2723] sm:text-5xl lg:text-6xl">
            Our Signature
            <span className="mt-2 block italic text-[#6D4C41]">Blends</span>
          </h2>

          <p className="mx-auto max-w-xl text-lg leading-relaxed font-light text-[#6D4C41]/80">
            Discover a curated selection of our finest coffees, each crafted
            with passion and perfected over generations
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#C4A77D]/50" />
            <div className="h-2 w-2 rotate-45 border border-[#C4A77D]/50" />
            <div className="h-px w-12 bg-[#C4A77D]/50" />
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-[1.75rem] border border-[#E8DFD6] bg-white/80 p-4 shadow-[0_16px_40px_rgba(62,39,35,0.08)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8B7355]">
                  Franchise
                </p>
                <p className="mt-1 text-sm text-[#6D4C41]/75">
                  Showing signature picks from {activeFranchiseName}.
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF8F1] text-[#C4A77D]">
                <MapPin className="h-4 w-4" />
              </div>
            </div>

            <Select
              value={activeFranchiseId || undefined}
              onValueChange={setSelectedFranchiseId}
              disabled={isLoadingFranchises || franchises.length === 0}
            >
              <SelectTrigger className="h-12 w-full rounded-full border border-[#E8DFD6] bg-[#FAF8F5] px-4 text-left text-[#3E2723] shadow-none transition-all duration-300 hover:border-[#6D4C41] hover:bg-white hover:text-[#5D4037] focus:border-[#6D4C41] focus:ring-[#6D4C41]/15">
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#C4A77D]" />
                  <SelectValue
                    placeholder={
                      isLoadingFranchises
                        ? "Loading franchises..."
                        : "Select franchise"
                    }
                  />
                </div>
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="center"
                sideOffset={10}
                avoidCollisions={false}
                className="z-[9999] max-h-64 w-[var(--radix-select-trigger-width)] rounded-[1.25rem] border-[#E8DFD6] bg-white shadow-[0_28px_80px_rgba(20,10,6,0.18)] [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-slot=select-scroll-up-button]]:hidden"
              >
                {franchises.map((franchise) => (
                  <SelectItem
                    key={franchise.id}
                    value={franchise.id}
                    className="py-3 text-sm text-[#5D4037]"
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-[#C4A77D]" />
                      <span className="truncate">{franchise.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingShowcase ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {[...Array(3)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : showcaseProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {showcaseProducts.map((product, index) => (
              <div key={`${activeFranchiseId}-${product.productId}`} className="group relative">
                <div className="relative overflow-hidden rounded-sm border border-[#E8DFD6] bg-white shadow-lg transition-all duration-500 hover:shadow-2xl">
                  <div className="absolute left-0 top-0 z-20 h-8 w-8 border-l-2 border-t-2 border-[#C4A77D] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute right-0 top-0 z-20 h-8 w-8 border-r-2 border-t-2 border-[#C4A77D] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 z-20 h-8 w-8 border-b-2 border-l-2 border-[#C4A77D] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 right-0 z-20 h-8 w-8 border-b-2 border-r-2 border-[#C4A77D] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={product.imageUrl || "/placeholder-coffee.jpg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1A1612]/80 via-[#1A1612]/20 to-transparent" />

                    <Button
                      onClick={(event) => handleAddToCart(event, product)}
                      size="sm"
                      className="absolute left-4 top-4 z-30 h-10 w-10 rounded-full border-2 border-white/30 bg-[#C4A77D] p-0 text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#A68B5B]"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>

                    <div className="absolute right-4 top-4 z-10">
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C4A77D] shadow-lg">
                          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-white/50">
                            <span className="text-[8px] uppercase tracking-wider text-white/80">
                              Est.
                            </span>
                            <span className="font-serif text-sm font-bold text-white">
                              1892
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="font-serif text-6xl font-bold text-white/10 transition-colors duration-500 group-hover:text-white/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div className="relative bg-white p-8">
                    <div className="absolute left-8 right-8 top-0 h-px bg-linear-to-r from-transparent via-[#C4A77D]/30 to-transparent" />

                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-px w-6 bg-[#C4A77D]" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B7355]">
                        {product.categoryName || "Signature Blend"}
                      </span>
                    </div>

                    <h3 className="mb-3 font-serif text-2xl font-bold text-[#3E2723] transition-colors duration-300 group-hover:text-[#6D4C41]">
                      {product.name}
                    </h3>

                    <p className="mb-4 min-h-15 text-sm leading-relaxed font-light text-[#6D4C41]/70">
                      {product.description ||
                        "Roasted in small batches to preserve the delicate flavors and aromatic complexity."}
                    </p>

                    <div className="mb-6 border-y border-[#E8DFD6] py-3">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="font-serif text-2xl font-bold text-[#C4A77D]">
                          {product.minPrice.toLocaleString("vi-VN")} VND
                        </span>
                        {product.minPrice !== product.maxPrice && (
                          <>
                            <span className="text-[#8B7355]">-</span>
                            <span className="font-serif text-2xl font-bold text-[#C4A77D]">
                              {product.maxPrice.toLocaleString("vi-VN")} VND
                            </span>
                          </>
                        )}
                      </div>
                      <p className="mt-1 text-center text-[10px] uppercase tracking-wider text-[#8B7355]">
                        Premium Quality
                      </p>
                    </div>

                    <div className="mb-6 flex items-center gap-4 border-y border-[#E8DFD6] py-4">
                      <div className="flex-1 text-center">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#8B7355]">
                          Body
                        </span>
                        <div className="flex justify-center gap-1">
                          {[...Array(5)].map((_, dotIndex) => (
                            <div
                              key={dotIndex}
                              className={`h-1.5 w-1.5 rounded-full ${
                                dotIndex < 4 ? "bg-[#C4A77D]" : "bg-[#E8DFD6]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-[#E8DFD6]" />
                      <div className="flex-1 text-center">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#8B7355]">
                          Acidity
                        </span>
                        <div className="flex justify-center gap-1">
                          {[...Array(5)].map((_, dotIndex) => (
                            <div
                              key={dotIndex}
                              className={`h-1.5 w-1.5 rounded-full ${
                                dotIndex < 3 ? "bg-[#C4A77D]" : "bg-[#E8DFD6]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-[#E8DFD6]" />
                      <div className="flex-1 text-center">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#8B7355]">
                          Aroma
                        </span>
                        <div className="flex justify-center gap-1">
                          {[...Array(5)].map((_, dotIndex) => (
                            <div
                              key={dotIndex}
                              className={`h-1.5 w-1.5 rounded-full ${
                                dotIndex < 5 ? "bg-[#C4A77D]" : "bg-[#E8DFD6]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <span className="font-serif text-xs italic text-[#8B7355]">
                        Crafted for {activeFranchiseName}
                      </span>
                      <Link
                        to={
                          activeFranchiseId
                            ? `/menu/product/${activeFranchiseId}/${product.productId}`
                            : "/menu"
                        }
                        className="w-full"
                      >
                        <Button
                          variant="ghost"
                          className="group/btn relative h-12 w-full overflow-hidden rounded-sm border-2 border-[#C4A77D] bg-transparent font-serif text-sm font-semibold uppercase tracking-[0.15em] text-[#3E2723] transition-all duration-500 hover:border-[#3E2723] hover:bg-[#3E2723] hover:text-white"
                        >
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#C4A77D] transition-colors duration-500 group-hover/btn:text-white/60">
                            *
                          </span>
                          Discover
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-1.5" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C4A77D] transition-colors duration-500 group-hover/btn:text-white/60">
                            *
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#E8DFD6] bg-white/80 px-6 py-12 text-center shadow-[0_20px_60px_rgba(62,39,35,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8B7355]">
              Signature Picks
            </p>
            <h3 className="mt-3 font-serif text-3xl font-bold text-[#3E2723]">
              No products available
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#6D4C41]/75">
              This franchise does not have enough active menu items to showcase
              right now. Try another franchise from the selector above.
            </p>
          </div>
        )}

        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="mb-6 text-sm font-light italic text-[#6D4C41]/60">
              "Every cup tells a story of tradition and excellence"
            </p>
            <Link to="/menu">
              <Button className="group bg-[#3E2723] px-10 py-6 font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#5D4037] hover:shadow-xl">
                <span className="text-sm uppercase tracking-wider">
                  View Full Collection
                </span>
                <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-8 bg-[#C4A77D]/50" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355]">
                Since 1892
              </span>
              <div className="h-px w-8 bg-[#C4A77D]/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
