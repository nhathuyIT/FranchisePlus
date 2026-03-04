import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryTable } from "./components/CategoryTable";
import type { Category } from "@/types/category";
import type { CategorySearchRequest } from "@/api/category/category.api";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/hooks/category/useCategoryQuery";

const categorySchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").max(50, "Code must be less than 50 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

// ── Default search params ───────────────────────────────────────────────────

const DEFAULT_SEARCH_PARAMS: CategorySearchRequest = {
  searchCondition: {
    keyword: "",
    is_active: "",
    is_deleted: false,
  },
  pageInfo: {
    pageNum: 1,
    pageSize: 10,
  },
};

// ── Component ───────────────────────────────────────────────────────────────

const CategoriesPage = () => {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // ── TanStack Query hooks ──────────────────────────────────────────────────
  const {
    data: searchResponse,
    isLoading,
    error,
    refetch,
  } = useCategoriesQuery(DEFAULT_SEARCH_PARAMS);

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const categories = searchResponse ?? [];
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // ── Form ──────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      code: data.code,
      name: data.name,
      description: data.description || null,
      is_active: data.isActive,
    };

    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data: payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingCategory(null);
            reset();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("code", category.code);
    setValue("name", category.name);
    setValue("description", category.description || "");
    setValue("isActive", category.isActive);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    reset();
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
    );
    if (confirmDelete) {
      deleteMutation.mutate(category.id);
    }
  };

  const handleBulkDelete = (selectedCategories: Category[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'}? This action cannot be undone.`
    );
    if (confirmDelete) {
      selectedCategories.forEach((c) => deleteMutation.mutate(c.id));
    }
  };

  const handleRetry = () => {
    void refetch();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Category Management"
          description="Manage all product categories"
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleCreate}
                  className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-[#3E2723]">
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </DialogTitle>
                  <DialogDescription className="text-[#5D4037]">
                    {editingCategory
                      ? "Update the category information below."
                      : "Add a new category to your product catalog. Fill in all required fields."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code" className="text-[#3E2723] font-medium">
                        Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="code"
                        placeholder="e.g., espresso"
                        {...register("code")}
                        className={errors.code ? "border-red-500" : ""}
                      />
                      {errors.code && (
                        <p className="text-sm text-red-500">{errors.code.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-[#3E2723] font-medium">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Espresso"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description" className="text-[#3E2723] font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Enter category description..."
                        rows={3}
                        {...register("description")}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        {...register("isActive")}
                        className="w-4 h-4 text-[#6D4C41] border-gray-300 rounded focus:ring-[#6D4C41]"
                      />
                      <Label htmlFor="isActive" className="text-[#3E2723] font-medium cursor-pointer">
                        Active
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingCategory(null);
                        reset();
                      }}
                      disabled={isMutating}
                      className="border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isMutating}
                      className="bg-[#6D4C41] hover:bg-[#5D4037] text-white"
                    >
                      {isMutating
                        ? "Saving..."
                        : editingCategory
                        ? "Update Category"
                        : "Create Category"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
