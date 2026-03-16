// Excel utilities barrel export
export { useExcelExport } from "./useExcelExport";
export { useExcelImport } from "./useExcelImport";
export type {
  HeaderMapping,
  ReverseHeaderMapping,
  ImportRowError,
  ImportResult,
  ImportConfig,
  ExportConfig,
} from "./types";

// Franchise
export {
  FranchiseImportSchema,
  FRANCHISE_HEADER_MAPPING,
  FRANCHISE_REVERSE_HEADER_MAPPING,
  type FranchiseImportData,
} from "./franchise-excel.config";

// Category
export {
  CategoryImportSchema,
  CATEGORY_HEADER_MAPPING,
  CATEGORY_REVERSE_HEADER_MAPPING,
  type CategoryImportData,
} from "./category-excel.config";

// Product
export {
  ProductImportSchema,
  PRODUCT_HEADER_MAPPING,
  PRODUCT_REVERSE_HEADER_MAPPING,
  type ProductImportData,
} from "./product-excel.config";

// Customer
export {
  CustomerImportSchema,
  CUSTOMER_HEADER_MAPPING,
  CUSTOMER_REVERSE_HEADER_MAPPING,
  type CustomerImportData,
} from "./customer-excel.config";

// Inventory (export-only)
export {
  INVENTORY_REVERSE_HEADER_MAPPING,
  flattenInventoryItem,
  type InventoryImportData,
} from "./inventory-excel.config";
