import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { CATEGORIES } from "@/const/category.const";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryTable } from "./components/CategoryTable";
import type { Category } from "@/types/category";

const categorySchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").max(50, "Code must be less than 50 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CategoriesPage = () => {
  const [categories] = useState<Category[]>(CATEGORIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
      is_active: true,
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      console.log("Update category:", editingCategory.id, data);
      toast.success("Category updated successfully!");
    } else {
      console.log("Create category:", data);
      toast.success("Category created successfully!");
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
    reset();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("code", category.code);
    setValue("name", category.name);
    setValue("description", category.description || "");
    setValue("is_active", category.is_active);
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
      console.log("Delete category:", category.id);
      toast.success("Category deleted successfully!");
    }
  };

  const handleBulkDelete = (selectedCategories: Category[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'}? This action cannot be undone.`
    );
    if (confirmDelete) {
      console.log("Bulk delete categories:", selectedCategories.map(c => c.id));
      toast.success(`Successfully deleted ${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'}`);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
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
                        id="is_active"
                        {...register("is_active")}
                        className="w-4 h-4 text-[#6D4C41] border-gray-300 rounded focus:ring-[#6D4C41]"
                      />
                      <Label htmlFor="is_active" className="text-[#3E2723] font-medium cursor-pointer">
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
                      className="border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#6D4C41] hover:bg-[#5D4037] text-white"
                    >
                      {editingCategory ? "Update Category" : "Create Category"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
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
