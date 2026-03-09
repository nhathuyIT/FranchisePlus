import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  searchItemsByConditions,
  changeStatusItem,
  deleteItemByCategoryFranchiseId,
  restoreItemByCategoryFranchiseId,
  addCategoryToFranchise,
} from "@/api/category-franchise/CategoryFranchise.api";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";

// Flaticon icon URLs (free icons - https://www.flaticon.com)
const ICONS = {
  category: "https://cdn-icons-png.flaticon.com/128/10073/10073612.png",
  order: "https://cdn-icons-png.flaticon.com/128/2838/2838912.png",
  active: "https://cdn-icons-png.flaticon.com/128/8832/8832138.png",
  inactive: "https://cdn-icons-png.flaticon.com/128/753/753345.png",
  empty: "https://cdn-icons-png.flaticon.com/128/7486/7486744.png",
};

// ── Reusable helpers ───────────────────────────────────────────────────────

const FlatIcon = ({
  src,
  alt,
  className = "h-5 w-5",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).style.display = "none";
    }}
    loading="lazy"
  />
);

const DetailRow = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) => (
  <div className="flex justify-between items-start py-2 border-b border-[#E8DFD6]/50 last:border-0">
    <span className="text-[#5D4037]/70 font-medium w-36 shrink-0">{label}</span>
    <span
      className={`text-[#3E2723] text-right ${mono ? "font-mono text-xs break-all" : ""}`}
    >
      {value}
    </span>
  </div>
);

// ── View Modal ─────────────────────────────────────────────────────────────

