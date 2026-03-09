import { useQuery } from "@tanstack/react-query";
import {
  getAllClientFranchises,
  getClientFranchiseById,
} from "@/api/client/client-franchise.api";

const FRANCHISE_KEY = ["client-franchises"] as const;

/**
 * Fetch all franchises for the store locator.
 */
export const useClientFranchises = () => {
  return useQuery({
    queryKey: [...FRANCHISE_KEY],
    queryFn: getAllClientFranchises,
  });
};

/**
 * Fetch a single franchise by ID.
 */
export const useClientFranchiseById = (franchiseId: string | null) => {
  return useQuery({
    queryKey: [...FRANCHISE_KEY, franchiseId],
    queryFn: () => getClientFranchiseById(franchiseId!),
    enabled: !!franchiseId,
  });
};
