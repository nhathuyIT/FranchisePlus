import { deleteItemByCategoryFranchiseId } from "@/api/category-franchise/CategoryFranchise.api";
import { DeleteDialog } from "@/components/form-dialog";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DeleteModal = ({
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
    <DeleteDialog<SearchCategoryFranchise>
      open={open}
      onOpenChange={(o) => !o && onClose()}
      entity={category}
      entityName="Category"
      onConfirm={() => deleteMutation.mutate()}
      isDeleting={deleteMutation.isPending}
      getDisplayName={(c) => c.categoryName}
    />
  );
};
