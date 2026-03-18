import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";

interface CategoryFilterTabsProps {
  categoriesLoading: boolean;
  categoryFranchises: SearchCategoryFranchise[];
  activeTabId: string | null;
  onTabChange: (id: string | null) => void;
  productCountByCat: Map<string, number>;
  onAddCategoryClick: () => void;
}

const CategoryFilterTabs = ({
  categoriesLoading,
  categoryFranchises,
  activeTabId,
  onTabChange,
  productCountByCat,
  onAddCategoryClick,
}: CategoryFilterTabsProps) => {
  return (
    <div className="shrink-0 flex flex-wrap items-center gap-2 px-6 pt-3 pb-3 bg-white border-b border-[#E8DFD6]">
      <button
        onClick={() => onTabChange(null)}
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
              onClick={() => onTabChange(activeTabId === cat.id ? null : cat.id)}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border cursor-pointer",
                activeTabId === cat.id
                  ? "bg-[#6D4C41] text-white border-[#6D4C41] shadow-md"
                  : "bg-[#F5F0EB] text-[#5D4037] border-[#D7CCC8] hover:border-[#6D4C41]",
              ].join(" ")}
            >
              {cat.categoryName}
              {count > 0 && (
                <span className="ml-1.5 text-[11px] opacity-80">({count})</span>
              )}
            </button>
          );
        })
      )}

      <button
        onClick={onAddCategoryClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-[#6D4C41] hover:bg-[#F5F0EB] border border-dashed border-[#D7CCC8] hover:border-[#6D4C41] transition-all whitespace-nowrap cursor-pointer ml-1"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Category
      </button>
    </div>
  );
};

export default CategoryFilterTabs;
