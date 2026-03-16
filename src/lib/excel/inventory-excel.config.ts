import type { ReverseHeaderMapping } from "./types";

export interface InventoryImportData {
  productName: string;
  franchiseName: string;
  quantity: number;
  alertThreshold: number;
}

export const INVENTORY_REVERSE_HEADER_MAPPING: ReverseHeaderMapping = {
  productName: "Product",
  franchiseName: "Franchise",
  quantity: "Quantity",
  alertThreshold: "Alert Threshold",
};

/**
 * Flattens the search response item used by the inventory page into a plain
 * object that can round-trip cleanly through Excel import/export.
 */
export function flattenInventoryItem(
  item: Record<string, unknown>,
): Record<string, unknown> {
  return {
    productName: item.productName ?? "",
    franchiseName: item.franchiseName ?? "",
    quantity: item.quantity ?? 0,
    alertThreshold: item.alertThreshold ?? 0,
  };
}
