import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coffee,
  Cookie,
  MapPin,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import {
  useGetAllFranchise,
  useGetCategoriesByFranchise,
  useGetMenuByFranchiseAndCategory,
  useGetProductsByFranchise,
  useGetProductsByFranchiseAndCategory,
} from "@/hooks/client/useProduct.hook";
import { FooterInfo } from "@/components/common/FooterInfo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingLayout from "@/layouts/loading-layout";
import type { MenuProduct } from "@/types/menu.type";
import type { ProductListItem } from "@/types/product.type";
import { EmptyState } from "./components/EmptyState";
import { MenuProductCard } from "./components/MenuProductCard";
import { SectionDivider } from "./components/SectionDivider";
import { ToppingCard } from "./components/ToppingCard.";

const DEFAULT_FRANCHISE_NAME = "Goat Coffee";

type ProductsAllDerived = {
  allProductsVisible: ProductListItem[];
  categoryMenuCounts: Record<string, number>;
  nonToppingMenuProductsForAll: MenuProduct[];
  toppingFromProducts: ProductListItem[];
  toppingCategoryId: string;
  allCount: number;
};

const CardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-md">
    <div className="h-44 bg-stone-200 sm:h-52" />
    <div className="space-y-3 p-4 sm:p-5">
      <div className="h-5 w-3/4 rounded bg-stone-200" />
      <div className="h-4 w-full rounded bg-stone-100" />
      <div className="h-4 w-1/2 rounded bg-stone-100" />
      <div className="flex gap-2 pt-2">
        <div className="h-7 w-16 rounded-full bg-stone-200" />
        <div className="h-7 w-16 rounded-full bg-stone-200" />
      </div>
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="flex gap-3 overflow-hidden">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-stone-200"
      />
    ))}
  </div>
);

