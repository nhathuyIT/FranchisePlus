import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  Loader2,
  ArrowLeft,
  Coffee,
  Star,
} from "lucide-react";
import {
  useGetProductDetail,
  useGetProductsByFranchise,
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
import { FooterInfo } from "@/components/common/FooterInfo";

const MenuProductDetailPage = () => {
  const { franchiseId = "", productFranchiseId = "" } = useParams<{
    franchiseId: string;
    productFranchiseId: string;
  }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { authUser } = useAuthStore();

  // ── State ──────────────────────────────────────────────────────
  const [selectedSizeProductFranchiseId, setSelectedSizeProductFranchiseId] =
    useState(productFranchiseId);
  const [selectedToppings, setSelectedToppings] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");

  // ── Queries ────────────────────────────────────────────────────
  const { data: productDetailData, isLoading: isLoadingProduct } =
    useGetProductDetail(franchiseId, productFranchiseId);

  const { data: toppingDataAll } = useGetProductsByFranchise(franchiseId);
  const { data: franchiseDetail } = useGetFranchiseDetail(franchiseId);
  const { data: categories } = useGetCategoriesByFranchise(franchiseId);
  const { data: menuDataAll } = useGetMenuByFranchise(franchiseId);

  // ── Derived state ──────────────────────────────────────────────
  const categoryTabs = useMemo(() => {
    const tabs: { id: string; name: string; count: number }[] = [];
    if (!menuDataAll) return tabs;

    // Calculate total count across all categories
    const totalCount = menuDataAll.reduce(
      (acc, cat) =>
        acc +
        cat.products.filter((p) => p.sizes.some((s) => s.isAvailable)).length,
      0,
    );

    if (totalCount > 0) {
      tabs.push({ id: "ALL", name: "All", count: totalCount });
    }

    // Add valid categories
    categories?.forEach((category) => {
      const menuCategory = menuDataAll.find(
        (m) => String(m.categoryId) === String(category.categoryId),
      );
      const count = menuCategory
        ? menuCategory.products.filter((p) =>
            p.sizes.some((s) => s.isAvailable),
          ).length
        : 0;
      if (count > 0) {
        tabs.push({
          id: String(category.categoryId),
          name: category.categoryName,
          count,
        });
      }
    });
    return tabs;
  }, [categories, menuDataAll]);

  const product: ProductDetailItem | undefined = productDetailData;

  const detailName = product?.name ?? "Product";
  const detailDescription = product?.description ?? "";
  const detailContent = product?.content ?? "";
  const detailImageUrl = product?.imageUrl ?? "/placeholder-coffee.jpg";
  const detailImagesUrl = useMemo(
    () => product?.imagesUrl ?? [],
    [product?.imagesUrl],
  );
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
  const galleryImages = useMemo(() => {
    const images: string[] = [];
    if (detailImageUrl && detailImageUrl !== "/placeholder-coffee.jpg") {
      images.push(detailImageUrl);
    }
    if (detailImagesUrl.length > 0) {
      images.push(
        ...detailImagesUrl.filter((url) => url && !images.includes(url)),
      );
    }
    return images.length > 0 ? images : ["/placeholder-coffee.jpg"];
  }, [detailImageUrl, detailImagesUrl]);

  const activeImage =
    selectedImage || galleryImages[0] || "/placeholder-coffee.jpg";

  const toppingsByFranchiseVisible = useMemo(
    () =>
      (toppingDataAll ?? []).filter((product: ProductListItem) =>
        product.sizes.some((s) => s.isAvailable),
      ),
    [toppingDataAll],
  );

  // ── Handlers ───────────────────────────────────────────────────
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

  const handleAddToCart = () => {
    if (!authUser) {
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
      toast.error("Vui lòng đăng nhập để thực hiện");
      return;
    }

    if (!selectedSizeData) {
      toast.error("Vui lòng chọn size");
      return;
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
        if (!selectedToppingSize || !selectedToppingSize.isAvailable) return null;

        return {
          productFranchiseId: String(selectedToppingSize.productFranchiseId),
          quantity: 1,
        };
      })
      .filter((option): option is { productFranchiseId: string; quantity: number } =>
        !!option,
      );

    addItem(
      selectedSizeData.productFranchiseId,
      detailName,
      selectedSizeData.price,
      quantity,
      detailImageUrl,
      {
        franchiseId,
        options,
      },
    );

    toast.success(`Đã thêm "${detailName}" vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (authUser) {
      navigate("/client/cart");
    }
  };

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  // ── Pricing ────────────────────────────────────────────────────
  const basePrice = selectedSizeData
    ? selectedSizeData.price
    : availableDetailSizes.length > 0
      ? availableDetailSizes[0].price
      : 0;

  const toppingPrice = useMemo(() => {
    return Object.entries(selectedToppings).reduce(
      (total, [productId, franchiseProductId]) => {
        const topping = toppingsByFranchiseVisible.find(
          (t: ProductListItem) => String(t.productId) === productId,
        );
        if (!topping) return total;
        const size = topping.sizes.find(
          (s) => String(s.productFranchiseId) === franchiseProductId,
        );
        if (!size || !size.isAvailable) return total;
        return total + size.price;
      },
      0,
    );
  }, [selectedToppings, toppingsByFranchiseVisible]);

  const totalPrice = basePrice + toppingPrice;

  // ── Loading state ──────────────────────────────────────────────
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-xl">
          <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
          <p className="font-serif text-stone-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <div className="min-h-screen bg-[#FAF7F2] pt-5 pb-16">
        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <div className="bg-white border-b border-stone-200 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-stone-500">
              <Link to="/" className="hover:text-amber-700 transition-colors">
                Trang chủ
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

        {/* ── Main Layout: Sidebar + Product Detail ─────────────────────────── */}
        <div className="container mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Sidebar (1/5 Width) ─────────────────────────────────── */}
          <div className="w-full lg:w-1/5 shrink-0 bg-white rounded-2xl shadow-sm border border-stone-100 flex flex-col overflow-hidden max-h-[calc(100vh-120px)] top-24">
            <div className="p-4 border-b border-stone-100 bg-stone-50/50 shrink-0">
              <h3 className="font-serif font-bold text-stone-800 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-600" />
                Menu
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-stone-200">
              {categoryTabs.map((tab) => {
                const isExpanded = selectedCategoryId === tab.id;

                // Get products for this specific tab
                const tabProducts = menuDataAll
                  ? (tab.id === "ALL"
                      ? menuDataAll.flatMap((m) => m.products)
                      : menuDataAll.find((m) => String(m.categoryId) === tab.id)
                          ?.products || []
                    ).filter((p) => p.sizes.some((s) => s.isAvailable))
                  : [];

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
                          const firstSize = p.sizes.find((s) => s.isAvailable);
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
                                  src={p.imageUrl || "/placeholder-coffee.jpg"}
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

          {/* ── Main Content Area (4/5 Width) ─────────────────────────────────── */}
          <div className="w-full lg:w-4/5 flex-1 flex flex-col gap-6">
            {/* ── Main Product Detail ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* ── Left Column: Image ─────────────────────────────── */}
                <div className="lg:col-span-5 bg-stone-50">
                  <div className="sticky top-24">
                    {/* Main Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={activeImage}
                        alt={detailName}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Thumbnail Gallery */}
                    {galleryImages.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {galleryImages.map((img, index) => (
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

                    {/* Back button (mobile) */}
                    <div className="p-4 lg:hidden">
                      <button
                        type="button"
                        onClick={() => navigate(`/${ROUTER_URL.MENU}`)}
                        className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại Menu
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Right Column: Product Info ──────────────────────── */}
                <div className="lg:col-span-7 p-6 md:p-8 lg:p-10 flex flex-col">
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
                    <span className="text-xs text-stone-500">Còn hàng</span>
                  </div>

                  {/* Price section - Shopee style */}
                  <div className="bg-linear-to-r from-amber-50 to-orange-50 px-5 py-4 mt-4 rounded-xl">
                    <div className="flex items-baseline gap-3">
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

                  {/* ── Size Selection ──────────────────────────────── */}
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-stone-500 w-24 shrink-0">
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

                  {/* ── Topping Selection ───────────────────────────── */}
                  {detailHasTopping && (
                    <div className="mt-6 pt-6 border-t border-stone-100 scrollbar-hide scrollbar-invisible">
                      <div className="flex items-start gap-4">
                        <span className="text-sm text-stone-500 w-24 shrink-0 pt-1">
                          Topping
                        </span>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide w-full">
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
                                    className={`shrink-0 w-28 rounded-xl border p-2 flex flex-col items-center gap-2 transition-all duration-200
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
                                        {formatPrice(firstAvailableSize.price)}
                                      </p>
                                    </div>
                                  </button>
                                );
                              },
                            )
                          ) : (
                            <p className="text-sm text-stone-400 italic">
                              Không có topping cho chi nhánh này
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Quantity ────────────────────────────────────── */}
                  <div className="mt-6 pt-6 border-t border-stone-100">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-stone-500 w-24 shrink-0">
                        Số Lượng
                      </span>
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={handleDecrease}
                          disabled={quantity <= 1}
                          className="h-9 w-9 flex items-center justify-center text-stone-600 
                                 hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-12 text-center text-sm font-semibold text-stone-800 border-x border-stone-200 h-9 flex items-center justify-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrease}
                          className="h-9 w-9 flex items-center justify-center text-stone-600 
                                 hover:bg-stone-50 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Action Buttons ──────────────────────────────── */}
                  <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddToCart}
                      className="flex-1 sm:flex-none px-8 py-6 rounded-xl border-2 border-amber-700 
                             text-amber-700 hover:bg-amber-50 
                             text-sm font-semibold transition-all duration-200
                             hover:shadow-md"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Thêm Vào Giỏ Hàng
                    </Button>
                    <Button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 sm:flex-none px-8 py-6 rounded-xl
                             bg-amber-700 text-white hover:bg-amber-800 
                             text-sm font-semibold transition-all duration-200
                             shadow-lg shadow-amber-700/25 hover:shadow-xl hover:shadow-amber-700/30"
                    >
                      Mua Ngay
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Product Description Section ─────────────────────────── */}
            {(detailDescription || detailContent) && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="bg-linear-to-r from-stone-800 to-stone-700 px-6 py-3">
                  <h2 className="font-serif text-white text-base font-semibold tracking-wide">
                    MÔ TẢ SẢN PHẨM
                  </h2>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
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

            {/* ── Back to menu button ──────────────────────────────────── */}
          </div>
        </div>
      </div>
      <FooterInfo />
    </>
  );
};

export default MenuProductDetailPage;
