import { Plus } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryTable } from "./components/CategoryTable";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import type { Category } from "@/types/category";
import type { CategorySearchRequest } from "@/api/category/category.api";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
} from "@/hooks/category/useCategoryQuery";

const categorySchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").max(50, "Code must be less than 50 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const categoryFields: FieldConfig<CategoryFormData>[] = [
  {
    name: "code",
    type: "text",
    label: "Code",
    placeholder: "e.g., espresso",
    required: true,
  },
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "e.g., Espresso",
    required: true,
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter category description...",
    rows: 3,
  },
  {
    name: "isActive",
    type: "switch",
    label: "Active",
    defaultValue: true,
  },
];

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
  const dialog = useFormDialog<Category>();

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
  const categoryStatusMutation = useUpdateCategoryStatusMutation();

  const categories = searchResponse ?? [];

  // ── Form submission handler ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (data: CategoryFormData) => {
    const payload = {
      code: data.code,
      name: data.name,
      description: data.description || null,
      is_active: data.isActive,
    };

    if (dialog.mode === "edit" && dialog.data) {
      await updateMutation.mutateAsync({ id: dialog.data.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = (category: Category) => {
    dialog.openEdit(category);
  };

  const handleView = (category: Category) => {
    dialog.openView(category);
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

  const handleStatusToggle = (category: Category, isActive: boolean) => {
    categoryStatusMutation.mutate({ id: category.id, isActive });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-screen-2xl mx-auto w-full">
        <PageHeader
          title="Category Management"
          description="Manage all product categories"
          action={
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onStatusToggle={handleStatusToggle}
            statusPendingId={categoryStatusMutation.isPending ? String(categoryStatusMutation.variables?.id) : null}
            canEdit={true}
          />
        </div>
      </div>

      <FormDialog<CategoryFormData>
        open={dialog.isOpen}
        onOpenChange={(open) => !open && dialog.close()}
        title={dialog.mode === "create" ? "Create New Category" : "Edit Category"}
        description={
          dialog.mode === "create"
            ? "Add a new category to your product catalog. Fill in all required fields."
            : "Update the category information below."
        }
        schema={categorySchema}
        fields={categoryFields}
        values={dialog.data ? {
          code: dialog.data.code,
          name: dialog.data.name,
          description: dialog.data.description || undefined,
          isActive: dialog.data.isActive,
        } : undefined}
        mode={dialog.mode}
        onSubmit={handleSubmit}
        onSuccess={dialog.close}
        size="md"
      />
    </div>
  );
};

export default CategoriesPage;