const MenuPage = () => {
  const navigate = useNavigate();

  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const { data: franchises, isLoading: isLoadingFranchises } =
    useGetAllFranchise();

  const preferredFranchise =
    franchises?.find(
      (franchise) =>
        franchise.name.trim().toLowerCase() ===
        DEFAULT_FRANCHISE_NAME.toLowerCase(),
    ) ??
    franchises?.find((franchise) =>
      franchise.name
        .trim()
        .toLowerCase()
        .includes(DEFAULT_FRANCHISE_NAME.toLowerCase()),
    ) ??
    null;

  const activeFranchiseId =
    selectedFranchiseId ||
    preferredFranchise?.id ||
    (franchises && franchises.length > 0 ? franchises[0].id : "");

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesByFranchise(activeFranchiseId);

  const {
    data: productsAllData,
    isLoading: isLoadingProductsAll,
    isFetching: isFetchingProductsAll,
  } = useGetProductsByFranchise<ProductsAllDerived>(activeFranchiseId, {
    staleTime: 60 * 1000,
    select: (productsAll) => {
      const allProductsVisible = productsAll.filter((product) =>
        product.sizes.some((size) => size.isAvailable),
      );

      const categoryMenuCounts: Record<string, number> = {};
      for (const product of allProductsVisible) {
        const categoryId = String(product.categoryId);
        categoryMenuCounts[categoryId] =
          (categoryMenuCounts[categoryId] ?? 0) + 1;
      }

      const toppingFromProducts = productsAll.filter(
        (product) => product.categoryName.trim().toLowerCase() === "topping",
      );

      const nonToppingMenuProductsForAll = allProductsVisible
        .filter(
          (product) => product.categoryName.trim().toLowerCase() !== "topping",
        )
        .map((product) => ({
          productId: product.productId,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          isHaveTopping: product.isHaveTopping,
          sizes: product.sizes,
        }));

      return {
        allProductsVisible,
        categoryMenuCounts,
        nonToppingMenuProductsForAll,
        toppingFromProducts,
        toppingCategoryId: toppingFromProducts[0]
          ? String(toppingFromProducts[0].categoryId)
          : "",
        allCount: nonToppingMenuProductsForAll.length,
      };
    },
  });

  const categoryMenuCounts = productsAllData?.categoryMenuCounts ?? {};
  const nonToppingMenuProductsForAll =
    productsAllData?.nonToppingMenuProductsForAll ?? [];
  const toppingFromProducts = productsAllData?.toppingFromProducts ?? [];
  const toppingCategoryId = productsAllData?.toppingCategoryId ?? "";

  const categoriesVisible = (categories ?? []).filter(
    (category) =>
      (categoryMenuCounts[String(category.categoryId)] ?? 0) > 0 &&
      category.categoryName.trim().toLowerCase() !== "topping",
  );

  const categoryTabs: { id: string; name: string; count: number }[] = [];
  if ((productsAllData?.allCount ?? 0) > 0) {
    categoryTabs.push({
      id: "ALL",
      name: "All",
      count: productsAllData?.allCount ?? 0,
    });
  }

  for (const category of categoriesVisible) {
    categoryTabs.push({
      id: String(category.categoryId),
      name: category.categoryName,
      count: categoryMenuCounts[String(category.categoryId)] ?? 0,
    });
  }

  const availableCategoryIds = categoryTabs.map((tab) => tab.id);

  let activeCategoryId = "";
  if (selectedCategoryId && availableCategoryIds.includes(selectedCategoryId)) {
    activeCategoryId = selectedCategoryId;
  } else if (availableCategoryIds.includes("ALL")) {
    activeCategoryId = "ALL";
  } else if (availableCategoryIds.length > 0) {
    activeCategoryId = availableCategoryIds[0];
  }

  const isToppingSelected =
    !!activeCategoryId && activeCategoryId === toppingCategoryId;
  const categoryIdForMenuQuery =
    activeCategoryId && activeCategoryId !== "ALL" && !isToppingSelected
      ? activeCategoryId
      : "";

  const { data: menuDataByCategory, isLoading: isLoadingMenuByCategory } =
    useGetMenuByFranchiseAndCategory<MenuProduct[]>(
      activeFranchiseId,
      categoryIdForMenuQuery,
      {
        select: (menuByCategory) =>
          menuByCategory
            .flatMap((category) => category.products)
            .filter((product) => product.sizes.some((size) => size.isAvailable)),
      },
    );

  const {
    data: toppingDataByCategory,
    isLoading: isLoadingToppingsByCategory,
    isFetching: isFetchingToppingsByCategory,
  } = useGetProductsByFranchiseAndCategory(
    activeFranchiseId,
    toppingCategoryId,
    {
      enabled: !!toppingCategoryId,
      staleTime: 60 * 1000,
    },
  );

  const selectedFranchise =
    franchises?.find((franchise) => franchise.id === activeFranchiseId) ??
    preferredFranchise;

  const selectedCategory =
    activeCategoryId === "ALL"
      ? null
      : (categories?.find(
          (category) => String(category.categoryId) === activeCategoryId,
        ) ?? null);

  let menuProductsVisible: MenuProduct[] = [];
  if (activeCategoryId === "ALL") {
    menuProductsVisible = nonToppingMenuProductsForAll;
  } else if (!isToppingSelected) {
    menuProductsVisible = menuDataByCategory ?? [];
  }

  const toppingsVisible: ProductListItem[] =
    (toppingDataByCategory ?? []).length > 0
      ? (toppingDataByCategory ?? [])
      : toppingFromProducts;

  const isLoadingMenu =
    activeCategoryId === "ALL"
      ? isLoadingProductsAll || isFetchingProductsAll
      : activeCategoryId && !isToppingSelected
        ? isLoadingMenuByCategory
        : false;
  const isLoadingToppings =
    !!toppingCategoryId &&
    ((toppingDataByCategory ?? []).length === 0
      ? isLoadingToppingsByCategory || isFetchingToppingsByCategory
      : false);
  const isLoadingProducts = isLoadingMenu || isLoadingToppings;

  const selectedBranchName = selectedFranchise?.name || DEFAULT_FRANCHISE_NAME;
  const activeFranchiseSelectValue = activeFranchiseId || undefined;
  const selectedCategoryName = selectedCategory?.categoryName ?? "Menu";
  const hasActiveSelection = Boolean(selectedCategory || activeCategoryId === "ALL");
  const currentCategoryTitle = hasActiveSelection
    ? activeCategoryId === "ALL"
      ? "All Menu"
      : selectedCategoryName
    : "Select a category";
  const currentCategoryDescription = hasActiveSelection
    ? activeCategoryId === "ALL"
      ? "Browse every signature drink alongside the topping collection prepared for this branch."
      : `Explore handcrafted ${selectedCategoryName.toLowerCase()} curated for ${selectedBranchName}.`
    : "Choose a category to start browsing handcrafted drinks and toppings.";
  const heroStats = [
    { label: "Categories", value: categoriesVisible.length },
    {
      label: "Menu Items",
      value: productsAllData?.allCount ?? nonToppingMenuProductsForAll.length,
    },
    { label: "Toppings", value: toppingsVisible.length },
  ];

  const handleFranchiseChange = (id: string) => {
    setSelectedFranchiseId(id);
    setSelectedCategoryId(null);
  };

  const handleViewDetail = (
    franchiseId: string,
    productId: string | number,
  ) => {
    if (!franchiseId || !productId) return;
    navigate(`/menu/product/${franchiseId}/${productId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section
        className="relative z-30 overflow-x-hidden bg-linear-to-br from-[#241814] via-[#4E342E] to-[#8D6E63]
                   pt-20 pb-24 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute left-[-4rem] top-14 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl sm:h-52 sm:w-52" />
        <div className="absolute right-[-3rem] top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl sm:h-48 sm:w-48" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-amber-100/10 blur-3xl sm:h-40 sm:w-40" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:items-center">
            <div className="w-full text-left lg:text-center">
              <div className="flex items-center justify-start gap-4 lg:justify-center">
                <div className="h-px w-14 bg-linear-to-r from-transparent to-amber-400/70 sm:w-16" />
                <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                <div className="h-px w-14 bg-linear-to-l from-transparent to-amber-400/70 sm:w-16" />
              </div>

              <span className="mt-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/80 backdrop-blur-md">
                Coffee House Menu
              </span>

              <h1 className="mt-5 font-coffee text-4xl leading-none text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                Crafted for
                <span className="mt-2 block text-amber-200">Every Branch</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-amber-50/80 sm:text-base lg:mx-auto">
                Discover exceptional coffee flavors, signature drinks, and
                toppings tailored to each location.
              </p>
            </div>

            <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-[0_24px_60px_rgba(20,10,6,0.22)] backdrop-blur-md sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/75">
                  Available Today
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-black/10 px-3 py-3 shadow-inner"
                    >
                      <p className="font-coffee text-2xl text-white sm:text-[1.75rem]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-amber-100/65">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-[0_24px_60px_rgba(20,10,6,0.22)] backdrop-blur-md sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/75">
                      Current Branch
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-50/75">
                      Switch branch to see menu availability in real time.
                    </p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/10">
                    <MapPin className="h-4 w-4 text-amber-300" />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-amber-100/60">
                    Serving from
                  </p>
                  <Select
                    value={activeFranchiseSelectValue}
                    onValueChange={handleFranchiseChange}
                    disabled={isLoadingFranchises || !franchises?.length}
                  >
                    <SelectTrigger className="h-12 w-full rounded-full border border-white/20 bg-black/10 px-4 text-left text-white shadow-none transition-all duration-300 hover:border-white/30 hover:bg-white/12 focus:border-amber-300 focus:ring-amber-200/20 disabled:cursor-not-allowed disabled:opacity-70 sm:h-13">
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-amber-300" />
                        <SelectValue
                          placeholder={
                            isLoadingFranchises ? "Loading..." : "Select branch"
                          }
                        />
                      </div>
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={10}
                      avoidCollisions={false}
                      className="z-[9999] max-h-64 w-[var(--radix-select-trigger-width)] rounded-[1.25rem] border-stone-200 bg-white shadow-[0_28px_80px_rgba(20,10,6,0.24)] [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-slot=select-scroll-up-button]]:hidden"
                    >
                      {franchises?.map((franchise) => (
                        <SelectItem
                          key={franchise.id}
                          value={franchise.id}
                          className="py-4 text-sm text-stone-700"
                        >
                          <span className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 shrink-0 text-stone-400" />
                            <span className="truncate">{franchise.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

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

      <div className="relative z-10 container mx-auto px-3 pb-16 sm:px-4 sm:pb-20">
        <div className="relative -mt-14 sm:-mt-16">
          <div className="overflow-hidden rounded-[1.75rem] border border-[#E8DFD6] bg-[rgba(255,253,249,0.92)] p-4 shadow-[0_28px_70px_rgba(63,41,33,0.08)] backdrop-blur-sm sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 md:items-center md:text-center">
                <div className="flex flex-wrap items-center gap-2 md:justify-center">
                  <span className="inline-flex items-center rounded-full border border-[#E8DFD6] bg-[#FAF8F5] px-3 py-1 text-xs font-medium text-[#6D4C41]">
                    {selectedBranchName}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#F1E2D2] bg-[#FFF8F1] px-3 py-1 text-xs font-medium text-[#C97B3D]">
                    {menuProductsVisible.length} drinks
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#F1E2D2] bg-[#FFF8F1] px-3 py-1 text-xs font-medium text-[#C97B3D]">
                    {toppingsVisible.length} toppings
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8D6E63]">
                    Handcrafted Selection
                  </p>
                  <h2 className="mt-2 font-coffee text-3xl leading-none text-[#3E2723] sm:text-4xl">
                    {currentCategoryTitle}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6D4C41] md:mx-auto">
                    {currentCategoryDescription}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:justify-center">
                  <div className="h-px w-10 bg-[#C4A77D]/50 sm:w-12" />
                  <Coffee className="h-4 w-4 text-[#C4A77D]" />
                  <div className="h-px w-10 bg-[#C4A77D]/50 sm:w-12" />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#E8DFD6] bg-white/85 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8D6E63]">
                    Browse By Category
                  </p>
                  <span className="text-xs text-[#A1887F] md:hidden">
                    Tap to choose
                  </span>
                </div>

                {isLoadingCategories || isLoadingProductsAll ? (
                  <CategorySkeleton />
                ) : categoryTabs.length > 0 ? (
                  <div>
                    <div className="md:hidden">
                      <Select
                        value={activeCategoryId}
                        onValueChange={(value) => setSelectedCategoryId(value)}
                      >
                        <SelectTrigger className="h-12 w-full rounded-[1rem] border-[#E8DFD6] bg-white px-4 text-left text-sm font-medium text-[#5D4037] shadow-sm focus:border-[#C97B3D] focus:ring-[#C97B3D]/15">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={8}
                          avoidCollisions={false}
                          className="z-[9999] max-h-72 w-[var(--radix-select-trigger-width)] rounded-2xl border-[#E8DFD6] bg-white shadow-[0_24px_70px_rgba(63,41,33,0.16)] [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-slot=select-scroll-up-button]]:hidden"
                        >
                          {categoryTabs.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className="py-3 text-sm text-[#5D4037]"
                            >
                              {category.name} ({category.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="hidden flex-wrap gap-2 md:flex md:justify-center">
                      {categoryTabs.map((category) => {
                        const isActive = category.id === activeCategoryId;

                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategoryId(category.id)}
                            className={`relative whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium
                                       transition-all duration-300 ease-out lg:px-5
                                       ${
                                         isActive
                                           ? "bg-[#6D4C41] text-white shadow-lg shadow-[#6D4C41]/20"
                                           : "border border-[#E8DFD6] bg-white text-[#5D4037] shadow-sm hover:border-[#C8B7A7] hover:bg-[#FAF8F5] hover:text-[#6D4C41]"
                                       }`}
                          >
                            <span>{category.name}</span>
                            <span
                              className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-[#FFF4E8] text-[#C97B3D]"
                              }`}
                            >
                              {category.count}
                            </span>
                            {isActive && (
                              <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#C4A77D]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  !isLoadingFranchises && (
                    <p className="py-2 text-sm text-[#8D6E63]">
                      No categories available for this branch.
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          {isLoadingProducts ? (
            <div>
              <div className="mb-10 sm:mb-12">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-7 w-40 animate-pulse rounded bg-stone-200" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <CardSkeleton key={index} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-7 w-40 animate-pulse rounded bg-stone-200" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl bg-white shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {menuProductsVisible.length > 0 ? (
                <section className="mb-12 sm:mb-14">
                  <SectionDivider
                    icon={UtensilsCrossed}
                    title="Menu"
                    count={menuProductsVisible.length}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
                  <section className="mb-12 sm:mb-14">
                    <SectionDivider
                      icon={UtensilsCrossed}
                      title="Menu"
                      count={0}
                    />
                    <EmptyState message="No products in menu yet" />
                  </section>
                )
              )}

              {toppingsVisible.length > 0 ? (
                <section>
                  <SectionDivider
                    icon={Cookie}
                    title="Topping"
                    count={toppingsVisible.length}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

              {!activeCategoryId && !isLoadingCategories && (
                <EmptyState message="Please select a category to view menu" />
              )}
            </>
          )}
        </div>
      </div>

      <FooterInfo />

      <LoadingLayout
        forceVisible={isLoadingFranchises}
        message="Loading menu"
      />
    </div>
  );
};

export default MenuPage;
