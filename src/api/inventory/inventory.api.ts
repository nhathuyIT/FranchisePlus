import { httpClient } from "../httpClient.api";
import type {
  InventoryCreateRequest,
  InventorySearchRequest,
  InventorySearchResponse,
  InventorySearchItem,
  InventoryAdjustRequest,
  InventoryLowStockItem,
  InventoryLogItem,
  PageInfoResponse,
} from "./inventory.type";
import type { Inventory } from "@/types/inventory";

/**
 * Base URL for inventory API
 * PDF: /api/inventories (plural)
 */
const BASE_URL = "/api/inventories";

const encodeId = (id: string) => encodeURIComponent(id);

/**
 * INVENTORY-02: Search Items by Conditions
 * POST /api/inventories/search
 *
 * Uses postPaginatedRaw to bypass automatic snake_case conversion.
 * Backend expects searchCondition fields in snake_case.
 * Response is auto-converted by interceptor (snake_case -> camelCase).
 */
export const search = async (
  data: InventorySearchRequest,
): Promise<InventorySearchResponse> => {
  const payload = {
    searchCondition: {
      product_franchise_id: data.searchCondition.productFranchiseId ?? "",
      franchise_id: data.searchCondition.franchiseId ?? "",
      product_id: data.searchCondition.productId ?? "",
      quantity: data.searchCondition.quantity ?? "",
      is_active: data.searchCondition.isActive ?? "",
      is_deleted: data.searchCondition.isDeleted ?? false,
    },
    pageInfo: {
      pageNum: data.pageInfo.pageNum,
      pageSize: data.pageInfo.pageSize,
    },
  };

  const response = await httpClient.postPaginatedRaw<
    InventorySearchItem,
    typeof payload
  >({
    url: `${BASE_URL}/search`,
    data: payload,
  });

  if (!response?.success) {
    throw new Error("Failed to search inventory");
  }

  const defaultPageInfo: PageInfoResponse = {
    pageNum: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };

  return {
    pageData: response.data || [],
    pageInfo: response.pageInfo || defaultPageInfo,
  };
};

/**
 * INVENTORY-03: Get Item
 * GET /api/inventories/:id
 *
 * Uses httpClient -> interceptor auto-converts snake_case <-> camelCase
 */
export const getById = async (id: string): Promise<Inventory | null> => {
  return httpClient.get<Inventory, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * INVENTORY-01: Create Item
 * POST /api/inventories
 * Body: { product_franchise_id: string, quantity: number, alert_threshold: number }
 *
 * Uses httpClient -> interceptor auto-converts:
 * - Request: camelCase -> snake_case
 * - Response: snake_case -> camelCase
 */
export const create = async (
  data: InventoryCreateRequest,
): Promise<Inventory | null> => {
  return httpClient.post<Inventory, InventoryCreateRequest>({
    url: BASE_URL,
    data,
  });
};

/**
 * INVENTORY-04: Delete Item
 * DELETE /api/inventories/:id
 *
 * Uses httpClient -> interceptor handles response
 */
export const remove = async (id: string): Promise<void> => {
  if (!id || id === "undefined") {
    console.error("[Inventory API] Invalid ID for delete:", id);
    throw new Error("Invalid inventory ID");
  }

  await httpClient.delete<null, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * INVENTORY-05: Restore Item
 * PATCH /api/inventories/restore
 *
 * NOTE: PDF shows NO :id in URL — restore uses body or query param, not path param
 */
export const restore = async (id: string): Promise<void> => {
  await httpClient.patch<null, { id: string }>({
    url: `${BASE_URL}/restore`,
    data: { id },
  });
};

/**
 * INVENTORY-06: Edit Quantity
 * POST /api/inventories/adjust
 * Body: { product_franchise_id: string, change: number, reason?: string }
 *
 * This is the only way to update inventory quantity per the PDF spec.
 * Uses httpClient -> interceptor auto-converts camelCase -> snake_case
 */
export const adjust = async (
  data: InventoryAdjustRequest,
): Promise<void> => {
  await httpClient.post<null, InventoryAdjustRequest>({
    url: `${BASE_URL}/adjust`,
    data,
  });
};

/**
 * INVENTORY-07: Get Low Stock by Franchise
 * GET /api/inventories/low-stock/franchise/:franchiseId
 *
 * Returns items where quantity is below alert_threshold for a specific franchise.
 */
export const getLowStockByFranchise = async (
  franchiseId: string,
): Promise<InventoryLowStockItem[]> => {
  const response = await httpClient.get<InventoryLowStockItem[], never>({
    url: `${BASE_URL}/low-stock/franchise/${encodeId(franchiseId)}`,
  });
  return response || [];
};

/**
 * INVENTORY-08: Get Inventory Logs by inventoryId
 * GET /api/inventories/logs/:inventoryId
 *
 * Returns change history for a specific inventory item.
 */
export const getLogs = async (
  inventoryId: string,
): Promise<InventoryLogItem[]> => {
  const response = await httpClient.get<InventoryLogItem[], never>({
    url: `${BASE_URL}/logs/${encodeId(inventoryId)}`,
  });
  return response || [];
};
