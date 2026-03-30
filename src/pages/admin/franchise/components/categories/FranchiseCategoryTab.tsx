import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { searchItemsByConditions } from "@/api/category-franchise/CategoryFranchise.api";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import { ViewModal } from "./ViewModal";
import { UpdateModal } from "./UpdateModal";
import { DeleteModal } from "./DeleteModal";
import { CreateModal } from "./CreateModal";
import { ICONS } from "./franchise-icons";
import { FlatIcon } from "./FlatIcon";

interface FranchiseCategoryTabProps {
  franchiseId: string;
  franchiseName?: string;
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
}

export const FranchiseCategoryTab = ({
  franchiseId,
  franchiseName,
  createOpen = false,
  onCreateOpenChange,
}: FranchiseCategoryTabProps) => {
  const [viewCategory, setViewCategory] =
    useState<SearchCategoryFranchise | null>(null);
  const [updateCategory, setUpdateCategory] =
    useState<SearchCategoryFranchise | null>(null);
  const [deleteCategory, setDeleteCategory] =
    useState<SearchCategoryFranchise | null>(null);

  const {
    data: categories = [],
    isLoading,
    isFetching,
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

  const tableLoading = isLoading || isFetching;
  const tableError =
    error instanceof Error
      ? error
      : error
        ? new Error("Failed to load categories for this franchise.")
        : null;

  const sortedCategories = useMemo(
    () =>
      [...categories].sort(
        (left, right) =>
          left.displayOrder - right.displayOrder ||
          left.categoryName.localeCompare(right.categoryName),
      ),
    [categories],
  );

  const nextDisplayOrder = useMemo(
    () =>
      sortedCategories.reduce(
        (maxOrder, category) =>
          Math.max(maxOrder, Number(category.displayOrder) || 0),
        0,
      ) + 1,
    [sortedCategories],
  );

  const columns = useMemo<ColumnDef<SearchCategoryFranchise>[]>(
    () => [
      {
        id: "index",
        header: "#",
        enableSorting: false,
        meta: { align: "center" as const },
        cell: ({ row }) => (
          <span className="font-mono text-sm text-[#5D4037]/80">
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: "categoryName",
        header: "Category Name",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium text-[#3E2723]">
            {row.original.categoryName}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        enableSorting: false,
        meta: { align: "center" as const },
        cell: ({ row }) => (
          <Badge
            variant={row.original.isActive ? "default" : "secondary"}
            className={
              row.original.isActive
                ? "rounded-full bg-green-600 px-3 text-white hover:bg-green-700"
                : "rounded-full bg-gray-500 px-3 text-white hover:bg-gray-600"
            }
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
    ],
    [],
  );

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
        nextDisplayOrder={nextDisplayOrder}
        open={createOpen}
        onClose={() => onCreateOpenChange?.(false)}
        onSuccess={() => onCreateOpenChange?.(false)}
      />

      <div className="flex h-full flex-col rounded-2xl border border-[#E8DFD6] bg-linear-to-br from-white to-[#FAF8F5] p-6 shadow-lg">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D4C41]">
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
                ({sortedCategories.length} total)
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={tableLoading}
            className="shrink-0 border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${tableLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="min-h-0 flex-1">
          <DataTable<SearchCategoryFranchise>
            columns={columns}
            data={sortedCategories}
            searchable
            searchPlaceholder="Search by name..."
            emptyMessage="No categories assigned to this franchise."
            initialPageSize={10}
            isLoading={tableLoading}
            error={tableError}
            onRetry={() => {
              void refetch();
            }}
            renderActions={(category) => (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewCategory(category)}
                  className="h-8 w-8 text-[#5D4037] hover:bg-[#FAF8F5] hover:text-[#3E2723]"
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setUpdateCategory(category)}
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                  title="Update"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeleteCategory(category)}
                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
};
