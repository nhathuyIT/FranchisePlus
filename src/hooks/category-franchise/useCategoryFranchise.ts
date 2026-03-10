import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addCategoryToFranchise } from "@/api/category-franchise/CategoryFranchise.api";
import type { CategoryFranchiseRequest } from "@/types/categoryFranchise.type";

export const useAddCategoryToFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryFranchiseRequest) =>
      addCategoryToFranchise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-franchises"] });
      toast.success("Category added to franchise successfully!");
    },
    onError: () => {
      toast.error("Failed to add category to franchise.");
    },
  });
};
