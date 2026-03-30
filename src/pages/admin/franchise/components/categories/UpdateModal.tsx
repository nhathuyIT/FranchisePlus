import { z } from "zod";
import {
  changeStatusItem,
  restoreItemByCategoryFranchiseId,
} from "@/api/category-franchise/CategoryFranchise.api";
import { FormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import { Button } from "@/components/ui/button";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import { Loader2, RotateCcw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateSchema = z.object({
  isActive: z.boolean(),
});

type UpdateForm = z.infer<typeof updateSchema>;

const UPDATE_FIELDS: FieldConfig<UpdateForm>[] = [
  {
    name: "isActive",
    label: "Status",
    type: "switch",
    description: "Toggle to activate or deactivate this category",
  },
];

export const UpdateModal = ({
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

  const restoreMutation = useMutation({
    mutationFn: () => restoreItemByCategoryFranchiseId(category!.id),
    onSuccess: () => {
      toast.success("Item restored successfully");
      void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
      onSuccess();
    },
    onError: () => toast.error("Failed to restore item"),
  });

  const handleSubmit = async (data: UpdateForm) => {
    await changeStatusItem(category!.id, { isActive: data.isActive });
  };

  const handleSuccess = () => {
    toast.success("Category updated successfully");
    void queryClient.invalidateQueries({ queryKey: ["category-franchise"] });
    onSuccess();
  };

  if (!category) return null;

  return (
    <FormDialog<UpdateForm>
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Update Category"
      description={category.categoryName}
      schema={updateSchema}
      fields={UPDATE_FIELDS}
      values={{
        isActive: category.isActive,
      }}
      mode="edit"
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      renderFooter={({ isSubmitting, onCancel }) => (
        <div className="flex w-full flex-col gap-3">
          {category.isDeleted && (
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
              <span className="text-sm font-medium text-amber-700">
                This item is deleted
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => restoreMutation.mutate()}
                disabled={isSubmitting || restoreMutation.isPending}
                className="rounded-full bg-amber-500 text-white hover:bg-amber-600"
              >
                {restoreMutation.isPending ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="mr-1 h-3 w-3" />
                )}
                {restoreMutation.isPending ? "Restoring..." : "Restore"}
              </Button>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border-[#E8DFD6] text-[#5D4037]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      )}
    />
  );
};
