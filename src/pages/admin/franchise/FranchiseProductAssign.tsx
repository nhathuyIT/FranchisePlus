import { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useAddProductToCategoryFranchise,
  useDeleteProductCategoryFranchise,
} from "@/hooks/product-category-franchise/useProductCategoryFranchise";
import { useFranchiseProductAssignData } from "@/hooks/product-category-franchise/useFranchiseProductAssignData";
import { useAddCategoryToFranchise } from "@/hooks/admin/useCategoryFranchise.hook";
import { useDebounce } from "@/hooks/common/useDebounce";
import PageHeader from "./components/product-assign/PageHeader";
import CategoryFilterTabs from "./components/product-assign/CategoryFilterTabs";
import ProductTable from "./components/product-assign/ProductTable";
import AssignCategoryDialog from "./components/product-assign/AssignCategoryDialog";
import AddCategoryDialog from "./components/product-assign/AddCategoryDialog";

// Pure utility — no component deps, no need for useCallback
const formatSizeLabel = (size?: string | null) => (size ? size.replaceAll("_", " ") : "-");

const FranchiseProductAssign = () => {
  const { id: franchiseId } = useParams<{ id: string }>();

  // ── UI state ────────────────────────────────────────────────────────────────
  const [productSearch, setProductSearch] = useState("");
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [assignmentView, setAssignmentView] = useState<"unassigned" | "assigned">("unassigned");
  const [selectedProductId, setSelectedProductId] = useState("");

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignCategoryId, setAssignCategoryId] = useState("");
  const [assignCategorySearch, setAssignCategorySearch] = useState("");

  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [dialogCategoryId, setDialogCategoryId] = useState("");
  const [dialogCategorySearch, setDialogCategorySearch] = useState("");

  const debouncedProductSearch = useDebounce(productSearch, 300, productSearch);
  const debouncedAssignCategorySearch = useDebounce(assignCategorySearch, 300, assignCategorySearch);
  const debouncedDialogCategorySearch = useDebounce(dialogCategorySearch, 300, dialogCategorySearch);

  // ── Data (all fetching + derived Maps live in the custom hook) ──────────────
  const {
    franchise,
    productsWithCategories,
    isLoading,
    categoryFranchises,
    categoriesLoading,
    categoryFranchiseMap,
    productCategoryMap,
    productCountByCat,
    assignedIdsByCat,
    productImageMap,
    allCategories,
    existingCategoryIds,
  } = useFranchiseProductAssignData(franchiseId);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const addMutation = useAddProductToCategoryFranchise();
  const removeMutation = useDeleteProductCategoryFranchise();
  const addCategoryMutation = useAddCategoryToFranchise();

  // ── Filtered lists (UI-search driven — kept in the component) ───────────────

  const availableCategories = useMemo(() => {
    const kw = debouncedDialogCategorySearch.toLowerCase().trim();
    return allCategories.filter(
      (c) =>
        !existingCategoryIds.has(String(c.id)) &&
        (!kw || c.name.toLowerCase().includes(kw)),
    );
  }, [allCategories, existingCategoryIds, debouncedDialogCategorySearch]);

  const filteredAssignCategories = useMemo(() => {
    const kw = debouncedAssignCategorySearch.toLowerCase().trim();
    if (!kw) return categoryFranchises;
    return categoryFranchises.filter((c) => c.categoryName.toLowerCase().includes(kw));
  }, [categoryFranchises, debouncedAssignCategorySearch]);

  const searchedProducts = useMemo(() => {
    const kw = debouncedProductSearch.toLowerCase().trim();
    if (!kw) return productsWithCategories;
    return productsWithCategories.filter(
      (p) =>
        p.productName?.toLowerCase().includes(kw) ||
        p.productSku?.toLowerCase().includes(kw),
    );
  }, [productsWithCategories, debouncedProductSearch]);

  // Single pass: splits searchedProducts into unassigned / assigned.
  // Tab filtering uses the pre-built assignedIdsByCat Set → O(1) per product
  // instead of p.categories.some(...) → O(k) per product.
  const { unassignedProducts, assignedProducts } = useMemo(() => {
    const unassigned: typeof searchedProducts = [];
    const assigned: typeof searchedProducts = [];
    const tabSet = activeTabId ? assignedIdsByCat.get(activeTabId) : null;

    for (const p of searchedProducts) {
      if (p.categories.length === 0) {
        unassigned.push(p);
      } else if (!tabSet || tabSet.has(p.productFranchiseId)) {
        assigned.push(p);
      }
    }

    return { unassignedProducts: unassigned, assignedProducts: assigned };
  }, [searchedProducts, activeTabId, assignedIdsByCat]);

  // Direct conditional reference — useMemo here would allocate for no gain
  const visibleProducts = assignmentView === "unassigned" ? unassignedProducts : assignedProducts;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleOpenAssignDialog = useCallback((pid: string) => {
    setSelectedProductId(pid);
    setAssignCategoryId("");
    setAssignCategorySearch("");
    setShowAssignDialog(true);
  }, []);

  const handleRemoveAssignment = useCallback(
    (assignmentId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      removeMutation.mutate(assignmentId);
    },
    [removeMutation],
  );

  const handleAssign = async () => {
    if (!assignCategoryId) {
      toast.error("Please select a category.");
      return;
    }

    const existingInCat = assignedIdsByCat.get(assignCategoryId) ?? new Set<string>();
    if (existingInCat.has(selectedProductId)) {
      toast.info("This product is already assigned to this category.");
      return;
    }

    try {
      await addMutation.mutateAsync({
        categoryFranchiseId: assignCategoryId,
        productFranchiseId: selectedProductId,
        displayOrder: existingInCat.size + 1,
      });
      const catName = categoryFranchiseMap.get(assignCategoryId)?.categoryName;
      toast.success(`Assigned to "${catName}".`);
    } catch {
      // onError in the mutation hook already shows the error toast
    }

    setSelectedProductId("");
    setShowAssignDialog(false);
    setAssignCategoryId("");
    setAssignCategorySearch("");
  };

  const handleAddCategoryConfirm = async () => {
    if (!dialogCategoryId || dialogCategoryId === "undefined" || !franchiseId) return;
    await addCategoryMutation.mutateAsync({
      franchiseId,
      categoryId: dialogCategoryId,
      displayOrder: categoryFranchises.length + 1,
    });
    setShowAddCategoryDialog(false);
    setDialogCategoryId("");
    setDialogCategorySearch("");
  };

  return (
    <div className="h-full flex flex-col bg-[#F5F0EB]">
      <PageHeader
        franchiseName={franchise?.name}
        productSearch={productSearch}
        onProductSearchChange={setProductSearch}
      />

      <CategoryFilterTabs
        categoriesLoading={categoriesLoading}
        categoryFranchises={categoryFranchises}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        productCountByCat={productCountByCat}
        onAddCategoryClick={() => {
          setDialogCategoryId("");
          setDialogCategorySearch("");
          setShowAddCategoryDialog(true);
        }}
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4">
        <ProductTable
          isLoading={isLoading}
          searchedProducts={searchedProducts}
          visibleProducts={visibleProducts}
          unassignedProducts={unassignedProducts}
          assignedProducts={assignedProducts}
          assignmentView={assignmentView}
          onAssignmentViewChange={setAssignmentView}
          productCategoryMap={productCategoryMap}
          productImageMap={productImageMap}
          onOpenAssignDialog={handleOpenAssignDialog}
          onRemoveAssignment={handleRemoveAssignment}
          removeMutationIsPending={removeMutation.isPending}
          formatSizeLabel={formatSizeLabel}
        />
      </div>

      <AssignCategoryDialog
        open={showAssignDialog}
        assignCategorySearch={assignCategorySearch}
        onAssignCategorySearchChange={setAssignCategorySearch}
        filteredAssignCategories={filteredAssignCategories}
        assignCategoryId={assignCategoryId}
        onAssignCategoryIdChange={setAssignCategoryId}
        productCountByCat={productCountByCat}
        onCancel={() => {
          setShowAssignDialog(false);
          setSelectedProductId("");
        }}
        onConfirm={handleAssign}
        isPending={addMutation.isPending}
      />

      <AddCategoryDialog
        open={showAddCategoryDialog}
        dialogCategorySearch={dialogCategorySearch}
        onDialogCategorySearchChange={setDialogCategorySearch}
        availableCategories={availableCategories}
        allCategoriesCount={allCategories.length}
        dialogCategoryId={dialogCategoryId}
        onDialogCategoryIdChange={setDialogCategoryId}
        onCancel={() => setShowAddCategoryDialog(false)}
        onConfirm={handleAddCategoryConfirm}
        isPending={addCategoryMutation.isPending}
      />
    </div>
  );
};

export default FranchiseProductAssign;
