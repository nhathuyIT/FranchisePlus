import { PackageSearch, Tag, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductRow {
  id: string;
  productId?: string;
  productName?: string;
  productImageUrl?: string | null;
  size?: string | null;
  priceBase?: number | null;
}

export interface CategoryTag {
  categoryName: string;
  assignmentId: string;
}

interface ProductTableProps {
  isLoading: boolean;
  searchedProducts: ProductRow[];
  visibleProducts: ProductRow[];
  unassignedProducts: ProductRow[];
  assignedProducts: ProductRow[];
  assignmentView: "unassigned" | "assigned";
  onAssignmentViewChange: (view: "unassigned" | "assigned") => void;
  productCategoryMap: Map<string, CategoryTag[]>;
  productImageMap: Map<string, string | null>;
  onOpenAssignDialog: (pid: string) => void;
  onRemoveAssignment: (assignmentId: string, e: React.MouseEvent) => void;
  removeMutationIsPending: boolean;
  formatSizeLabel: (size?: string | null) => string;
}

const ProductTable = ({
  isLoading,
  searchedProducts,
  visibleProducts,
  unassignedProducts,
  assignedProducts,
  assignmentView,
  onAssignmentViewChange,
  productCategoryMap,
  productImageMap,
  onOpenAssignDialog,
  onRemoveAssignment,
  removeMutationIsPending,
  formatSizeLabel,
}: ProductTableProps) => {
  if (isLoading) {
    return (
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
    );
  }

  if (searchedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#5D4037]/60">
        <PackageSearch className="h-12 w-12 mb-3 opacity-40" />
        <p className="text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm min-w-0">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-[#F8F3EF] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAssignmentViewChange("unassigned")}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer",
              assignmentView === "unassigned"
                ? "bg-[#6D4C41] text-white border-[#6D4C41]"
                : "bg-white text-[#6D4C41] border-[#D7CCC8] hover:border-[#6D4C41]",
            ].join(" ")}
          >
            Not assigned ({unassignedProducts.length})
          </button>
          <button
            onClick={() => onAssignmentViewChange("assigned")}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer",
              assignmentView === "assigned"
                ? "bg-[#6D4C41] text-white border-[#6D4C41]"
                : "bg-white text-[#6D4C41] border-[#D7CCC8] hover:border-[#6D4C41]",
            ].join(" ")}
          >
            Assigned ({assignedProducts.length})
          </button>
        </div>
        <span className="text-xs font-medium text-[#6D4C41] tabular-nums">
          Showing {visibleProducts.length} item(s)
        </span>
      </div>

      {/* Table or empty state */}
      {visibleProducts.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-gray-400">
          {assignmentView === "unassigned"
            ? "No unassigned products."
            : "No assigned products."}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm min-w-[780px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">
                  {assignmentView === "unassigned" ? "Status" : "Categories"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleProducts.map((product) => {
                const pid = String(product.id);
                const categories = productCategoryMap.get(pid) ?? [];
                const imageUrl =
                  product.productImageUrl ||
                  productImageMap.get(String(product.productId)) ||
                  null;

                return (
                  <tr
                    key={pid}
                    className="transition-colors bg-white hover:bg-gray-50"
                  >
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

                    <td className="px-4 py-3.5 text-gray-600 font-medium whitespace-nowrap uppercase">
                      {formatSizeLabel(product.size)}
                    </td>

                    <td className="px-4 py-3.5 text-gray-600 font-medium whitespace-nowrap">
                      {product.priceBase != null ? (
                        `${product.priceBase.toLocaleString("vi-VN")}đ`
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {assignmentView === "unassigned" ? (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Not assigned
                          </span>
                          <Button
                            size="sm"
                            onClick={() => onOpenAssignDialog(pid)}
                            className="h-7 px-3 bg-[#3E2723] hover:bg-[#5D4037] text-white rounded-lg text-xs"
                          >
                            <Tag className="h-3.5 w-3.5 mr-1" />
                            Assign
                          </Button>
                        </div>
                      </td>
                    ) : (
                      <td
                        className="px-4 py-3.5 max-w-64"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {categories.map(({ categoryName, assignmentId }) => (
                            <span
                              key={assignmentId}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#6D4C41]/10 text-[#6D4C41] border border-[#6D4C41]/15 break-words"
                            >
                              {categoryName}
                              <button
                                onClick={(e) =>
                                  onRemoveAssignment(assignmentId, e)
                                }
                                disabled={removeMutationIsPending}
                                className="hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer ml-0.5"
                                title="Remove from this category"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
