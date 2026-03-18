import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchItemsByConditions } from "@/api/category-franchise/CategoryFranchise.api";
import { useFranchise } from "@/hooks/franchise";
import { useCategoriesQuery } from "@/hooks/category/useCategoryQuery";
import { useProductsQuery } from "@/hooks/product/useProductQuery";
import {
  useProductsByFranchiseWithCategories,
  useProductCategoryFranchisesQuery,
} from "./useProductCategoryFranchise";
import type { CategoryTag } from "@/pages/admin/franchise/components/product-assign/ProductTable";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";

// Stable empty references — avoids reference churn on initial render
const EMPTY_PRODUCTS = [] as never[];
const EMPTY_CATEGORIES = [] as never[];
const EMPTY_ASSIGNMENTS = [] as never[];

/**
 * Aggregates all data fetching and derived-state computation for the
 * FranchiseProductAssign page into a single, focused hook.
 *
 * Consumers get fully computed Maps/Sets ready for O(1) lookup — no
 * additional loops or `.find()` calls required in the component.
 */
export const useFranchiseProductAssignData = (franchiseId: string | undefined) => {
  const enabled = !!franchiseId;
  const fid = franchiseId ?? "";

  // ── Raw queries ────────────────────────────────────────────────────────────

  const { data: franchise } = useFranchise(fid, { enabled });

  const { data: productsWithCategories = EMPTY_PRODUCTS, isLoading } =
    useProductsByFranchiseWithCategories(fid, enabled);

  const categorySearchParams = useMemo(
    () => ({
      searchCondition: {
        franchiseId: fid,
        categoryId: "",
        isActive: "" as const,
        isDeleted: false as const,
      },
      pageInfo: { pageNum: 1, pageSize: 100 },
    }),
    [fid],
  );

  const { data: categoryFranchisesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["category-franchises", "search", categorySearchParams],
    queryFn: () => searchItemsByConditions(categorySearchParams),
    enabled,
  });

  const categoryFranchises: SearchCategoryFranchise[] =
    categoryFranchisesData?.data ?? EMPTY_CATEGORIES;

  const allAssignmentsParams = useMemo(
    () => ({
      searchCondition: { franchiseId: fid, isDeleted: false },
      pageInfo: { pageNum: 1, pageSize: 1000 },
    }),
    [fid],
  );

  const { data: allAssignments = EMPTY_ASSIGNMENTS } =
    useProductCategoryFranchisesQuery(allAssignmentsParams, enabled);

  // Images aren't returned by the /franchise/:id endpoint, so we need this.
  const { data: allProducts = EMPTY_PRODUCTS } = useProductsQuery({
    searchCondition: {
      keyword: "",
      min_price: "",
      max_price: "",
      is_active: "",
      is_deleted: false,
    },
    pageInfo: { pageNum: 1, pageSize: 1000 },
  });

  const { data: allCategories = EMPTY_CATEGORIES } = useCategoriesQuery({
    searchCondition: { keyword: "", is_active: true, is_deleted: false },
    pageInfo: { pageNum: 1, pageSize: 1000 },
  });

  // ── Index maps ─────────────────────────────────────────────────────────────

  /** categoryId → categoryFranchiseId (for correlating new-API data with assignments) */
  const categoryIdToCatFranchiseId = useMemo(() => {
    const map = new Map<string, string>();
    for (const cf of categoryFranchises) map.set(cf.categoryId, cf.id);
    return map;
  }, [categoryFranchises]);

  /** categoryFranchiseId → SearchCategoryFranchise (replaces all `.find()` calls) */
  const categoryFranchiseMap = useMemo(() => {
    const map = new Map<string, SearchCategoryFranchise>();
    for (const cf of categoryFranchises) map.set(cf.id, cf);
    return map;
  }, [categoryFranchises]);

  /** "productFranchiseId|categoryFranchiseId" → assignmentId (for delete button) */
  const assignmentIndex = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of allAssignments) {
      map.set(`${a.productFranchiseId}|${a.categoryFranchiseId}`, a.id);
    }
    return map;
  }, [allAssignments]);

  /** productId → imageUrl (fallback since /franchise/:id omits images) */
  const productImageMap = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const p of allProducts) map.set(String(p.id), p.imageUrl ?? null);
    return map;
  }, [allProducts]);

  // ── Single-pass derived data ───────────────────────────────────────────────
  //
  // One loop over productsWithCategories produces three Maps simultaneously,
  // avoiding repeated iterations that would occur with separate useMemo calls.

  const { productCategoryMap, productCountByCat, assignedIdsByCat } = useMemo(() => {
    const catMap = new Map<string, CategoryTag[]>();
    const countMap = new Map<string, number>();
    const idsByCat = new Map<string, Set<string>>();

    for (const p of productsWithCategories) {
      if (p.categories.length === 0) continue;

      const tags: CategoryTag[] = [];
      for (const cat of p.categories) {
        const catFranchiseId = categoryIdToCatFranchiseId.get(cat.categoryId);
        if (!catFranchiseId) continue;

        countMap.set(catFranchiseId, (countMap.get(catFranchiseId) ?? 0) + 1);

        const set = idsByCat.get(catFranchiseId) ?? new Set<string>();
        set.add(p.productFranchiseId);
        idsByCat.set(catFranchiseId, set);

        const assignmentId = assignmentIndex.get(
          `${p.productFranchiseId}|${catFranchiseId}`,
        );
        if (assignmentId) tags.push({ categoryName: cat.categoryName, assignmentId });
      }

      if (tags.length > 0) catMap.set(p.productFranchiseId, tags);
    }

    return { productCategoryMap: catMap, productCountByCat: countMap, assignedIdsByCat: idsByCat };
  }, [productsWithCategories, categoryIdToCatFranchiseId, assignmentIndex]);

  /** Category IDs already added to this franchise (for add-category dialog filtering) */
  const existingCategoryIds = useMemo(
    () => new Set(categoryFranchises.map((c) => c.categoryId)),
    [categoryFranchises],
  );

  return {
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
  };
};
