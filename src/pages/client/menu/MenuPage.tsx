import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coffee,
  MapPin,
  ChevronDown,
  Loader2,
  UtensilsCrossed,
  Cookie,
  Star,
  Eye,
} from "lucide-react";
import {
  useGetAllFranchise,
  useGetCategoriesByFranchise,
  useGetMenuByFranchiseAndCategory,
  useGetProductsByFranchiseAndCategory,
} from "@/hooks/client/useProduct.hook";
import type { MenuProduct } from "@/types/menu.type";
import type { ProductListItem } from "@/types/product.type";

// ─── Helpers ────────────────────────────────────────────────────────────────────
const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫";

const getMinPrice = (
  sizes: { price: number; is_available: boolean }[],
): number | null => {
  const available = sizes.filter((s) => s.is_available);
  if (available.length === 0) return null;
  return Math.min(...available.map((s) => s.price));
};

const getSizeLabel = (size: string) => {
  const map: Record<string, string> = {
    DEFAULT: "Mặc định",
    SMALL: "Nhỏ",
    MEDIUM: "Vừa",
    LARGE: "Lớn",
  };
  return map[size] || size;
};

// ─── Skeleton loaders ───────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-white shadow-md overflow-hidden">
    <div className="h-52 bg-stone-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-stone-200 rounded w-3/4" />
      <div className="h-4 bg-stone-100 rounded w-full" />
      <div className="h-4 bg-stone-100 rounded w-1/2" />
      <div className="flex gap-2 pt-2">
        <div className="h-7 w-16 bg-stone-200 rounded-full" />
        <div className="h-7 w-16 bg-stone-200 rounded-full" />
      </div>
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="flex gap-3 overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse h-10 w-24 bg-stone-200 rounded-full shrink-0"
      />
    ))}
  </div>
);