const ViewModal = ({
  category,
  open,
  onClose,
}: {
  category: SearchCategoryFranchise | null;
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-[#3E2723] flex items-center gap-2">
          <FlatIcon src={ICONS.category} alt="" className="h-5 w-5" />
          Category Detail
        </DialogTitle>
      </DialogHeader>
      {category && (
        <div className="space-y-0 text-sm max-h-[60vh] overflow-y-auto pr-1">
          <DetailRow label="ID" value={category.id} mono />
          <DetailRow label="Category Name" value={category.categoryName} />
          <DetailRow label="Franchise Name" value={category.franchiseName} />
          <DetailRow
            label="Display Order"
            value={
              <Badge
                variant="outline"
                className="border-[#6D4C41]/30 text-[#6D4C41] font-mono"
              >
                {category.displayOrder}
              </Badge>
            }
          />
          <DetailRow
            label="Status"
            value={
              <Badge
                className={
                  category.isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-400 text-white"
                }
              >
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            }
          />
          <DetailRow
            label="Is Deleted"
            value={
              <Badge variant={category.isDeleted ? "destructive" : "outline"}>
                {category.isDeleted ? "Yes" : "No"}
              </Badge>
            }
          />
          <DetailRow label="Category ID" value={category.categoryId} mono />
          <DetailRow label="Franchise ID" value={category.franchiseId} mono />
          <DetailRow
            label="Created At"
            value={new Date(category.createdAt).toLocaleString("en-US")}
          />
          <DetailRow
            label="Updated At"
            value={new Date(category.updatedAt).toLocaleString("en-US")}
          />
        </div>
      )}
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-[#E8DFD6] text-[#5D4037]"
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ── Update Modal ───────────────────────────────────────────────────────────

const UpdateModal = ({
  category,
  open,
  onClose,
  onSuccess,
}: {
  category: SearchCategoryFranchise | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [isActive, setIsActive] = useState(() => category?.isActive ?? true);
  const [displayOrder, setDisplayOrder] = useState(
    () => category?.displayOrder ?? 0,
  );

  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: () => changeStatusItem(category!.id, { isActive }),
    onSuccess: () => {
      toast.success("Status updated successfully");
      void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
      onSuccess();
    },
    onError: () => toast.error("Failed to update status"),
  });

  // Mock API — replace with real endpoint when available
  const orderMutation = useMutation({
    mutationFn: async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast.success("Display order updated");
      void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
      onSuccess();
    },
    onError: () => toast.error("Failed to update display order"),
  });

  const restoreMutation = useMutation({
    mutationFn: () => restoreItemByCategoryFranchiseId(category!.id),
    onSuccess: () => {
      toast.success("Item restored successfully");
      void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
      onSuccess();
    },
    onError: () => toast.error("Failed to restore item"),
  });

  if (!category) return null;

  const isBusy =
    statusMutation.isPending ||
    orderMutation.isPending ||
    restoreMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723]">Update Category</DialogTitle>
          <p className="text-sm text-[#5D4037]/70">{category.categoryName}</p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-[#3E2723] font-medium">Status</Label>
            <Select
              value={isActive ? "active" : "inactive"}
              onValueChange={(v) => setIsActive(v === "active")}
            >
              <SelectTrigger className="border-[#E8DFD6] focus:ring-[#6D4C41]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => statusMutation.mutate()}
              disabled={isBusy || isActive === category.isActive}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white w-full"
            >
              {statusMutation.isPending ? "Saving..." : "Save Status"}
            </Button>
          </div>

          {/* Display Order */}
          <div className="space-y-1.5">
            <Label className="text-[#3E2723] font-medium">Display Order</Label>
            <Input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="border-[#E8DFD6] focus:border-[#6D4C41]"
            />
            <Button
              size="sm"
              onClick={() => orderMutation.mutate()}
              disabled={isBusy || displayOrder === category.displayOrder}
              variant="outline"
              className="border-[#6D4C41] text-[#6D4C41] hover:bg-[#FAF8F5] w-full"
            >
              {orderMutation.isPending ? "Saving..." : "Save Display Order"}
            </Button>
          </div>

          {/* Restore (only when deleted) */}
          {category.isDeleted && (
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-sm text-amber-700 font-medium">
                This item is deleted
              </span>
              <Button
                size="sm"
                onClick={() => restoreMutation.mutate()}
                disabled={isBusy}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                {restoreMutation.isPending ? "Restoring..." : "Restore"}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isBusy}
            className="border-[#E8DFD6] text-[#5D4037]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Delete Modal ───────────────────────────────────────────────────────────

const DeleteModal = ({
  category,
  open,
  onClose,
  onSuccess,
}: {
  category: SearchCategoryFranchise | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteItemByCategoryFranchiseId(category!.id),
    onSuccess: () => {
      toast.success("Category removed from franchise");
      void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
      onSuccess();
    },
    onError: () => toast.error("Failed to delete category"),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-red-700">Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-[#3E2723]">
              {category?.categoryName}
            </span>{" "}
            from this franchise? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="border-[#E8DFD6] text-[#5D4037]"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Create Modal ───────────────────────────────────────────────────────────

const CreateModal = ({
  franchiseId,
  open,
  onClose,
  onSuccess,
}: {
  franchiseId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [categoryId, setCategoryId] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () =>
      addCategoryToFranchise({
        franchiseId,
        categoryId: categoryId.trim(),
        displayOrder,
      }),
    onSuccess: () => {
      toast.success("Category added to franchise");
      void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
      setCategoryId("");
      setDisplayOrder(0);
      onSuccess();
    },
    onError: () => toast.error("Failed to add category"),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723]">
            Add Category to Franchise
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[#3E2723] font-medium">Category ID</Label>
            <Input
              placeholder="Enter category ID..."
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border-[#E8DFD6] focus:border-[#6D4C41]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#3E2723] font-medium">Display Order</Label>
            <Input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="border-[#E8DFD6] focus:border-[#6D4C41]"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={createMutation.isPending}
            className="border-[#E8DFD6] text-[#5D4037]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !categoryId.trim()}
            className="bg-[#6D4C41] hover:bg-[#5D4037] text-white"
          >
            {createMutation.isPending ? "Adding..." : "Add Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Individual Row Component ───────────────────────────────────────────────

const CategoryRow = ({
  category,
  index,
  onView,
  onUpdate,
  onDelete,
}: {
  category: SearchCategoryFranchise;
  index: number;
  onView: (c: SearchCategoryFranchise) => void;
  onUpdate: (c: SearchCategoryFranchise) => void;
  onDelete: (c: SearchCategoryFranchise) => void;
}) => (
  <TableRow className="hover:bg-[#FAF8F5]/50 transition-colors duration-150">
    <TableCell className="text-center text-[#5D4037]/70 font-mono text-sm">
      {index}
    </TableCell>
    <TableCell>
      <span className="font-medium text-[#3E2723]">
        {category.categoryName}
      </span>
    </TableCell>
    <TableCell className="text-center">
      <Badge
        variant="outline"
        className="border-[#6D4C41]/30 text-[#6D4C41] font-mono"
      >
        {category.displayOrder}
      </Badge>
    </TableCell>
    <TableCell className="text-center">
      <Badge
        variant={category.isActive ? "default" : "secondary"}
        className={
          category.isActive
            ? "bg-green-600 hover:bg-green-700 text-white rounded-full px-3"
            : "bg-gray-400 hover:bg-gray-500 text-white rounded-full px-3"
        }
      >
        <FlatIcon
          src={category.isActive ? ICONS.active : ICONS.inactive}
          alt={category.isActive ? "Active" : "Inactive"}
          className="h-4 w-4 inline-block mr-1"
        />
        {category.isActive ? "Active" : "Inactive"}
      </Badge>
    </TableCell>
    {/* Actions */}
    <TableCell className="text-center">
      <div className="flex items-center justify-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onView(category)}
          className="h-8 w-8 text-[#5D4037] hover:bg-[#FAF8F5] hover:text-[#3E2723]"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onUpdate(category)}
          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
          title="Update"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(category)}
          className="h-8 w-8 text-red-600 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
    {/* Is Deleted */}
    <TableCell className="text-center">
      <Badge
        variant={category.isDeleted ? "destructive" : "outline"}
        className={
          category.isDeleted
            ? "rounded-full px-3"
            : "border-green-500 text-green-700 rounded-full px-3"
        }
      >
        {category.isDeleted ? "Yes" : "No"}
      </Badge>
    </TableCell>
  </TableRow>
);

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
