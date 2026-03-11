import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  PackageSearch,
  Loader2,
  Plus,
  X,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useAddCategoryToFranchise } from "@/hooks/category-franchise/useCategoryFranchise";
import { useQuery } from "@tanstack/react-query";
import { useFranchise } from "@/hooks/franchise";
import { useCategoriesQuery } from "@/hooks/category/useCategoryQuery";
import { useProductsQuery } from "@/hooks/product/useProductQuery";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import type { ProductCategoryFranchise } from "@/api/product-category-franchise/product-category-franchise.api";

const FranchiseProductAssign = () => {
  const { id: franchiseId } = useParams<{ id: string }>();

  const [productSearch, setProductSearch] = useState("");
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );

  // Assign dialog
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignCategoryId, setAssignCategoryId] = useState("");
  const [assignCategorySearch, setAssignCategorySearch] = useState("");

  // Add category dialog
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [dialogCategoryId, setDialogCategoryId] = useState("");
  const [dialogCategorySearch, setDialogCategorySearch] = useState("");

  // Franchise info
  const { data: franchise } = useFranchise(franchiseId ?? "", {
    enabled: !!franchiseId,
  });

  // Product franchises (all products for this franchise) 
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

  // Category franchises (all categories for this franchise)
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

  // ALL product-category-franchise assignments (single master query)
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

  const {
    data: allAssignments = [],
    isLoading: assignmentsLoading,
  } = useProductCategoryFranchisesQuery(allAssignmentsParams, !!franchiseId);

  // Derived maps from allAssignments 
  // Map: categoryFranchiseId â†’ assignment[]
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

  // Map: categoryFranchiseId â†’ count of products
  const productCountByCat = useMemo(() => {
    const map = new Map<string, number>();
    for (const [catId, items] of assignmentsByCat) {
      map.set(catId, items.length);
    }
    return map;
  }, [assignmentsByCat]);

  // Set of productFranchiseIds for the ACTIVE TAB (table filtering)
  const tabProductIds = useMemo(() => {
    if (!activeTabId) return null;
    const items = assignmentsByCat.get(activeTabId) ?? [];
    return new Set(items.map((a) => a.productFranchiseId));
  }, [activeTabId, assignmentsByCat]);

  // Map: productFranchiseId â†’ list of { catFranchise, assignmentId }
  const productCategoryMap = useMemo(() => {
    const map = new Map<
      string,
      Array<{ catFranchise: SearchCategoryFranchise; assignmentId: string }>
    >();
    for (const [catFranchiseId, assignments] of assignmentsByCat) {
      const catFranchise = categoryFranchises.find(
        (c) => c.id === catFranchiseId,
      );
      if (!catFranchise) continue;
      for (const a of assignments) {
        const pid = a.productFranchiseId;
        const existing = map.get(pid) ?? [];
        existing.push({ catFranchise, assignmentId: a.id });
        map.set(pid, existing);
      }
    }
    return map;
  }, [assignmentsByCat, categoryFranchises]);

  // Products (for images)
  const { data: allProducts = [] } = useProductsQuery({
    searchCondition: { keyword: "", min_price: "", max_price: "", is_active: "", is_deleted: false },
    pageInfo: { pageNum: 1, pageSize: 1000 },
  });

  // Map: productId (string) â†’ imageUrl
  const productImageMap = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const p of allProducts) {
      map.set(String(p.id), p.imageUrl ?? null);
    }
    return map;
  }, [allProducts]);

  // Mutations
  const addMutation = useAddProductToCategoryFranchise();
  const removeMutation = useDeleteProductCategoryFranchise();
  const addCategoryMutation = useAddCategoryToFranchise();

  // All categories (for the add-category dialog)
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

  // Filtered categories for the assign dialog
  const filteredAssignCategories = useMemo(() => {
    const kw = assignCategorySearch.toLowerCase().trim();
    if (!kw) return categoryFranchises;
    return categoryFranchises.filter((c) =>
      c.categoryName.toLowerCase().includes(kw),
    );
  }, [categoryFranchises, assignCategorySearch]);

  // Derived data

  // Products filtered by: active tab + search
  const filteredProducts = useMemo(() => {
    let list = productFranchises;

    // Tab filter
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

  // "Select all" checkbox state for current filtered list
  const allFilteredSelected = useMemo(
    () =>
      filteredProducts.length > 0 &&
      filteredProducts.every((p) => selectedProductIds.has(String(p.id))),
    [filteredProducts, selectedProductIds],
  );

  // Handlers
  const handleToggleProduct = useCallback((pid: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(pid)) next.delete(pid);
      else next.add(pid);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = filteredProducts.map((p) => String(p.id));
    setSelectedProductIds((prev) => {
      if (allIds.every((id) => prev.has(id))) {
        const next = new Set(prev);
        allIds.forEach((id) => next.delete(id));
        return next;
      } else {
        const next = new Set(prev);
        allIds.forEach((id) => next.add(id));
        return next;
      }
    });
  }, [filteredProducts]);

  const handleAssign = async () => {
    if (!assignCategoryId) {
      toast.error("Please select a category.");
      return;
    }
    if (selectedProductIds.size === 0) {
      toast.error("Please select at least one product.");
      return;
    }

    // Skip products already assigned to this category
    const existingInCat = new Set(
      (assignmentsByCat.get(assignCategoryId) ?? []).map(
        (a) => a.productFranchiseId,
      ),
    );
    const ids = Array.from(selectedProductIds).filter(
      (id) => !existingInCat.has(id),
    );

    if (ids.length === 0) {
      toast.info(
        "All selected products are already assigned to this category.",
      );
      return;
    }

    const existingCount = (assignmentsByCat.get(assignCategoryId) ?? []).length;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < ids.length; i++) {
      try {
        await addMutation.mutateAsync({
          categoryFranchiseId: assignCategoryId,
          productFranchiseId: ids[i],
          displayOrder: existingCount + i + 1,
        });
        successCount++;
      } catch {
        failCount++;
      }
    }

    const catName = categoryFranchises.find(
      (c) => c.id === assignCategoryId,
    )?.categoryName;
    if (successCount > 0)
      toast.success(`Assigned ${successCount} product(s) to "${catName}".`);
    if (failCount > 0) toast.error(`Failed to assign ${failCount} product(s).`);

    setSelectedProductIds(new Set());
    setShowAssignDialog(false);
    setAssignCategoryId("");
    setAssignCategorySearch("");
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

  const isLoading = productsLoading || assignmentsLoading;

  return (
    <div className="h-full flex flex-col bg-[#F5F0EB]">
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

        {/* Assign to Category button */}
        <Button
          onClick={() => {
            setAssignCategoryId("");
            setAssignCategorySearch("");
            setShowAssignDialog(true);
          }}
          disabled={selectedProductIds.size === 0}
          className="flex items-center gap-2 bg-[#3E2723] hover:bg-[#5D4037] text-white rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40 cursor-pointer"
        >
          <Tag className="h-4 w-4" />
          Assign to Category
          {selectedProductIds.size > 0 && (
            <span className="ml-1 bg-white/25 rounded-full px-1.5 py-0.5 text-xs font-semibold">
              {selectedProductIds.size}
            </span>
          )}
        </Button>
      </div>

      {/* Category filter tabs */}
      <div className="shrink-0 flex items-center gap-2 px-6 pt-3 pb-3 bg-white border-b border-[#E8DFD6] overflow-x-auto">
        <button
          onClick={() => setActiveTabId(null)}
          className={[
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border cursor-pointer",
            !activeTabId
              ? "bg-[#6D4C41] text-white border-[#6D4C41] shadow-md"
              : "bg-[#F5F0EB] text-[#5D4037] border-[#D7CCC8] hover:border-[#6D4C41]",
          ].join(" ")}
        >
          All
        </button>

        {categoriesLoading ? (
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        ) : (
          categoryFranchises.map((cat) => {
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
                    : "bg-[#F5F0EB] text-[#5D4037] border-[#D7CCC8] hover:border-[#6D4C41]",
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
          })
        )}

        {/* Add category to franchise */}
        <button
          onClick={() => {
            setDialogCategoryId("");
            setDialogCategorySearch("");
            setShowAddCategoryDialog(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-[#6D4C41] hover:bg-[#F5F0EB] border border-dashed border-[#D7CCC8] hover:border-[#6D4C41] transition-all whitespace-nowrap cursor-pointer ml-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
      </div>

      {/* Product table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-100 last:border-0"
              >
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#5D4037]/60">
            <PackageSearch className="h-12 w-12 mb-3 opacity-40" />
            <p className="text-sm">No products found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 accent-[#6D4C41] cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const pid = String(product.id);
                  const isSelected = selectedProductIds.has(pid);
                  const categories = productCategoryMap.get(pid) ?? [];
                  const imageUrl =
                    product.productImageUrl ||
                    productImageMap.get(String(product.productId)) ||
                    null;

                  return (
                    <tr
                      key={pid}
                      onClick={() => handleToggleProduct(pid)}
                      className={[
                        "transition-colors cursor-pointer select-none",
                        isSelected
                          ? "bg-[#FDF0E8]"
                          : "bg-white hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {/* Checkbox */}
                      <td
                        className="px-4 py-3.5 w-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleProduct(pid)}
                          className="rounded border-gray-300 accent-[#6D4C41] cursor-pointer"
                        />
                      </td>

                      {/* Image + Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.productName ?? ""}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <PackageSearch className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-gray-800">
                            {product.productName ?? "Unnamed"}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 text-gray-600 font-medium whitespace-nowrap">
                        {product.priceBase != null
                          ? `${product.priceBase.toLocaleString("vi-VN")}đ`
                          : <span className="text-gray-400">—</span>}
                      </td>

                      {/* Categories */}
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {categories.length === 0 ? (
                            <span className="text-xs text-gray-400 italic">
                              Not assigned
                            </span>
                          ) : (
                            categories.map(({ catFranchise, assignmentId }) => (
                              <span
                                key={assignmentId}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#6D4C41]/10 text-[#6D4C41] border border-[#6D4C41]/15 whitespace-nowrap"
                              >
                                {catFranchise.categoryName}
                                <button
                                  onClick={(e) =>
                                    handleRemoveAssignment(assignmentId, e)
                                  }
                                  disabled={removeMutation.isPending}
                                  className="hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer ml-0.5"
                                  title="Remove from this category"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating selection bar */}
      {selectedProductIds.size > 0 && (
        <div className="shrink-0 border-t border-[#E8DFD6] bg-white px-6 py-3 flex items-center gap-3">
          <span className="text-sm text-[#5D4037]">
            <span className="font-semibold text-[#3E2723]">
              {selectedProductIds.size}
            </span>{" "}
            product(s) selected
          </span>
          <button
            onClick={() => setSelectedProductIds(new Set())}
            className="text-xs text-[#A1887F] hover:text-[#5D4037] transition-colors cursor-pointer underline"
          >
            Clear
          </button>
          <div className="flex-1" />
          <Button
            onClick={() => {
              setAssignCategoryId("");
              setAssignCategorySearch("");
              setShowAssignDialog(true);
            }}
            className="bg-[#3E2723] hover:bg-[#5D4037] text-white rounded-xl px-5 text-sm font-medium cursor-pointer"
          >
            <Tag className="h-4 w-4 mr-2" />
            Assign to Category
          </Button>
        </div>
      )}

      {/* Assign Category Dialog */}
      {showAssignDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowAssignDialog(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-[#E8DFD6] w-full max-w-md mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-[#3E2723]">
                Assign to Category
              </h3>
              <button
                onClick={() => setShowAssignDialog(false)}
                className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#F5F0EB] text-[#5D4037] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#A1887F] mb-4">
              Assigning{" "}
              <span className="font-semibold text-[#6D4C41]">
                {selectedProductIds.size}
              </span>{" "}
              selected product(s) to:
            </p>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5D4037]/50" />
              <Input
                placeholder="Search categories..."
                value={assignCategorySearch}
                onChange={(e) => setAssignCategorySearch(e.target.value)}
                className="pl-8 text-sm h-8 bg-[#F5F0EB] border-[#E8DFD6] focus-visible:ring-[#6D4C41] rounded-lg"
                autoFocus
              />
            </div>

            {/* Category list */}
            <div className="max-h-56 overflow-y-auto space-y-1 mb-4">
              {filteredAssignCategories.length === 0 ? (
                <p className="text-xs text-[#5D4037]/60 text-center py-6">
                  No categories found.
                </p>
              ) : (
                filteredAssignCategories.map((cat) => {
                  const isChecked = assignCategoryId === cat.id;
                  const count = productCountByCat.get(cat.id) ?? 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setAssignCategoryId(cat.id)}
                      className={[
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer",
                        isChecked
                          ? "bg-[#6D4C41]/10 border border-[#6D4C41]/30"
                          : "hover:bg-[#F5F0EB] border border-transparent",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          isChecked ? "border-[#6D4C41]" : "border-[#A1887F]/60",
                        ].join(" ")}
                      >
                        {isChecked && (
                          <div className="h-2 w-2 rounded-full bg-[#6D4C41]" />
                        )}
                      </div>
                      <span
                        className={[
                          "flex-1 text-sm font-medium truncate",
                          isChecked ? "text-[#3E2723]" : "text-[#5D4037]",
                        ].join(" ")}
                      >
                        {cat.categoryName}
                      </span>
                      <span className="text-[11px] text-[#A1887F] shrink-0 tabular-nums">
                        {count} {count === 1 ? "item" : "items"}
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
                onClick={() => setShowAssignDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#3E2723] hover:bg-[#5D4037] text-white rounded-xl cursor-pointer disabled:opacity-40"
                disabled={!assignCategoryId || addMutation.isPending}
                onClick={handleAssign}
              >
                {addMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : null}
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Dialog */}
      {showAddCategoryDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowAddCategoryDialog(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-[#E8DFD6] w-full max-w-sm mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
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
                          isChecked ? "border-[#6D4C41]" : "border-[#A1887F]/60",
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
