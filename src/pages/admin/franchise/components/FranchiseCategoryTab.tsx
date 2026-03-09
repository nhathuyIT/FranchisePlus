import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ICONS } from "./franchise-icons";
import { FlatIcon } from "./FlatIcon";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchItemsByConditions } from "@/api/category-franchise/CategoryFranchise.api";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import { ViewModal } from "./ViewModal";
import { UpdateModal } from "./UpdateModal";
import { DeleteModal } from "./DeleteModal";
import { CreateModal } from "./CreateModal";
import { CategoryRow } from "./CategoryRow";

// ── Individual Row Component ───────────────────────────────────────────────

// ── Main Component ─────────────────────────────────────────────────────────

interface FranchiseCategoryTabProps {
  franchiseId: string;
  franchiseName?: string;
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const FranchiseCategoryTab = ({
  franchiseId,
  franchiseName,
  createOpen = false,
  onCreateOpenChange,
}: FranchiseCategoryTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewCategory, setViewCategory] =
    useState<SearchCategoryFranchise | null>(null);
  const [updateCategory, setUpdateCategory] =
    useState<SearchCategoryFranchise | null>(null);
  const [deleteCategory, setDeleteCategory] =
    useState<SearchCategoryFranchise | null>(null);

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category-franchise", "search", franchiseId],
    queryFn: () =>
      searchItemsByConditions({
        searchCondition: { franchiseId, isDeleted: false },
        pageInfo: { pageNum: 1, pageSize: 100 },
      }),
    enabled: !!franchiseId,
    select: (response) => response.data ?? [],
    staleTime: 5 * 60 * 1000,
  });

  const filteredCategories = categories.filter((cat) =>
    (cat.categoryName ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageNum = Math.min(pageNum, totalPages);
  const paginatedCategories = filteredCategories.slice(
    (safePageNum - 1) * pageSize,
    safePageNum * pageSize,
  );

  if (isLoading) {
    return (
      <div className="bg-linear-to-br from-white to-[#FAF8F5] rounded-2xl shadow-lg border border-[#E8DFD6] p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-linear-to-br from-white to-[#FAF8F5] rounded-2xl shadow-lg border border-[#E8DFD6] p-8 text-center">
        <p className="text-[#5D4037] text-lg mb-4">
          Failed to load categories for this franchise.
        </p>
        <Button
          onClick={() => void refetch()}
          className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <ViewModal
        category={viewCategory}
        open={!!viewCategory}
        onClose={() => setViewCategory(null)}
      />
      <UpdateModal
        key={updateCategory?.id}
        category={updateCategory}
        open={!!updateCategory}
        onClose={() => setUpdateCategory(null)}
        onSuccess={() => setUpdateCategory(null)}
      />
      <DeleteModal
        category={deleteCategory}
        open={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onSuccess={() => setDeleteCategory(null)}
      />
      <CreateModal
        franchiseId={franchiseId}
        open={createOpen}
        onClose={() => onCreateOpenChange?.(false)}
        onSuccess={() => onCreateOpenChange?.(false)}
      />

      <div className="bg-linear-to-br from-white to-[#FAF8F5] rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#6D4C41] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
              <FlatIcon
                src={ICONS.category}
                alt="Categories"
                className="h-5 w-5 brightness-0 invert"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#3E2723]">
                Categories
              </h2>
              <p className="text-sm text-[#5D4037]/70">
                {franchiseName
                  ? `Categories assigned to ${franchiseName}`
                  : "Categories assigned to this franchise"}{" "}
                ({categories.length} total)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D4037]/50" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNum(1);
                }}
                className="pl-9 border-[#E8DFD6] focus:border-[#6D4C41] rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => void refetch()}
              className="border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5] rounded-lg shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FlatIcon
              src={ICONS.empty}
              alt="No categories"
              className="h-20 w-20 opacity-50 mb-4"
            />
            <p className="text-lg font-medium text-[#3E2723]">
              {searchTerm ? "No matching categories" : "No categories assigned"}
            </p>
            <p className="text-sm text-[#5D4037]/60 mt-1">
              {searchTerm
                ? "Try adjusting your search term."
                : "This franchise doesn't have any categories yet."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#E8DFD6] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAF8F5] hover:bg-[#FAF8F5]">
                  <TableHead className="text-[#3E2723] font-semibold w-12 text-center">
                    #
                  </TableHead>
                  <TableHead className="text-[#3E2723] font-semibold">
                    <div className="flex items-center gap-2">
                      <FlatIcon
                        src={ICONS.category}
                        alt=""
                        className="h-4 w-4 opacity-60"
                      />
                      Category Name
                    </div>
                  </TableHead>
                  <TableHead className="text-[#3E2723] font-semibold text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <FlatIcon
                        src={ICONS.order}
                        alt=""
                        className="h-4 w-4 opacity-60"
                      />
                      Display Order
                    </div>
                  </TableHead>
                  <TableHead className="text-[#3E2723] font-semibold text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[#3E2723] font-semibold text-center">
                    Actions
                  </TableHead>
                  <TableHead className="text-[#3E2723] font-semibold text-center">
                    Is Deleted
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCategories.map((category, index) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    index={(safePageNum - 1) * pageSize + index + 1}
                    onView={setViewCategory}
                    onUpdate={setUpdateCategory}
                    onDelete={setDeleteCategory}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination footer */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E8DFD6]">
            {/* Left: count info + page size selector */}
            <div className="flex items-center gap-3 text-sm text-[#5D4037]/70">
              <span>
                {(safePageNum - 1) * pageSize + 1}–
                {Math.min(safePageNum * pageSize, totalItems)} of {totalItems}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs">
                  {categories.filter((c) => c.isActive).length} Active
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-xs">
                  {categories.filter((c) => !c.isActive).length} Inactive
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#5D4037]/60">
                  Rows per page:
                </span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setPageNum(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-16 text-xs border-[#E8DFD6]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={String(s)} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right: page navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                onClick={() => setPageNum(1)}
                disabled={safePageNum === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                disabled={safePageNum === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safePageNum) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1 text-[#5D4037]/50 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={safePageNum === p ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 text-sm ${
                        safePageNum === p
                          ? "bg-[#6D4C41] hover:bg-[#5D4037] text-white border-[#6D4C41]"
                          : "border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                      }`}
                      onClick={() => setPageNum(p as number)}
                    >
                      {p}
                    </Button>
                  ),
                )}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
                disabled={safePageNum === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                onClick={() => setPageNum(totalPages)}
                disabled={safePageNum === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
