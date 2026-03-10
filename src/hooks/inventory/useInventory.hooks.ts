import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as inventoryApi from "@/api/inventory/inventory.api";
import { useAuthStore } from "@/stores/auth-store";
import type {
  InventorySearchRequest,
  InventoryCreateRequest,
  InventoryAdjustRequest,
} from "@/api/inventory/inventory.type";

// =============================================================================
// Query Keys
// =============================================================================

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: InventorySearchRequest) =>
    [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string, scopeKey = "default") =>
    [...inventoryKeys.details(), scopeKey, id] as const,
  lowStock: (franchiseId: string) =>
    [...inventoryKeys.all, "low-stock", franchiseId] as const,
  logs: (inventoryId: string) =>
    [...inventoryKeys.all, "logs", inventoryId] as const,
};

// =============================================================================
// Internal Helpers
// =============================================================================

/**
 * Generate scope key based on current auth context
 * Ensures cache isolation between different user/role/franchise contexts
 */
const useInventoryScopeKey = () => {
  const authUser = useAuthStore((state) => state.authUser);

  if (!authUser) {
    return "anonymous";
  }

  return `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`;
};

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * INVENTORY-02: Search inventory with pagination
 */
export const useInventorySearch = (
  params?: Partial<InventorySearchRequest>,
  options?: { enabled?: boolean; scopeKey?: string },
) => {
  const defaultScopeKey = useInventoryScopeKey();
  const scopeKey = options?.scopeKey ?? defaultScopeKey;

  const searchParams: InventorySearchRequest = {
    searchCondition: {
      isDeleted: false,
      ...params?.searchCondition,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100,
      ...params?.pageInfo,
    },
  };

  return useQuery({
    queryKey: [...inventoryKeys.list(searchParams), scopeKey],
    queryFn: () => inventoryApi.search(searchParams),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Fetch all inventory items (convenience wrapper for useInventorySearch)
 *
 * Returns flattened `data: InventorySearchItem[]` for simple use cases.
 * Use `useInventorySearch` directly when you need pagination info.
 */
export const useInventories = (enabled = true, scopeKey = "default") => {
  const searchResult = useInventorySearch(
    {
      searchCondition: { isDeleted: false },
      pageInfo: { pageNum: 1, pageSize: 100 },
    },
    { enabled, scopeKey },
  );

  return {
    ...searchResult,
    data: searchResult.data?.pageData ?? [],
  };
};

/**
 * INVENTORY-03: Fetch single inventory item by ID
 */
export const useInventory = (
  id: string,
  options?: {
    enabled?: boolean;
    scopeKey?: string;
  },
) => {
  const defaultScopeKey = useInventoryScopeKey();
  const isEnabled = options?.enabled ?? true;
  const scopeKey = options?.scopeKey ?? defaultScopeKey;

  return useQuery({
    queryKey: inventoryKeys.detail(id, scopeKey),
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id && isEnabled,
  });
};

/**
 * INVENTORY-07: Get Low Stock by Franchise
 */
export const useLowStockByFranchise = (
  franchiseId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: inventoryKeys.lowStock(franchiseId),
    queryFn: () => inventoryApi.getLowStockByFranchise(franchiseId),
    enabled: !!franchiseId && (options?.enabled ?? true),
  });
};

/**
 * INVENTORY-08: Get Inventory Logs by inventoryId
 */
export const useInventoryLogs = (
  inventoryId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: inventoryKeys.logs(inventoryId),
    queryFn: () => inventoryApi.getLogs(inventoryId),
    enabled: !!inventoryId && (options?.enabled ?? true),
  });
};

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * INVENTORY-01: Create new inventory item
 */
export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InventoryCreateRequest) => {
      return inventoryApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      toast.success("Inventory item created", {
        description: "The inventory item has been created successfully",
      });
    },
    onError: (error) => {
      toast.error("Failed to create inventory item", {
        description: error.message,
      });
    },
  });
};

/**
 * INVENTORY-06: Adjust inventory quantity
 * POST /api/inventories/adjust
 * { product_franchise_id, change, reason }
 */
export const useAdjustInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InventoryAdjustRequest) => {
      await inventoryApi.adjust(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.details() });
      toast.success("Inventory adjusted", {
        description: "The inventory quantity has been updated successfully",
      });
    },
    onError: (error) => {
      toast.error("Failed to adjust inventory", {
        description: error.message,
      });
    },
  });
};

/**
 * INVENTORY-04: Delete inventory item (soft delete)
 */
export const useDeleteInventory = (options?: { suppressToast?: boolean }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await inventoryApi.remove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      if (!options?.suppressToast) {
        toast.success("Inventory item deleted", {
          description: "The inventory item has been deleted",
        });
      }
    },
    onError: (error) => {
      if (!options?.suppressToast) {
        toast.error("Failed to delete inventory item", {
          description: error.message,
        });
      }
    },
  });
};

/**
 * INVENTORY-05: Restore deleted inventory item
 */
export const useRestoreInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await inventoryApi.restore(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      toast.success("Inventory item restored", {
        description: "The inventory item has been restored",
      });
    },
    onError: (error) => {
      toast.error("Failed to restore inventory item", {
        description: error.message,
      });
    },
  });
};
