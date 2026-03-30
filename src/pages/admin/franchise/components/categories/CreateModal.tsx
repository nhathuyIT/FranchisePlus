import * as React from "react";
import { z } from "zod";
import { addCategoryToFranchise } from "@/api/category-franchise/CategoryFranchise.api";
import type { CategorySearchRequest } from "@/api/category/category.api";
import { FormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import { useCategoriesQuery } from "@/hooks/category/useCategoryQuery";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
});

type CreateForm = z.infer<typeof createSchema>;

const CATEGORY_SEARCH_PARAMS: CategorySearchRequest = {
  searchCondition: {
    keyword: "",
    is_active: "",
    is_deleted: false,
  },
  pageInfo: {
    pageNum: 1,
    pageSize: 100,
  },
};

export const CreateModal = ({
  franchiseId,
  nextDisplayOrder = 1,
  open,
  onClose,
  onSuccess,
}: {
  franchiseId: string;
  nextDisplayOrder?: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategoriesQuery(CATEGORY_SEARCH_PARAMS);

  const categoryOptions = React.useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
    [categories],
  );

  const fields = React.useMemo<FieldConfig<CreateForm>[]>(
    () => [
      {
        name: "categoryId",
        label: "Category",
        type: "select",
        required: true,
        placeholder: "Select a category",
        options: categoryOptions,
        disabled: isLoadingCategories,
      },
    ],
    [categoryOptions, isLoadingCategories],
  );

  const handleSubmit = async (data: CreateForm) => {
    await addCategoryToFranchise({
      franchiseId,
      categoryId: data.categoryId.trim(),
      displayOrder: nextDisplayOrder,
    });
  };

  const handleSuccess = () => {
    toast.success("Category added to franchise");
    void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
    onSuccess();
  };

  return (
    <FormDialog<CreateForm>
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Add Category to Franchise"
      schema={createSchema}
      fields={fields}
      defaultValues={{ categoryId: "" }}
      mode="create"
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      submitText="Add Category"
    />
  );
};
