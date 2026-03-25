import type { PosCategoryTab } from "../types";

interface PosCategoryTabsProps {
  categories: PosCategoryTab[];
  activeCategoryId: string;
  onChange: (categoryId: string) => void;
}

export const PosCategoryTabs = ({
  categories,
  activeCategoryId,
  onChange,
}: PosCategoryTabsProps) => {
  if (!categories.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-6 text-sm text-[#8D6E63]">
        No main-product categories are available for this franchise.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={
              isActive
                ? "rounded-full bg-[#6D4C41] px-4 py-2 text-sm font-medium text-white shadow-sm"
                : "rounded-full border border-[#E8DFD6] bg-white px-4 py-2 text-sm font-medium text-[#5D4037] transition-colors hover:border-[#C8B7A7] hover:bg-[#FAF8F5]"
            }
          >
            {category.name}
            <span
              className={
                isActive
                  ? "ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs"
                  : "ml-2 rounded-full bg-[#FAF1E8] px-2 py-0.5 text-xs text-[#8D6E63]"
              }
            >
              {category.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
