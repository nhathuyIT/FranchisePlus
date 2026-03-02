import type { ReverseHeaderMapping } from "./types";

// ─── Inventory Export-only config ──────────────────────────────────────────
// Inventory is a complex view model (InventoryItemView) with nested objects.
// Import is not practical — only export is supported.
// We flatten the nested structure into a single-level header mapping for export.

export const INVENTORY_REVERSE_HEADER_MAPPING: ReverseHeaderMapping = {
  "product.sku": "Mã sản phẩm",
  "product.name": "Tên sản phẩm",
  franchiseName: "Chi nhánh",
  franchiseCode: "Mã chi nhánh",
  "inventory.quantity": "Tồn kho",
  "inventory.alertThreshold": "Ngưỡng cảnh báo",
  "productFranchise.priceBase": "Giá bán",
  "inventory.isActive": "Trạng thái",
};

/**
 * Flattens an InventoryItemView into a plain object for export.
 */
export function flattenInventoryItem(
  item: Record<string, unknown>
): Record<string, unknown> {
  const inv = item.inventory as Record<string, unknown> | undefined;
  const prod = item.product as Record<string, unknown> | undefined;
  const pf = item.productFranchise as Record<string, unknown> | undefined;

  return {
    "product.sku": prod?.sku ?? "",
    "product.name": prod?.name ?? "",
    franchiseName: item.franchiseName ?? "",
    franchiseCode: item.franchiseCode ?? "",
    "inventory.quantity": inv?.quantity ?? 0,
    "inventory.alertThreshold": inv?.alertThreshold ?? 0,
    "productFranchise.priceBase": pf?.priceBase ?? 0,
    "inventory.isActive": inv?.isActive ?? false,
  };
}