// ─── Menu Product Card ──────────────────────────────────────────────────────────
const MenuProductCard = ({
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
          src={product.image_url || "/placeholder-coffee.jpg"}
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
        {product.is_have_topping && (
          <span
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 
                        bg-amber-600/90 text-white text-xs font-medium rounded-full
                        shadow-lg backdrop-blur-sm"
          >
            <Cookie className="h-3 w-3" />
            Có topping
          </span>
        )}

        {/* View detail button */}
        <button
          type="button"
          onClick={() => onViewDetail(product.product_id)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 
                     bg-white/90 text-stone-800 text-xs font-semibold rounded-full
                     shadow-lg backdrop-blur-sm
                     opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-300 ease-out
                     hover:bg-white hover:shadow-xl"
        >
          <Eye className="h-3.5 w-3.5" />
          Chi tiết
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

        {/* Sizes */}
        <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
          {product.sizes.map((s) => (
            <span
              key={s.size}
              className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full font-medium
                          transition-colors duration-200 
                          ${
                            s.is_available
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : "bg-stone-100 text-stone-400 line-through border border-stone-200/40"
                          }`}
            >
              {getSizeLabel(s.size)}: {formatPrice(s.price)}
            </span>
          ))}
        </div>

        {/* Price */}
        {minPrice !== null && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-stone-400 italic">Từ</span>
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

// ─── Topping Card ────────────────────────────────────────────────────────────────
const ToppingCard = ({
  product,
  onViewDetail,
}: {
  product: ProductListItem;
  onViewDetail: (productId: string | number) => void;
}) => {
  const minPrice = getMinPrice(product.sizes);

  return (
    <div
      className="group relative flex items-center gap-4 rounded-2xl bg-white p-4
                 border border-stone-200/60 shadow-sm
                 transition-all duration-500 ease-out
                 hover:shadow-[0_6px_24px_rgba(120,80,40,0.10)]
                 hover:-translate-y-0.5 hover:border-amber-200/80"
    >
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        <img
          src={product.image_url || "/placeholder-coffee.jpg"}
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
        <div className="mt-1.5 flex flex-wrap gap-1">
          {product.sizes
            .filter((s) => s.is_available)
            .map((s) => (
              <span
                key={s.size}
                className="text-[11px] px-2 py-0.5 bg-orange-50 text-orange-700 
                           rounded-full border border-orange-200/60 font-medium"
              >
                {getSizeLabel(s.size)}: {formatPrice(s.price)}
              </span>
            ))}
        </div>
      </div>

      {/* Price + action */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {minPrice !== null && (
          <span className="font-serif text-lg font-bold text-amber-700">
            {formatPrice(minPrice)}
          </span>
        )}
        <button
          type="button"
          onClick={() => onViewDetail(product.product_id)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium
                     text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600
                     rounded-full border border-amber-200 hover:border-amber-600
                     transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Eye className="h-3 w-3" />
          Xem
        </button>
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

// ─── Section Divider ─────────────────────────────────────────────────────────────
const SectionDivider = ({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 shadow-inner">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="font-serif text-2xl font-bold text-stone-800">{title}</h2>
      <p className="text-sm text-stone-400">{count} sản phẩm</p>
    </div>
    <div className="flex-1 h-px bg-linear-to-r from-stone-200 to-transparent ml-4" />
  </div>
);

// ─── Empty State ────────────────────────────────────────────────────────────────
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-stone-400">
    <Coffee className="h-16 w-16 mb-4 opacity-30" />
    <p className="font-serif text-lg italic">{message}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Menu Page ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const MenuPage = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isFranchiseDropdownOpen, setIsFranchiseDropdownOpen] = useState(false);

  // ── Queries ────────────────────────────────────────────────────────────
  const { data: franchises, isLoading: isLoadingFranchises } =
    useGetAllFranchise();

  // Resolve the actual franchise ID (user-selected or first from API)
  const activeFranchiseId = useMemo(() => {
    if (selectedFranchiseId) return selectedFranchiseId;
    if (franchises && franchises.length > 0) return franchises[0].id;
    return "";
  }, [selectedFranchiseId, franchises]);

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesByFranchise(activeFranchiseId);

  // Resolve the actual category ID (user-selected or first from list)
  const activeCategoryId = useMemo(() => {
    if (selectedCategoryId) return selectedCategoryId;
    if (categories && categories.length > 0)
      return String(categories[0].category_id);
    return "";
  }, [selectedCategoryId, categories]);

  const { data: menuData, isLoading: isLoadingMenu } =
    useGetMenuByFranchiseAndCategory(activeFranchiseId, activeCategoryId);

  const { data: toppingData, isLoading: isLoadingToppings } =
    useGetProductsByFranchiseAndCategory(activeFranchiseId, activeCategoryId);

  // ── Derived state ──────────────────────────────────────────────────────
  const selectedFranchise = useMemo(
    () => franchises?.find((f) => f.id === activeFranchiseId),
    [franchises, activeFranchiseId],
  );

  const selectedCategory = useMemo(
    () => categories?.find((c) => String(c.category_id) === activeCategoryId),
    [categories, activeCategoryId],
  );

  // Menu products from menuData
  const menuProducts: MenuProduct[] = useMemo(() => {
    if (!menuData) return [];
    return menuData.flatMap((mc) => mc.products);
  }, [menuData]);

  // Toppings from toppingData
  const toppings: ProductListItem[] = useMemo(() => {
    return toppingData ?? [];
  }, [toppingData]);

  const isLoadingProducts = isLoadingMenu || isLoadingToppings;

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleFranchiseChange = (id: string) => {
    setSelectedFranchiseId(id);
    setSelectedCategoryId(null);
    setIsFranchiseDropdownOpen(false);
  };

  const handleViewDetail = (productId: string | number) => {
    navigate(`/client/products/product-${productId}`);
  };

  // ── Close dropdown on outside click ────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = () => setIsFranchiseDropdownOpen(false);
    if (isFranchiseDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isFranchiseDropdownOpen]);

  // ═══════════════════════════════════════════════════════════════════════
  // ─── Render ────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-linear-to-br from-stone-900 via-stone-800 to-amber-900 
                    pt-28 pb-16"
      >
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Ornamental line */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-amber-400/60" />
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-amber-400/60" />
          </div>

          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white 
                        tracking-wide drop-shadow-lg"
          >
            Thực Đơn
          </h1>
          <p className="mt-3 text-amber-200/80 text-base md:text-lg font-light tracking-wider">
            Khám phá hương vị cà phê đặc biệt tại mỗi chi nhánh
          </p>

          {/* Franchise selector */}
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFranchiseDropdownOpen((prev) => !prev);
                }}
                disabled={isLoadingFranchises}
                className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md 
                           border border-white/20 rounded-full text-white
                           hover:bg-white/20 hover:border-white/40
                           transition-all duration-300 shadow-lg hover:shadow-xl
                           min-w-70 justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span className="font-medium text-sm">
                    {isLoadingFranchises
                      ? "Đang tải..."
                      : selectedFranchise?.name || "Chọn chi nhánh"}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-amber-300 transition-transform duration-300 
                              ${isFranchiseDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {isFranchiseDropdownOpen && franchises && (
                <div
                  className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl 
                              shadow-2xl border border-stone-200 overflow-hidden z-50
                              animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {franchises.map((franchise) => (
                    <button
                      type="button"
                      key={franchise.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFranchiseChange(franchise.id);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm
                                  transition-colors duration-200
                                  ${
                                    franchise.id === activeFranchiseId
                                      ? "bg-amber-50 text-amber-800 font-semibold"
                                      : "text-stone-700 hover:bg-stone-50"
                                  }`}
                    >
                      <MapPin
                        className={`h-4 w-4 shrink-0 ${
                          franchise.id === activeFranchiseId
                            ? "text-amber-600"
                            : "text-stone-400"
                        }`}
                      />
                      <span className="truncate">{franchise.name}</span>
                      {franchise.id === activeFranchiseId && (
                        <span className="ml-auto text-amber-500 text-xs">
                          ●
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60L1440 60L1440 0C1440 0 1080 50 720 50C360 50 0 0 0 0L0 60Z"
              fill="#FAF7F2"
            />
          </svg>
        </div>
      </section>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pb-20 -mt-2">
        {/* ── Category tabs ──────────────────────────────────────────── */}
        <div className="mb-10">
          {isLoadingCategories ? (
            <CategorySkeleton />
          ) : categories && categories.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => {
                const isActive = String(cat.category_id) === activeCategoryId;
                return (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() =>
                      setSelectedCategoryId(String(cat.category_id))
                    }
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium
                               transition-all duration-300 ease-out
                               ${
                                 isActive
                                   ? "bg-amber-700 text-white shadow-lg shadow-amber-700/25 scale-105"
                                   : "bg-white text-stone-600 border border-stone-200 shadow-sm hover:border-amber-300 hover:text-amber-700 hover:shadow-md hover:scale-[1.02]"
                               }`}
                  >
                    {cat.categoryName}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            !isLoadingFranchises && (
              <p className="text-center text-stone-400 italic font-serif">
                Không có danh mục nào cho chi nhánh này
              </p>
            )
          )}
        </div>

        {/* ── Current selection info ─────────────────────────────────── */}
        {selectedCategory && (
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600/70 font-medium mb-1">
              {selectedFranchise?.name}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 mb-2">
              {selectedCategory.category_name}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-amber-400/40" />
              <Coffee className="h-4 w-4 text-amber-500" />
              <div className="h-px w-12 bg-amber-400/40" />
            </div>
          </div>
        )}

        {/* ── Products area ──────────────────────────────────────────── */}
        {isLoadingProducts ? (
          <div>
            {/* Menu skeletons */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-stone-200 rounded-full animate-pulse" />
                <div className="h-7 w-40 bg-stone-200 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </div>
            {/* Topping skeletons */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-stone-200 rounded-full animate-pulse" />
                <div className="h-7 w-40 bg-stone-200 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse h-24 bg-white rounded-2xl shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Menu Section ───────────────────────────────────────── */}
            {menuProducts.length > 0 ? (
              <section className="mb-14">
                <SectionDivider
                  icon={UtensilsCrossed}
                  title="Menu"
                  count={menuProducts.length}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {menuProducts.map((product) => (
                    <MenuProductCard
                      key={product.product_id}
                      product={product}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>
              </section>
            ) : (
              activeCategoryId && (
                <section className="mb-14">
                  <SectionDivider
                    icon={UtensilsCrossed}
                    title="Menu"
                    count={0}
                  />
                  <EmptyState message="Chưa có sản phẩm trong menu" />
                </section>
              )
            )}

            {/* ── Topping Section ────────────────────────────────────── */}
            {toppings.length > 0 ? (
              <section>
                <SectionDivider
                  icon={Cookie}
                  title="Topping"
                  count={toppings.length}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toppings.map((product) => (
                    <ToppingCard
                      key={product.product_id}
                      product={product}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>
              </section>
            ) : (
              activeCategoryId && (
                <section>
                  <SectionDivider icon={Cookie} title="Topping" count={0} />
                  <EmptyState message="Chưa có topping" />
                </section>
              )
            )}

            {/* No category selected */}
            {!activeCategoryId && !isLoadingCategories && (
              <EmptyState message="Vui lòng chọn danh mục để xem thực đơn" />
            )}
          </>
        )}
      </div>

      {/* ── Loading overlay for franchise change ──────────────────────── */}
      {isLoadingFranchises && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-2xl">
            <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
            <p className="font-serif text-stone-600">Đang tải thực đơn...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
