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
} from "lucide-react";
import {
  useGetAllFranchise,
  useGetCategoriesByFranchise,
  useGetMenuByFranchise,
  useGetMenuByFranchiseAndCategory,
  useGetProductsByFranchiseAndCategory,
} from "@/hooks/client/useProduct.hook";
import type { MenuProduct } from "@/types/menu.type";
import type { ProductListItem } from "@/types/product.type";
import { MenuProductCard } from "./components/MenuProductCard";
import { ToppingCard } from "./components/ToppingCard.";
import { SectionDivider } from "./components/SectionDivider";
import { EmptyState } from "./components/EmptyState";

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

  const { data: menuDataAll, isLoading: isLoadingMenuAll } =
    useGetMenuByFranchise(activeFranchiseId);

  const allMenuProducts: MenuProduct[] = useMemo(() => {
    if (!menuDataAll) return [];
    return menuDataAll.flatMap((mc) => mc.products);
  }, [menuDataAll]);

  const allMenuProductsVisible = useMemo(
    () =>
      allMenuProducts.filter((product) =>
        product.sizes.some((s) => s.isAvailable),
      ),
    [allMenuProducts],
  );

  const categoryMenuCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (!menuDataAll) return counts;

    menuDataAll.forEach((category) => {
      const count = category.products.filter((product) =>
        product.sizes.some((s) => s.isAvailable),
      ).length;
      counts.set(String(category.categoryId), count);
    });

    return counts;
  }, [menuDataAll]);

  const categoriesVisible = useMemo(() => {
    if (!categories) return [];
    return categories.filter(
      (category) =>
        (categoryMenuCounts.get(String(category.categoryId)) ?? 0) > 0,
    );
  }, [categories, categoryMenuCounts]);

  const availableCategoryIds = useMemo(
    () => categoriesVisible.map((category) => String(category.categoryId)),
    [categoriesVisible],
  );

  // Resolve the actual category ID (user-selected or first from list)
  const activeCategoryId = useMemo(() => {
    if (selectedCategoryId === "ALL") return "ALL";
    if (
      selectedCategoryId &&
      availableCategoryIds.includes(selectedCategoryId)
    ) {
      return selectedCategoryId;
    }
    if (allMenuProductsVisible.length > 0) return "ALL";
    if (availableCategoryIds.length > 0) return availableCategoryIds[0];
    return "";
  }, [selectedCategoryId, availableCategoryIds, allMenuProductsVisible.length]);

  const categoryIdForQuery = activeCategoryId === "ALL" ? "" : activeCategoryId;

  const { data: menuDataByCategory, isLoading: isLoadingMenuByCategory } =
    useGetMenuByFranchiseAndCategory(activeFranchiseId, categoryIdForQuery);

  const {
    data: toppingDataByCategory,
    isLoading: isLoadingToppingsByCategory,
  } = useGetProductsByFranchiseAndCategory(
    activeFranchiseId,
    categoryIdForQuery,
  );

  // ── Derived state ──────────────────────────────────────────────────────
  const selectedFranchise = useMemo(
    () => franchises?.find((f) => f.id === activeFranchiseId),
    [franchises, activeFranchiseId],
  );

  const selectedCategory = useMemo(() => {
    if (activeCategoryId === "ALL") return null;
    return categories?.find((c) => String(c.categoryId) === activeCategoryId);
  }, [categories, activeCategoryId]);

  const menuDataActive =
    activeCategoryId === "ALL" ? menuDataAll : menuDataByCategory;

  // Menu products from menuData
  const menuProducts: MenuProduct[] = useMemo(() => {
    if (!menuDataActive) return [];
    return menuDataActive.flatMap((mc) => mc.products);
  }, [menuDataActive]);

  // Toppings from toppingData
  const toppings: ProductListItem[] = useMemo(() => {
    if (activeCategoryId === "ALL") return [];
    return toppingDataByCategory ?? [];
  }, [activeCategoryId, toppingDataByCategory]);

  const categoryTabs = useMemo(() => {
    const tabs: { id: string; name: string; count: number }[] = [];
    if (allMenuProductsVisible.length > 0) {
      tabs.push({
        id: "ALL",
        name: "All",
        count: allMenuProductsVisible.length,
      });
    }
    categoriesVisible.forEach((category) => {
      tabs.push({
        id: String(category.categoryId),
        name: category.categoryName,
        count: categoryMenuCounts.get(String(category.categoryId)) ?? 0,
      });
    });
    return tabs;
  }, [categoriesVisible, categoryMenuCounts, allMenuProductsVisible.length]);

  const menuProductsVisible = useMemo(
    () =>
      menuProducts.filter((product) =>
        product.sizes.some((s) => s.isAvailable),
      ),
    [menuProducts],
  );

  const toppingsVisible = useMemo(
    () =>
      toppings.filter((product) => product.sizes.some((s) => s.isAvailable)),
    [toppings],
  );

  const isLoadingMenu =
    activeCategoryId === "ALL" ? isLoadingMenuAll : isLoadingMenuByCategory;
  const isLoadingToppings = isLoadingToppingsByCategory;
  const isLoadingProducts = isLoadingMenu || isLoadingToppings;

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleFranchiseChange = (id: string) => {
    setSelectedFranchiseId(id);
    setSelectedCategoryId(null);
    setIsFranchiseDropdownOpen(false);
  };

  const handleViewDetail = (
    franchiseId: string,
    productId: string | number,
  ) => {
    if (!franchiseId || !productId) return;
    navigate(`/menu/product/${franchiseId}/${productId}`);
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
        className="relative bg-linear-to-br from-stone-900 via-stone-800 to-amber-900 
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
            Menu
          </h1>
          <p className="mt-3 text-amber-200/80 text-base md:text-lg font-light tracking-wider">
            Discover exceptional coffee flavors at every branch
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
                      ? "Loading..."
                      : selectedFranchise?.name || "Select Branch"}
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
        <div className="mb-10 mt-3">
          {isLoadingCategories || isLoadingMenuAll ? (
            <CategorySkeleton />
          ) : categoryTabs.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {categoryTabs.map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium
                               transition-all duration-300 ease-out
                               ${
                                 isActive
                                   ? "bg-amber-700 text-white shadow-lg shadow-amber-700/25 scale-105"
                                   : "bg-white text-stone-600 border border-stone-200 shadow-sm hover:border-amber-300 hover:text-amber-700 hover:shadow-md hover:scale-[1.02]"
                               }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold
                                  ${
                                    isActive
                                      ? "bg-white/20 text-white"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                    >
                      {cat.count}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            !isLoadingFranchises && (
              <p className="text-center text-stone-400 italic font-serif pt-3">
                No categories available for this branch
              </p>
            )
          )}
        </div>

        {/* ── Current selection info ─────────────────────────────────── */}
        {(selectedCategory || activeCategoryId === "ALL") && (
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600/70 font-medium mb-1">
              {selectedFranchise?.name}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 mb-2">
              {activeCategoryId === "ALL"
                ? "All"
                : selectedCategory?.categoryName}
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
            {menuProductsVisible.length > 0 ? (
              <section className="mb-14">
                <SectionDivider
                  icon={UtensilsCrossed}
                  title="Menu"
                  count={menuProductsVisible.length}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {menuProductsVisible.map((product) => (
                    <MenuProductCard
                      key={product.productId}
                      product={product}
                      onViewDetail={() =>
                        handleViewDetail(
                          activeFranchiseId,
                          String(product.productId),
                        )
                      }
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
                  <EmptyState message="No products in menu yet" />
                </section>
              )
            )}

            {/* ── Topping Section ────────────────────────────────────── */}
            {toppingsVisible.length > 0 ? (
              <section>
                <SectionDivider
                  icon={Cookie}
                  title="Topping"
                  count={toppingsVisible.length}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toppingsVisible.map((product) => (
                    <ToppingCard
                      key={product.productId}
                      product={product}
                      onViewDetail={() =>
                        handleViewDetail(
                          activeFranchiseId,
                          String(product.productId),
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            ) : (
              activeCategoryId && (
                <section>
                  <SectionDivider icon={Cookie} title="Topping" count={0} />
                  <EmptyState message="No toppings yet" />
                </section>
              )
            )}

            {/* No category selected */}
            {!activeCategoryId && !isLoadingCategories && (
              <EmptyState message="Please select a category to view menu" />
            )}
          </>
        )}
      </div>

      {/* ── Loading overlay for franchise change ──────────────────────── */}
      {isLoadingFranchises && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-2xl">
            <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
            <p className="font-serif text-stone-600">Loading menu...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
