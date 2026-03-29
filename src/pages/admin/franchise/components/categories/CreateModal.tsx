import { z } from "zod";
import { addCategoryToFranchise } from "@/api/category-franchise/CategoryFranchise.api";
import { FormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
});

type CreateForm = z.infer<typeof createSchema>;

const CREATE_FIELDS: FieldConfig<CreateForm>[] = [
  {
    name: "categoryId",
    label: "Category ID",
    type: "text",
    required: true,
    placeholder: "Enter category ID...",
  },
];

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
      fields={CREATE_FIELDS}
      defaultValues={{ categoryId: "" }}
      mode="create"
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      submitText="Add Category"
    />
  );
};
