import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  PackageSearch,
  Loader2,
  Plus,
  Trash2,
  ChevronLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ROUTER_URL } from "@/router/route.const";
import { useProductFranchisesQuery } from "@/hooks/product-franchise/useProductFranchiseQuery";
import {
  useProductCategoryFranchisesQuery,
  useAddProductToCategoryFranchise,
  useDeleteProductCategoryFranchise,
} from "@/hooks/product-category-franchise/useProductCategoryFranchise";
import { searchItemsByConditions } from "@/api/category-franchise/CategoryFranchise.api";
import { useAddCategoryToFranchise } from "@/hooks/admin/useCategoryFranchise.hook";
import { useQuery } from "@tanstack/react-query";
import { useFranchise } from "@/hooks/franchise";
import { useCategoriesQuery } from "@/hooks/category/useCategoryQuery";
import { useProductsQuery } from "@/hooks/product/useProductQuery";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import type { ProductCategoryFranchise } from "@/api/product-category-franchise/product-category-franchise.api";

// ─────────────────────────────────────────────────────────────────────────────

const FranchiseProductAssign = () => {
  const { id: franchiseId } = useParams<{ id: string }>();

  // ── State ─────────────────────────────────────────────────────────────────
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  // Tab filter: which category's products are VISIBLE in the grid (null = All)
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  // Sidebar: which category to ASSIGN products into
  const [selectedCategoryFranchiseId, setSelectedCategoryFranchiseId] =
    useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );
  const [showNoCategoryWarning, setShowNoCategoryWarning] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [dialogCategoryId, setDialogCategoryId] = useState("");
  const [dialogCategorySearch, setDialogCategorySearch] = useState("");

  // ── Franchise info ────────────────────────────────────────────────────────
  const { data: franchise } = useFranchise(franchiseId ?? "", {
    enabled: !!franchiseId,
  });

  // ── Product franchises (all products for this franchise) ──────────────────
  const productSearchParams = useMemo(
    () => ({
      searchCondition: {
        keyword: "",
        franchise_id: franchiseId ?? "",
        product_id: "",
        min_price: "" as const,
        max_price: "" as const,
        is_active: "" as const,
        is_deleted: false,
      },
      pageInfo: { pageNum: 1, pageSize: 200 },
    }),
    [franchiseId],
  );

  const { data: productFranchises = [], isLoading: productsLoading } =
    useProductFranchisesQuery(productSearchParams);

  // ── Category franchises (all categories for this franchise) ───────────────
  const categorySearchParams = useMemo(
    () => ({
      searchCondition: {
        franchiseId: franchiseId ?? "",
        categoryId: "",
        isActive: "" as const,
        isDeleted: false as const,
      },
      pageInfo: { pageNum: 1, pageSize: 100 },
    }),
    [franchiseId],
  );

  const { data: categoryFranchisesData, isLoading: categoriesLoading } =
    useQuery({
      queryKey: ["category-franchises", "search", categorySearchParams],
      queryFn: () => searchItemsByConditions(categorySearchParams),
      enabled: !!franchiseId,
    });

  const categoryFranchises: SearchCategoryFranchise[] =
    categoryFranchisesData?.data ?? [];

  // ── ALL product-category-franchise assignments (single master query) ──────
  const allAssignmentsParams = useMemo(
    () => ({
      searchCondition: {
        franchiseId: franchiseId ?? "",
        isDeleted: false,
      },
      pageInfo: { pageNum: 1, pageSize: 1000 },
    }),
    [franchiseId],
  );

  const { data: allAssignments = [], isLoading: assignmentsLoading } =
    useProductCategoryFranchisesQuery(allAssignmentsParams, !!franchiseId);

  // ── Derived maps from allAssignments ──────────────────────────────────────
  // Map: categoryFranchiseId → assignment[]
  const assignmentsByCat = useMemo(() => {
    const map = new Map<string, ProductCategoryFranchise[]>();
    for (const a of allAssignments) {
      const catId = a.categoryFranchiseId;
      if (!catId) continue;
      const list = map.get(catId) ?? [];
      list.push(a);
      map.set(catId, list);
    }
    return map;
  }, [allAssignments]);

  // Map: categoryFranchiseId → count of products
  const productCountByCat = useMemo(() => {
    const map = new Map<string, number>();
    for (const [catId, items] of assignmentsByCat) {
      map.set(catId, items.length);
    }
    return map;
  }, [assignmentsByCat]);

  // Set of productFranchiseIds for the ACTIVE TAB (grid filtering)
  const tabProductIds = useMemo(() => {
    if (!activeTabId) return null; // null means "All" → no filtering
    const items = assignmentsByCat.get(activeTabId) ?? [];
    return new Set(items.map((a) => a.productFranchiseId));
  }, [activeTabId, assignmentsByCat]);

  // Set of productFranchiseIds for the SIDEBAR selection (badges)
  const sidebarAssignedIds = useMemo(() => {
    if (!selectedCategoryFranchiseId) return new Set<string>();
    const items = assignmentsByCat.get(selectedCategoryFranchiseId) ?? [];
    return new Set(items.map((a) => a.productFranchiseId));
  }, [selectedCategoryFranchiseId, assignmentsByCat]);

  // Assignments for the sidebar selection (to find record.id for removal)
  const sidebarAssignments = useMemo(() => {
    if (!selectedCategoryFranchiseId) return [] as ProductCategoryFranchise[];
    return assignmentsByCat.get(selectedCategoryFranchiseId) ?? [];
  }, [selectedCategoryFranchiseId, assignmentsByCat]);

  // ── Products (for images) ─────────────────────────────────────────────────
  const { data: allProducts = [] } = useProductsQuery({
    searchCondition: {
      keyword: "",
      min_price: "",
      max_price: "",
      is_active: "",
      is_deleted: false,
    },
    pageInfo: { pageNum: 1, pageSize: 1000 },
  });

  // Map: productId (string) → imageUrl
  const productImageMap = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const p of allProducts) {
      map.set(String(p.id), p.imageUrl ?? null);
    }
    return map;
  }, [allProducts]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addMutation = useAddProductToCategoryFranchise();
  const removeMutation = useDeleteProductCategoryFranchise();
  const addCategoryMutation = useAddCategoryToFranchise();

  // ── All categories (for the add-category dialog) ──────────────────────────
  const { data: allCategories = [] } = useCategoriesQuery({
    searchCondition: { keyword: "", is_active: true, is_deleted: false },
    pageInfo: { pageNum: 1, pageSize: 1000 },
  });

  const existingCategoryIds = useMemo(
    () => new Set(categoryFranchises.map((c) => c.categoryId)),
    [categoryFranchises],
  );

  const availableCategories = useMemo(() => {
    const kw = dialogCategorySearch.toLowerCase().trim();
    return allCategories.filter(
      (c) =>
        !existingCategoryIds.has(String(c.id)) &&
        (!kw || c.name.toLowerCase().includes(kw)),
    );
  }, [allCategories, existingCategoryIds, dialogCategorySearch]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const selectedCategory = categoryFranchises.find(
    (c) => c.id === selectedCategoryFranchiseId,
  );

  // Products filtered by: active tab + search
  const filteredProducts = useMemo(() => {
    let list = productFranchises;

    // Tab filter: only show products assigned to the active tab category
    if (tabProductIds) {
      list = list.filter((p) => tabProductIds.has(String(p.id)));
    }

    // Text search
    const kw = productSearch.toLowerCase().trim();
    if (kw) {
      list = list.filter(
        (p) =>
          p.productName?.toLowerCase().includes(kw) ||
          p.productSku?.toLowerCase().includes(kw),
      );
    }

    return list;
  }, [productFranchises, tabProductIds, productSearch]);

  // Categories filtered by sidebar search
  const filteredCategories = useMemo(() => {
    const kw = categorySearch.toLowerCase().trim();
    if (!kw) return categoryFranchises;
    return categoryFranchises.filter((c) =>
      c.categoryName.toLowerCase().includes(kw),
    );
  }, [categoryFranchises, categorySearch]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleProductClick = useCallback(
    (pid: string) => {
      if (!selectedCategoryFranchiseId) {
        setShowNoCategoryWarning(true);
        setTimeout(() => setShowNoCategoryWarning(false), 2500);
        return;
      }
      // Already assigned to the sidebar category → skip
      if (sidebarAssignedIds.has(pid)) return;

      setSelectedProductIds((prev) => {
        const next = new Set(prev);
        if (next.has(pid)) next.delete(pid);
        else next.add(pid);
        return next;
      });
    },
    [selectedCategoryFranchiseId, sidebarAssignedIds],
  );

  const handleSelectCategory = useCallback((catId: string) => {
    setSelectedCategoryFranchiseId((prev) => (prev === catId ? null : catId));
    setSelectedProductIds(new Set());
    setShowNoCategoryWarning(false);
  }, []);

  const handleAssign = async () => {
    if (!selectedCategoryFranchiseId) {
      toast.error("Please select a category first.");
      return;
    }
    if (selectedProductIds.size === 0) {
      toast.error("Please select at least one product.");
      return;
    }

    const ids = Array.from(selectedProductIds);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < ids.length; i++) {
      try {
        await addMutation.mutateAsync({
          categoryFranchiseId: selectedCategoryFranchiseId,
          productFranchiseId: ids[i],
          displayOrder: (sidebarAssignments.length || 0) + i + 1,
        });
        successCount++;
      } catch {
        failCount++;
      }
    }

    if (successCount > 0)
      toast.success(
        `Assigned ${successCount} product(s) to "${selectedCategory?.categoryName}".`,
      );
    if (failCount > 0) toast.error(`Failed to assign ${failCount} product(s).`);

    setSelectedProductIds(new Set());
  };

  const handleRemoveAssignment = (
    assignmentId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    removeMutation.mutate(assignmentId);
  };

  const handleAddCategoryConfirm = async () => {
    if (!dialogCategoryId || dialogCategoryId === "undefined" || !franchiseId)
      return;
    await addCategoryMutation.mutateAsync({
      franchiseId,
      categoryId: dialogCategoryId,
      displayOrder: categoryFranchises.length + 1,
    });
    setShowAddCategoryDialog(false);
    setDialogCategoryId("");
    setDialogCategorySearch("");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-[#F5F0EB]">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-6 py-3 bg-white border-b border-[#E8DFD6]">
        <Link
          to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}/${franchiseId}`}
          className="flex items-center gap-1.5 text-sm font-medium text-[#5D4037] hover:text-[#3E2723] transition-colors px-3 py-1.5 rounded-full border border-[#D7CCC8] hover:border-[#6D4C41] bg-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <div className="h-5 w-px bg-[#D7CCC8]" />

        <span className="text-sm font-semibold text-[#3E2723] uppercase tracking-wide">
          {franchise?.name ?? "Franchise"}
        </span>

        {/* Product search */}
        <div className="flex-1 max-w-sm ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D4037]/50" />
          <Input
            placeholder="Search menu items..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="pl-9 bg-[#F5F0EB] border-[#E8DFD6] focus-visible:ring-[#6D4C41] rounded-full text-sm"
          />
        </div>
      </div>

      {/* ── Body: main + sidebar ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* ── MAIN AREA ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Category filter tabs */}
          <div className="shrink-0 flex items-center gap-2 px-6 pt-4 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTabId(null)}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border cursor-pointer",
                !activeTabId
                  ? "bg-[#6D4C41] text-white border-[#6D4C41] shadow-md"
                  : "bg-white text-[#5D4037] border-[#D7CCC8] hover:border-[#6D4C41]",
              ].join(" ")}
            >
              All
            </button>
            {categoryFranchises.map((cat) => {
              const count = productCountByCat.get(cat.id) ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveTabId((prev) => (prev === cat.id ? null : cat.id))
                  }
                  className={[
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border cursor-pointer",
                    activeTabId === cat.id
                      ? "bg-[#6D4C41] text-white border-[#6D4C41] shadow-md"
                      : "bg-white text-[#5D4037] border-[#D7CCC8] hover:border-[#6D4C41]",
                  ].join(" ")}
                >
                  {cat.categoryName}
                  {count > 0 && (
                    <span className="ml-1.5 text-[11px] opacity-80">
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto px-6 py-4 relative">
            {/* "No category selected" overlay warning */}
            {showNoCategoryWarning && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-white rounded-2xl shadow-xl border border-[#E8DFD6] px-8 py-5 text-center max-w-xs">
                  <p className="font-semibold text-[#3E2723] mb-1">
                    Select a Category
                  </p>
                  <p className="text-sm text-[#5D4037]/80">
                    Please select a category on the sidebar before choosing a
                    product.
                  </p>
                </div>
              </div>
            )}

            {productsLoading || assignmentsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-3/4 rounded-2xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-[#5D4037]/60">
                <PackageSearch className="h-12 w-12 mb-3 opacity-40" />
                <p className="text-sm">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => {
                  const pid = String(product.id);
                  const isAssigned = sidebarAssignedIds.has(pid);
                  const isSelected = selectedProductIds.has(pid);
                  const assignmentRecord = isAssigned
                    ? sidebarAssignments.find(
                        (a) => a.productFranchiseId === pid,
                      )
                    : undefined;
                  // Resolve image: prefer join field, fall back to product map
                  const imageUrl =
                    product.productImageUrl ||
                    productImageMap.get(String(product.productId)) ||
                    null;

                  return (
                    <div
                      key={pid}
                      onClick={() => handleProductClick(pid)}
                      className={[
                        "relative flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-200 group",
                        isAssigned
                          ? "border-green-400 bg-white opacity-80 cursor-default"
                          : !selectedCategoryFranchiseId
                            ? "border-[#E8DFD6] bg-white cursor-pointer hover:border-[#A1887F]"
                            : isSelected
                              ? "border-[#6D4C41] bg-[#FDF0E8] cursor-pointer shadow-lg scale-[1.02]"
                              : "border-[#E8DFD6] bg-white cursor-pointer hover:border-[#6D4C41] hover:shadow-md",
                      ].join(" ")}
                    >
                      {/* Image area */}
                      <div className="relative aspect-square bg-[#F5F0EB] overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.productName ?? ""}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#A1887F]">
                            <PackageSearch className="h-10 w-10 opacity-50" />
                          </div>
                        )}

                        {/* Selection checkmark overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#6D4C41]/20 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-[#6D4C41] flex items-center justify-center shadow">
                              <svg
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* Assigned badge */}
                        {isAssigned && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0.5">
                              Assigned
                            </Badge>
                          </div>
                        )}

                        {/* Remove assignment button (hover) */}
                        {isAssigned && assignmentRecord && (
                          <button
                            onClick={(e) =>
                              handleRemoveAssignment(assignmentRecord.id, e)
                            }
                            disabled={removeMutation.isPending}
                            className="absolute top-2 left-2 h-6 w-6 rounded-full bg-white/90 border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer disabled:opacity-40"
                            title="Remove from category"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-[#3E2723] truncate leading-tight">
                          {product.productName ?? "Unnamed"}
                        </p>
                        <p className="text-xs text-[#6D4C41] font-medium mt-0.5">
                          {product.priceBase != null
                            ? `${product.priceBase.toLocaleString("vi-VN")}đ`
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ──────────────────────────────────────────────── */}
        <div className="w-72 shrink-0 bg-white border-l border-[#E8DFD6] flex flex-col">
          {/* Sidebar header */}
          <div className="shrink-0 px-5 pt-5 pb-3 border-b border-[#E8DFD6]">
            <h3 className="text-base font-bold text-[#3E2723]">Categories</h3>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5D4037]/50" />
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-8 text-sm h-8 bg-[#F5F0EB] border-[#E8DFD6] focus-visible:ring-[#6D4C41] rounded-lg"
              />
            </div>
          </div>

          {/* Category list */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            <p className="text-[10px] font-semibold text-[#A1887F] uppercase tracking-wider px-2 mb-2">
              Select to assign
            </p>

            {categoriesLoading ? (
              <div className="space-y-2 px-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <p className="text-xs text-[#5D4037]/60 px-2 py-4 text-center">
                No categories found.
              </p>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = selectedCategoryFranchiseId === cat.id;
                const count = productCountByCat.get(cat.id) ?? 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={[
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#6D4C41]/10 border border-[#6D4C41]/30"
                        : "hover:bg-[#F5F0EB] border border-transparent",
                    ].join(" ")}
                  >
                    {/* Radio indicator */}
                    <div
                      className={[
                        "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        isSelected ? "border-[#6D4C41]" : "border-[#A1887F]/60",
                      ].join(" ")}
                    >
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-[#6D4C41]" />
                      )}
                    </div>

                    <span
                      className={[
                        "flex-1 text-sm font-medium truncate",
                        isSelected ? "text-[#3E2723]" : "text-[#5D4037]",
                      ].join(" ")}
                    >
                      {cat.categoryName}
                    </span>

                    <span
                      className={[
                        "text-[11px] shrink-0 tabular-nums",
                        isSelected ? "text-[#6D4C41]" : "text-[#A1887F]",
                      ].join(" ")}
                    >
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </button>
                );
              })
            )}

            {/* Add new category button */}
            <button
              onClick={() => {
                setDialogCategoryId("");
                setDialogCategorySearch("");
                setShowAddCategoryDialog(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#6D4C41] hover:bg-[#F5F0EB] transition-all border border-dashed border-[#D7CCC8] hover:border-[#6D4C41] mt-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add New Category
            </button>
          </div>

          {/* ── Bottom: Assign action ──────────────────────────────────── */}
          <div className="shrink-0 border-t border-[#E8DFD6] p-4 space-y-3">
            {!selectedCategoryFranchiseId ? (
              <p className="flex items-center gap-1.5 text-xs text-[#A1887F]">
                <ChevronLeft className="h-3.5 w-3.5" />
                Select a category first
              </p>
            ) : selectedProductIds.size > 0 ? (
              <p className="text-xs text-[#6D4C41]">
                <span className="font-semibold">{selectedProductIds.size}</span>{" "}
                product(s) selected → {selectedCategory?.categoryName}
              </p>
            ) : (
              <p className="text-xs text-[#A1887F]">
                Now select products from the grid.
              </p>
            )}

            <Button
              onClick={handleAssign}
              disabled={
                !selectedCategoryFranchiseId ||
                selectedProductIds.size === 0 ||
                addMutation.isPending
              }
              className="w-full bg-[#3E2723] hover:bg-[#5D4037] text-white rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-40 cursor-pointer"
            >
              {addMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Assign to Product
            </Button>

            <p className="text-[10px] text-[#A1887F] text-center leading-tight">
              Selected products will be updated with these categories.
            </p>
          </div>
        </div>
      </div>

      {/* ── Add Category Dialog ─────────────────────────────────────────── */}
      {showAddCategoryDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowAddCategoryDialog(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-[#E8DFD6] w-full max-w-sm mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#3E2723]">
                Add Category to Franchise
              </h3>
              <button
                onClick={() => setShowAddCategoryDialog(false)}
                className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#F5F0EB] text-[#5D4037] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5D4037]/50" />
              <Input
                placeholder="Search categories..."
                value={dialogCategorySearch}
                onChange={(e) => setDialogCategorySearch(e.target.value)}
                className="pl-8 text-sm h-8 bg-[#F5F0EB] border-[#E8DFD6] focus-visible:ring-[#6D4C41] rounded-lg"
                autoFocus
              />
            </div>

            {/* Category list */}
            <div className="max-h-56 overflow-y-auto space-y-1 mb-4">
              {availableCategories.length === 0 ? (
                <p className="text-xs text-[#5D4037]/60 text-center py-6">
                  {allCategories.length === 0
                    ? "Loading..."
                    : "All categories already added."}
                </p>
              ) : (
                availableCategories.map((cat) => {
                  const catId = String(cat.id);
                  const isChecked = dialogCategoryId === catId;
                  return (
                    <button
                      key={catId}
                      onClick={() => setDialogCategoryId(catId)}
                      className={[
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer",
                        isChecked
                          ? "bg-[#6D4C41]/10 border border-[#6D4C41]/30"
                          : "hover:bg-[#F5F0EB] border border-transparent",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          isChecked
                            ? "border-[#6D4C41]"
                            : "border-[#A1887F]/60",
                        ].join(" ")}
                      >
                        {isChecked && (
                          <div className="h-2 w-2 rounded-full bg-[#6D4C41]" />
                        )}
                      </div>
                      <span className="text-sm text-[#3E2723] truncate">
                        {cat.name}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-[#D7CCC8] text-[#5D4037] hover:bg-[#F5F0EB] rounded-xl cursor-pointer"
                onClick={() => setShowAddCategoryDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#3E2723] hover:bg-[#5D4037] text-white rounded-xl cursor-pointer disabled:opacity-40"
                disabled={!dialogCategoryId || addCategoryMutation.isPending}
                onClick={handleAddCategoryConfirm}
              >
                {addCategoryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : null}
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseProductAssign;
