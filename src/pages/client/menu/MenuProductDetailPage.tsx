import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  Loader2,
  Coffee,
  Star,
} from "lucide-react";
import {
  useGetProductDetail,
  useGetProductsByFranchise,
  useGetProductsByFranchiseAndCategory,
  useGetFranchiseDetail,
  useGetCategoriesByFranchise,
  useGetMenuByFranchise,
} from "@/hooks/client/useProduct.hook";
import type { ProductListItem, ProductDetailItem } from "@/types/product.type";
import { formatPrice, getSizeLabel } from "./lib/helpers";
import { useCart } from "@/pages/client/cart";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTER_URL } from "@/router/route.const";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FooterInfo } from "@/components/common/FooterInfo";
import LoadingLayout from "@/layouts/loading-layout";

type ProductsAllDerived = {
  toppingFromProducts: ProductListItem[];
  toppingCategoryId: string;
};

type MenuProductDetailPageContentProps = {
  franchiseId: string;
  productId: string;
};

const MenuProductDetailPageContent = ({
  franchiseId,
  productId,
}: MenuProductDetailPageContentProps) => {
  const navigate = useNavigate();
  const { addItemAsync } = useCart();
  const { authUser } = useAuthStore();

  // State
  const [selectedSizeProductFranchiseId, setSelectedSizeProductFranchiseId] =
    useState("");
  const [selectedToppings, setSelectedToppings] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [isCartActionLoading, setIsCartActionLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [note, setNote] = useState("");

  // Queries
  const { data: productDetailData, isLoading: isLoadingProduct } =
    useGetProductDetail(franchiseId, productId);

  const { data: productsAllData } =
    useGetProductsByFranchise<ProductsAllDerived>(franchiseId, {
      staleTime: 60 * 1000,
      select: (products) => {
        const toppingFromProducts = products.filter(
          (item) => item.categoryName.trim().toLowerCase() === "topping",
        );

        return {
          toppingFromProducts,
          toppingCategoryId: toppingFromProducts[0]
            ? String(toppingFromProducts[0].categoryId)
            : "",
        };
      },
    });
  const { data: franchiseDetail } = useGetFranchiseDetail(franchiseId);
  const { data: categories } = useGetCategoriesByFranchise(franchiseId);
  const { data: menuDataAll } = useGetMenuByFranchise(franchiseId);
  const toppingFromProducts = productsAllData?.toppingFromProducts ?? [];
  const toppingCategoryId = productsAllData?.toppingCategoryId ?? "";
  const { data: toppingDataByCategory } = useGetProductsByFranchiseAndCategory(
    franchiseId,
    toppingCategoryId,
    {
      enabled: !!toppingCategoryId,
      staleTime: 60 * 1000,
    },
  );

  // Derived state
  const categoryTabs: { id: string; name: string; count: number }[] = [];
  const availableCategories = (categories ?? []).filter(
    (category) => category.categoryName.trim().toLowerCase() !== "topping",
  );

  const allTabProducts = (menuDataAll ?? [])
    .filter((category) => String(category.categoryId) !== toppingCategoryId)
    .flatMap((category) => category.products)
    .filter((product) => product.sizes.some((size) => size.isAvailable));
  const productsByCategoryId: Record<
    string,
    Array<(typeof allTabProducts)[number]>
  > = {};

  if (allTabProducts.length > 0) {
    productsByCategoryId.ALL = allTabProducts;
    categoryTabs.push({ id: "ALL", name: "All", count: allTabProducts.length });
  }

  for (const category of availableCategories) {
    const menuCategory = (menuDataAll ?? []).find(
      (item) => String(item.categoryId) === String(category.categoryId),
    );
    const tabProducts = (menuCategory?.products ?? []).filter((product) =>
      product.sizes.some((size) => size.isAvailable),
    );
    const count = tabProducts.length;

    if (count > 0) {
      const categoryId = String(category.categoryId);
      productsByCategoryId[categoryId] = tabProducts;
      categoryTabs.push({
        id: categoryId,
        name: category.categoryName,
        count,
      });
    }
  }

  const defaultCategoryId =
    categoryTabs.find((tab) => tab.id === "ALL")?.id ??
    categoryTabs[0]?.id ??
    "";
  const activeResponsiveCategoryId =
    selectedCategoryId && productsByCategoryId[selectedCategoryId]
      ? selectedCategoryId
      : defaultCategoryId;
  const activeResponsiveCategory =
    categoryTabs.find((tab) => tab.id === activeResponsiveCategoryId) ?? null;
  const activeResponsiveProducts =
    productsByCategoryId[activeResponsiveCategoryId] ?? [];

  const product: ProductDetailItem | undefined = productDetailData;

  const detailName = product?.name ?? "Product";
  const detailDescription = product?.description ?? "";
  const detailContent = product?.content ?? "";
  const detailImageUrl = product?.imageUrl ?? "/placeholder-coffee.jpg";
  const detailImagesUrl = product?.imagesUrl ?? [];
  const detailHasTopping = product?.isHaveTopping;
  const detailSizes = product?.sizes ?? [];
  const availableDetailSizes = detailSizes.filter((size) => size.isAvailable);

  const effectiveSelectedSizeProductFranchiseId = availableDetailSizes.some(
    (size) =>
      String(size.productFranchiseId) === selectedSizeProductFranchiseId,
  )
    ? selectedSizeProductFranchiseId
    : String(availableDetailSizes[0]?.productFranchiseId ?? "");

  const selectedSizeData = availableDetailSizes.find(
    (size) =>
      String(size.productFranchiseId) ===
      effectiveSelectedSizeProductFranchiseId,
  );

  // Image gallery: main image + additional images
  const [selectedImage, setSelectedImage] = useState("");
  const galleryImages: string[] = [];
  if (detailImageUrl && detailImageUrl !== "/placeholder-coffee.jpg") {
    galleryImages.push(detailImageUrl);
  }
  if (detailImagesUrl.length > 0) {
    for (const imageUrl of detailImagesUrl) {
      if (imageUrl && !galleryImages.includes(imageUrl)) {
        galleryImages.push(imageUrl);
      }
    }
  }
  const normalizedGalleryImages =
    galleryImages.length > 0 ? galleryImages : ["/placeholder-coffee.jpg"];

  const activeImage =
    selectedImage || normalizedGalleryImages[0] || "/placeholder-coffee.jpg";

  const toppingsByFranchiseVisible: ProductListItem[] =
    (toppingDataByCategory ?? []).length > 0
      ? (toppingDataByCategory ?? [])
      : toppingFromProducts;

  // Handlers
  const handleToggleTopping = (product: ProductListItem, checked: boolean) => {
    const productIdKey = String(product.productId);
    if (!checked) {
      setSelectedToppings((prev) => {
        const cloned = { ...prev };
        delete cloned[productIdKey];
        return cloned;
      });
      return;
    }

    const firstAvailableSize = product.sizes.find((size) => size.isAvailable);
    if (!firstAvailableSize) return;

    setSelectedToppings((prev) => ({
      ...prev,
      [productIdKey]: String(firstAvailableSize.productFranchiseId),
    }));
  };

  const handleAddToCart = async (): Promise<boolean> => {
    if (isCartActionLoading) {
      return false;
    }

    if (!authUser) {
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
      toast.error("Please sign in to continue");
      return false;
    }

    if (!selectedSizeData) {
      toast.error("Please choose a size");
      return false;
    }

    const options = Object.entries(selectedToppings)
      .map(([productId, franchiseProductId]) => {
        const topping = toppingsByFranchiseVisible.find(
          (item: ProductListItem) => String(item.productId) === productId,
        );
        if (!topping) return null;

        const selectedToppingSize = topping.sizes.find(
          (size) => String(size.productFranchiseId) === franchiseProductId,
        );
        if (!selectedToppingSize || !selectedToppingSize.isAvailable)
          return null;

        return {
          productFranchiseId: String(selectedToppingSize.productFranchiseId),
          quantity: 1,
        };
      })
      .filter(
        (option): option is { productFranchiseId: string; quantity: number } =>
          !!option,
      );

    setIsCartActionLoading(true);

    let added = false;

    try {
      added = await addItemAsync(
        selectedSizeData.productFranchiseId,
        detailName,
        selectedSizeData.price,
        quantity,
        detailImageUrl,
        {
          franchiseId,
          note: note.trim() || undefined,
          options,
        },
      );
    } finally {
      setIsCartActionLoading(false);
    }
    if (!added) {
      return false;
    }

    return true;
  };

  const handleBuyNow = async () => {
    const added = await handleAddToCart();
    if (added) {
      navigate("/client/cart");
    }
  };

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const basePrice = selectedSizeData
    ? selectedSizeData.price
    : availableDetailSizes.length > 0
      ? availableDetailSizes[0].price
      : 0;

  const toppingPrice = Object.entries(selectedToppings).reduce(
    (total, [productId, franchiseProductId]) => {
      const topping = toppingsByFranchiseVisible.find(
        (item: ProductListItem) => String(item.productId) === productId,
      );
      if (!topping) return total;
      const size = topping.sizes.find(
        (item) => String(item.productFranchiseId) === franchiseProductId,
      );
      if (!size || !size.isAvailable) return total;
      return total + size.price;
    },
    0,
  );

  const totalPrice = basePrice + toppingPrice;

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-xl">
          <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
          <p className="font-serif text-stone-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Render
  return (
    <>
      <LoadingLayout forceVisible={isCartActionLoading} message="Processing" />
      <div className="min-h-screen bg-[#FAF7F2] pt-5 pb-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-stone-200 shadow-sm">
          <div className="container mx-auto px-3 py-3 sm:px-4">
            <nav className="flex items-center gap-2 text-sm text-stone-500">
              <Link to="/" className="hover:text-amber-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                to={`/${ROUTER_URL.MENU}`}
                className="hover:text-amber-700 transition-colors"
              >
                Menu
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-stone-800 font-medium truncate max-w-50">
                {detailName}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-3 pt-4 sm:px-4 sm:pt-6">
          {/* Mobile + tablet menu navigation */}
          <div className="lg:hidden">
            <div className="overflow-hidden rounded-[1.75rem] border border-[#E8DFD6] bg-[rgba(255,253,249,0.92)] p-4 shadow-[0_28px_70px_rgba(63,41,33,0.08)] backdrop-blur-sm sm:p-5">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {franchiseDetail && (
                      <span className="inline-flex items-center rounded-full border border-[#E8DFD6] bg-[#FAF8F5] px-3 py-1 text-xs font-medium text-[#6D4C41]">
                        {franchiseDetail.name}
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full border border-[#F1E2D2] bg-[#FFF8F1] px-3 py-1 text-xs font-medium text-[#C97B3D]">
                      {activeResponsiveProducts.length} items
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8D6E63]">
                      Browse by Category
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-[#3E2723] sm:text-3xl">
                      {activeResponsiveCategory?.name ?? "Menu"}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6D4C41]">
                      Switch category and jump to another drink without losing
                      the product detail flow on smaller screens.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#E8DFD6] bg-white/85 p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8D6E63]">
                      Browse Menu
                    </p>
                    <span className="text-xs text-[#A1887F]">
                      Swipe to explore
                    </span>
                  </div>

                  {categoryTabs.length > 0 ? (
                    <>
                      <div className="md:hidden">
                        <Select
                          value={activeResponsiveCategoryId}
                          onValueChange={(value) =>
                            setSelectedCategoryId(value)
                          }
                        >
                          <SelectTrigger className="h-12 w-full rounded-[1rem] border-[#E8DFD6] bg-white px-4 text-left text-sm font-medium text-[#5D4037] shadow-sm transition-colors duration-200 hover:border-[#6D4C41] hover:bg-[#FAF8F5] hover:text-[#6D4C41] focus:border-[#6D4C41] focus:ring-[#6D4C41]/15">
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

                      <div className="hidden flex-wrap gap-2 md:flex">
                        {categoryTabs.map((category) => {
                          const isActive =
                            category.id === activeResponsiveCategoryId;

                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => setSelectedCategoryId(category.id)}
                              className={`relative cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
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

                      {activeResponsiveProducts.length > 0 && (
                        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                          {activeResponsiveProducts.map((menuProduct) => {
                            const firstSize = menuProduct.sizes.find(
                              (size) => size.isAvailable,
                            );
                            if (!firstSize) return null;

                            const isActive =
                              String(menuProduct.productId) ===
                              String(productDetailData?.productId);

                            return (
                              <Link
                                key={menuProduct.productId}
                                to={`/menu/product/${franchiseId}/${menuProduct.productId}`}
                                className={`min-w-[220px] rounded-[1.25rem] border p-3 transition-all duration-200 sm:min-w-[240px] ${
                                  isActive
                                    ? "border-amber-200 bg-amber-50 shadow-sm"
                                    : "border-[#E8DFD6] bg-white hover:border-[#C8B7A7] hover:bg-[#FAF8F5]"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                                    <img
                                      src={
                                        menuProduct.imageUrl ||
                                        "/placeholder-coffee.jpg"
                                      }
                                      alt={menuProduct.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={`truncate text-sm font-semibold ${
                                        isActive
                                          ? "text-amber-800"
                                          : "text-[#3E2723]"
                                      }`}
                                    >
                                      {menuProduct.name}
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-amber-700">
                                      {formatPrice(firstSize.price)}
                                    </p>
                                    <span className="mt-2 inline-flex text-xs text-[#8D6E63]">
                                      {isActive ? "Viewing now" : "Open detail"}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-[#8D6E63]">
                      No categories available for this branch.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main layout: sidebar + product detail */}
          <div className="mt-4 flex flex-col items-start gap-6 lg:mt-6 lg:flex-row">
            {/* Sidebar */}
            <div className="hidden w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm lg:flex lg:w-1/5">
              <div className="p-4 border-b border-stone-100 bg-stone-50/50 shrink-0">
                <h3 className="font-serif font-bold text-stone-800 flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-amber-600" />
                  Menu
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-stone-200">
                {categoryTabs.map((tab) => {
                  const isExpanded = selectedCategoryId === tab.id;
                  const tabProducts = productsByCategoryId[tab.id] ?? [];

                  if (tabProducts.length === 0) return null;

                  return (
                    <div key={tab.id} className="flex flex-col gap-1">
                      <button
                        onClick={() =>
                          setSelectedCategoryId(isExpanded ? "" : tab.id)
                        }
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                          isExpanded
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                        }`}
                      >
                        <span className="truncate pr-2">{tab.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isExpanded
                              ? "bg-amber-700/50 text-white"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>

                      {/* Render products if this category is expanded */}
                      {isExpanded && (
                        <div className="flex flex-col gap-1 pl-2 pr-1 animate-in slide-in-from-top-2 duration-200">
                          {tabProducts.map((p) => {
                            const firstSize = p.sizes.find(
                              (s) => s.isAvailable,
                            );
                            if (!firstSize) return null;
                            const isActive =
                              String(p.productId) ===
                              String(productDetailData?.productId);

                            return (
                              <Link
                                key={p.productId}
                                to={`/menu/product/${franchiseId}/${p.productId}`}
                                className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                                  isActive
                                    ? "bg-amber-50 border border-amber-200 shadow-sm"
                                    : "hover:bg-stone-50 border border-transparent"
                                }`}
                              >
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                  <img
                                    src={
                                      p.imageUrl || "/placeholder-coffee.jpg"
                                    }
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs font-medium truncate ${isActive ? "text-amber-800" : "text-stone-700"}`}
                                  >
                                    {p.name}
                                  </p>
                                  <p className="text-[10px] font-bold text-amber-600 mt-0.5">
                                    {formatPrice(firstSize.price)}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main content area */}
            <div className="w-full lg:w-4/5 flex-1 flex flex-col gap-6">
              {/* Main product detail */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left column: image */}
                  <div className="lg:col-span-5 bg-stone-50">
                    <div className="lg:sticky lg:top-24">
                      {/* Main Image */}
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={activeImage}
                          alt={detailName}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>

                      {/* Thumbnail Gallery */}
                      {normalizedGalleryImages.length > 1 && (
                        <div className="flex gap-2 p-4 overflow-x-auto">
                          {normalizedGalleryImages.map((img, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedImage(img)}
                              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white transition-all ${
                                activeImage === img
                                  ? "border-amber-600 ring-1 ring-amber-600/30"
                                  : "border-stone-200 hover:border-amber-300"
                              }`}
                            >
                              <img
                                src={img}
                                alt={`${detailName} ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column: product info */}
                  <div className="flex flex-col p-5 sm:p-6 md:p-8 lg:col-span-7 lg:p-10">
                    {/* Franchise name */}
                    {franchiseDetail && (
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600/70 mb-1">
                        {franchiseDetail.name}
                      </p>
                    )}

                    {/* Product name */}
                    <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-stone-800 leading-tight">
                      {detailName}
                    </h1>

                    {/* Rating placeholder row */}
                    <div className="flex items-center gap-4 mt-3 pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-stone-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-stone-400">|</span>
                      <span className="text-xs text-stone-500">In stock</span>
                    </div>

                    {/* Price section - Shopee style */}
                    <div className="bg-linear-to-r from-amber-50 to-orange-50 px-5 py-4 mt-4 rounded-xl">
                      <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                        <span className="font-serif text-3xl md:text-4xl font-bold text-amber-700">
                          {formatPrice(totalPrice)}
                        </span>
                        {availableDetailSizes.length > 1 && (
                          <span className="text-sm text-stone-400">
                            {formatPrice(
                              Math.min(
                                ...availableDetailSizes.map((s) => s.price),
                              ),
                            )}
                            {" ~ "}
                            {formatPrice(
                              Math.max(
                                ...availableDetailSizes.map((s) => s.price),
                              ),
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {detailDescription && (
                      <div className="mt-5">
                        <p className="text-sm text-stone-600 leading-relaxed">
                          {detailDescription}
                        </p>
                      </div>
                    )}

                    {/* Size selection */}
                    <div className="mt-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                        <span className="text-sm text-stone-500 shrink-0 sm:w-24 sm:pt-3">
                          Size
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {availableDetailSizes.map((size) => {
                            const sizeProductFranchiseId = String(
                              size.productFranchiseId,
                            );
                            const isSelected =
                              effectiveSelectedSizeProductFranchiseId ===
                              sizeProductFranchiseId;

                            return (
                              <button
                                key={sizeProductFranchiseId}
                                type="button"
                                onClick={() =>
                                  setSelectedSizeProductFranchiseId(
                                    sizeProductFranchiseId,
                                  )
                                }
                                className={`
                            relative px-5 py-2.5 rounded-lg border text-sm font-medium
                            transition-all duration-200
                            ${
                              isSelected
                                ? "border-amber-700 bg-amber-50 text-amber-800 shadow-sm ring-1 ring-amber-700"
                                : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-700"
                            }
                          `}
                              >
                                <span className="block font-semibold">
                                  {getSizeLabel(size.size)}
                                </span>
                                <span
                                  className={`block text-xs mt-0.5 ${isSelected ? "text-amber-600" : "text-stone-400"}`}
                                >
                                  {formatPrice(size.price)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Topping selection */}
                    {detailHasTopping && (
                      <div className="mt-6 pt-6 border-t border-stone-100 scrollbar-hide scrollbar-invisible">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                          <span className="text-sm text-stone-500 shrink-0 sm:w-24 sm:pt-1">
                            Topping
                          </span>
                          <div className="grid w-full grid-cols-2 gap-3 pb-1 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:gap-4 lg:overflow-x-auto lg:pb-4">
                            {toppingsByFranchiseVisible.length > 0 ? (
                              toppingsByFranchiseVisible.map(
                                (topping: ProductListItem) => {
                                  const toppingId = String(topping.productId);
                                  const selectedToppingSizeId =
                                    selectedToppings[toppingId];
                                  const availableToppingSizes =
                                    topping.sizes.filter(
                                      (size) => size.isAvailable,
                                    );
                                  const firstAvailableSize =
                                    availableToppingSizes[0];
                                  if (!firstAvailableSize) return null;

                                  const isChecked = Boolean(
                                    selectedToppingSizeId,
                                  );

                                  return (
                                    <button
                                      key={topping.productId}
                                      type="button"
                                      onClick={() =>
                                        handleToggleTopping(topping, !isChecked)
                                      }
                                      className={`w-full rounded-xl border p-2 flex flex-col items-center gap-2 transition-all duration-200 lg:shrink-0 lg:w-28
                                  ${
                                    isChecked
                                      ? "border-amber-600 bg-amber-50 ring-1 ring-amber-600"
                                      : "border-stone-200 bg-white hover:border-amber-300"
                                  }`}
                                    >
                                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-stone-100">
                                        <img
                                          src={
                                            topping.imageUrl ||
                                            "/placeholder-coffee.jpg"
                                          }
                                          alt={topping.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="text-center w-full px-0.5">
                                        <p
                                          className="text-xs font-semibold text-stone-700 truncate w-full"
                                          title={topping.name}
                                        >
                                          {topping.name}
                                        </p>
                                        <p className="text-xs font-bold text-amber-700 mt-1">
                                          +{" "}
                                          {formatPrice(
                                            firstAvailableSize.price,
                                          )}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                },
                              )
                            ) : (
                              <p className="text-sm text-stone-400 italic">
                                No toppings available for this franchise
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="mt-6 border-t border-stone-100 pt-6">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                        <span className="shrink-0 text-sm text-stone-500 lg:w-24">
                          Quantity
                        </span>
                        <div className="flex w-full items-center overflow-hidden rounded-xl border border-stone-200 bg-white lg:w-auto lg:rounded-lg">
                          <button
                            type="button"
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-11 w-14 items-center justify-center text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-30 md:h-12 md:w-16 lg:h-9 lg:w-9"
                          >
                            <Minus className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                          </button>
                          <span className="flex h-11 flex-1 items-center justify-center border-x border-stone-200 px-4 text-center text-sm font-semibold text-stone-800 md:h-12 lg:h-9 lg:min-w-12 lg:flex-none lg:px-0">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={handleIncrease}
                            aria-label="Increase quantity"
                            className="flex h-11 w-14 items-center justify-center text-stone-600 transition-colors hover:bg-stone-50 md:h-12 md:w-16 lg:h-9 lg:w-9"
                          >
                            <Plus className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-stone-100">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                        <span className="text-sm text-stone-500 shrink-0 sm:w-24 sm:pt-3">
                          Note
                        </span>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="For example: less ice, less sugar, pack separately..."
                            className="min-h-24 rounded-xl border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus-visible:ring-amber-500/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-8 flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          void handleAddToCart();
                        }}
                        disabled={isCartActionLoading}
                        className="flex-1 sm:flex-none px-8 py-6 rounded-xl border-2 border-amber-700 
                             text-amber-700 hover:bg-amber-50 
                             text-sm font-semibold transition-all duration-200
                             hover:shadow-md"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to cart
                      </Button>
                      <Button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={isCartActionLoading}
                        className="flex-1 sm:flex-none px-8 py-6 rounded-xl
                             bg-amber-700 text-white hover:bg-amber-800 
                             text-sm font-semibold transition-all duration-200
                            shadow-lg shadow-amber-700/25 hover:shadow-xl hover:shadow-amber-700/30"
                      >
                        {isCartActionLoading ? "Processing..." : "Buy now"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Product description section */}
              {(detailDescription || detailContent) && (
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                  <div className="bg-linear-to-r from-stone-800 to-stone-700 px-6 py-3">
                    <h2 className="font-serif text-white text-base font-semibold tracking-wide">
                      PRODUCT DETAILS
                    </h2>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-amber-200/40" />
                      <Coffee className="h-4 w-4 text-amber-500" />
                      <div className="h-px flex-1 bg-amber-200/40" />
                    </div>
                    {detailDescription && (
                      <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                        {detailDescription}
                      </p>
                    )}
                    {detailContent && (
                      <div
                        className="mt-4 text-sm text-stone-600 leading-relaxed prose prose-stone prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: detailContent }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Back to menu button */}
            </div>
          </div>
        </div>
      </div>
      <FooterInfo />
    </>
  );
};

const MenuProductDetailPage = () => {
  const { franchiseId = "", productId = "" } = useParams<{
    franchiseId: string;
    productId: string;
  }>();

  return (
    <MenuProductDetailPageContent
      key={`${franchiseId}:${productId}`}
      franchiseId={franchiseId}
      productId={productId}
    />
  );
};

export default MenuProductDetailPage;
