import { X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";

interface AssignCategoryDialogProps {
  open: boolean;
  assignCategorySearch: string;
  onAssignCategorySearchChange: (value: string) => void;
  filteredAssignCategories: SearchCategoryFranchise[];
  assignCategoryId: string;
  onAssignCategoryIdChange: (id: string) => void;
  productCountByCat: Map<string, number>;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

const AssignCategoryDialog = ({
  open,
  assignCategorySearch,
  onAssignCategorySearchChange,
  filteredAssignCategories,
  assignCategoryId,
  onAssignCategoryIdChange,
  productCountByCat,
  onCancel,
  onConfirm,
  isPending,
}: AssignCategoryDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onCancel}
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
            onClick={onCancel}
            className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#F5F0EB] text-[#5D4037] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-[#A1887F] mb-4">
          Assign this product to:
        </p>

        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5D4037]/50" />
          <Input
            placeholder="Search categories..."
            value={assignCategorySearch}
            onChange={(e) => onAssignCategorySearchChange(e.target.value)}
            className="pl-8 text-sm h-8 bg-[#F5F0EB] border-[#E8DFD6] focus-visible:ring-[#6D4C41] rounded-lg"
            autoFocus
          />
        </div>

        <div className="max-h-56 overflow-y-auto scrollbar-hide space-y-1 mb-4">
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
                  onClick={() => onAssignCategoryIdChange(cat.id)}
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-[#D7CCC8] text-[#5D4037] hover:bg-[#F5F0EB] rounded-xl cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#3E2723] hover:bg-[#5D4037] text-white rounded-xl cursor-pointer disabled:opacity-40"
            disabled={!assignCategoryId || isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignCategoryDialog;
