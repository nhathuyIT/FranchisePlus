import type { Inventory, InventoryItemView } from "@/types/inventory";
import type { Product } from "@/types/product.type";
import { FRANCHISES_MOCK } from "./franchises.const";

/**
 * Mock products for inventory UI rendering
 * Note: Temporary mock data. Will be replaced when Product API is ready.
 * These products represent raw materials/ingredients, not menu items.
 */
const PRODUCTS_FOR_INVENTORY: Product[] = [
  {
    id: 1,
    sku: "ARAB-BEAN-001",
    name: "Arabica Coffee Beans",
    description: "Premium Arabica coffee beans",
    content: null,
    imageUrl: null,
    minPrice: 200000,
    maxPrice: 250000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    sku: "ROBU-BEAN-002",
    name: "Robusta Coffee Beans",
    description: "Strong Robusta coffee beans",
    content: null,
    imageUrl: null,
    minPrice: 150000,
    maxPrice: 200000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 3,
    sku: "MILK-WHOLE-003",
    name: "Whole Milk",
    description: "Fresh whole milk",
    content: null,
    imageUrl: null,
    minPrice: 15000,
    maxPrice: 20000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 4,
    sku: "SUGAR-WHITE-004",
    name: "White Sugar",
    description: "Premium white sugar",
    content: null,
    imageUrl: null,
    minPrice: 20000,
    maxPrice: 30000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 5,
    sku: "SYRUP-CHOC-005",
    name: "Chocolate Syrup",
    description: "Rich chocolate syrup",
    content: null,
    imageUrl: null,
    minPrice: 90000,
    maxPrice: 110000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 6,
    sku: "SYRUP-VANI-006",
    name: "Vanilla Syrup",
    description: "Sweet vanilla syrup",
    content: null,
    imageUrl: null,
    minPrice: 80000,
    maxPrice: 100000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 7,
    sku: "MILK-ALMOND-007",
    name: "Almond Milk",
    description: "Plant-based almond milk",
    content: null,
    imageUrl: null,
    minPrice: 25000,
    maxPrice: 35000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 8,
    sku: "SYRUP-CARA-008",
    name: "Caramel Syrup",
    description: "Sweet caramel syrup",
    content: null,
    imageUrl: null,
    minPrice: 85000,
    maxPrice: 105000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 9,
    sku: "MILK-OAT-009",
    name: "Oat Milk",
    description: "Creamy oat milk",
    content: null,
    imageUrl: null,
    minPrice: 30000,
    maxPrice: 40000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 10,
    sku: "SYRUP-HAZE-010",
    name: "Hazelnut Syrup",
    description: "Nutty hazelnut syrup",
    content: null,
    imageUrl: null,
    minPrice: 95000,
    maxPrice: 110000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 11,
    sku: "CREAM-WHIP-011",
    name: "Whipped Cream",
    description: "Fresh whipped cream",
    content: null,
    imageUrl: null,
    minPrice: 45000,
    maxPrice: 55000,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
];

/**
 * Mock inventory data - 22 records distributed across 10 franchises
 * Includes low stock items (quantity <= alert_threshold) for testing alerts
 */
export const INVENTORY_MOCK: Inventory[] = [
  { id: 1, productFranchiseId: 1, quantity: 150, alertThreshold: 50, isActive: true, isDeleted: false, createdAt: "2025-01-01T08:00:00Z", updatedAt: "2025-01-30T10:00:00Z" },
  { id: 2, productFranchiseId: 2, quantity: 30, alertThreshold: 40, isActive: true, isDeleted: false, createdAt: "2025-01-01T08:00:00Z", updatedAt: "2025-01-29T14:30:00Z" },
  { id: 3, productFranchiseId: 3, quantity: 80, alertThreshold: 30, isActive: true, isDeleted: false, createdAt: "2025-01-01T08:00:00Z", updatedAt: "2025-01-30T09:15:00Z" },
  { id: 4, productFranchiseId: 1, quantity: 20, alertThreshold: 50, isActive: true, isDeleted: false, createdAt: "2025-01-02T09:00:00Z", updatedAt: "2025-01-30T08:45:00Z" },
  { id: 5, productFranchiseId: 4, quantity: 60, alertThreshold: 20, isActive: true, isDeleted: false, createdAt: "2025-01-02T09:00:00Z", updatedAt: "2025-01-29T16:20:00Z" },
  { id: 6, productFranchiseId: 5, quantity: 15, alertThreshold: 25, isActive: true, isDeleted: false, createdAt: "2025-01-02T09:00:00Z", updatedAt: "2025-01-30T11:00:00Z" },
  { id: 7, productFranchiseId: 2, quantity: 100, alertThreshold: 40, isActive: true, isDeleted: false, createdAt: "2025-01-03T07:30:00Z", updatedAt: "2025-01-29T13:40:00Z" },
  { id: 8, productFranchiseId: 6, quantity: 35, alertThreshold: 20, isActive: true, isDeleted: false, createdAt: "2025-01-03T07:30:00Z", updatedAt: "2025-01-30T10:25:00Z" },
  { id: 9, productFranchiseId: 3, quantity: 25, alertThreshold: 30, isActive: true, isDeleted: false, createdAt: "2025-01-04T10:00:00Z", updatedAt: "2025-01-30T07:50:00Z" },
  { id: 10, productFranchiseId: 7, quantity: 40, alertThreshold: 15, isActive: true, isDeleted: false, createdAt: "2025-01-04T10:00:00Z", updatedAt: "2025-01-29T15:10:00Z" },
  { id: 11, productFranchiseId: 1, quantity: 75, alertThreshold: 50, isActive: true, isDeleted: false, createdAt: "2025-01-04T10:00:00Z", updatedAt: "2025-01-30T12:30:00Z" },
  { id: 12, productFranchiseId: 8, quantity: 10, alertThreshold: 20, isActive: false, isDeleted: false, createdAt: "2025-01-05T08:45:00Z", updatedAt: "2025-01-28T09:00:00Z" },
  { id: 13, productFranchiseId: 1, quantity: 120, alertThreshold: 50, isActive: true, isDeleted: false, createdAt: "2025-01-06T09:30:00Z", updatedAt: "2025-01-30T11:45:00Z" },
  { id: 14, productFranchiseId: 9, quantity: 18, alertThreshold: 25, isActive: true, isDeleted: false, createdAt: "2025-01-06T09:30:00Z", updatedAt: "2025-01-29T17:20:00Z" },
  { id: 15, productFranchiseId: 2, quantity: 90, alertThreshold: 40, isActive: true, isDeleted: false, createdAt: "2025-01-07T07:00:00Z", updatedAt: "2025-01-30T08:15:00Z" },
  { id: 16, productFranchiseId: 10, quantity: 28, alertThreshold: 20, isActive: true, isDeleted: false, createdAt: "2025-01-07T07:00:00Z", updatedAt: "2025-01-29T12:40:00Z" },
  { id: 17, productFranchiseId: 4, quantity: 45, alertThreshold: 20, isActive: true, isDeleted: false, createdAt: "2025-01-08T10:20:00Z", updatedAt: "2025-01-30T09:50:00Z" },
  { id: 18, productFranchiseId: 3, quantity: 12, alertThreshold: 30, isActive: true, isDeleted: false, createdAt: "2025-01-08T10:20:00Z", updatedAt: "2025-01-30T06:30:00Z" },
  { id: 19, productFranchiseId: 1, quantity: 65, alertThreshold: 50, isActive: true, isDeleted: false, createdAt: "2025-01-09T08:10:00Z", updatedAt: "2025-01-29T14:15:00Z" },
  { id: 20, productFranchiseId: 11, quantity: 22, alertThreshold: 15, isActive: true, isDeleted: false, createdAt: "2025-01-09T08:10:00Z", updatedAt: "2025-01-30T13:25:00Z" },
  { id: 21, productFranchiseId: 5, quantity: 8, alertThreshold: 25, isActive: true, isDeleted: false, createdAt: "2025-01-10T09:45:00Z", updatedAt: "2025-01-30T10:40:00Z" },
  { id: 22, productFranchiseId: 2, quantity: 110, alertThreshold: 40, isActive: true, isDeleted: false, createdAt: "2025-01-10T09:45:00Z", updatedAt: "2025-01-29T16:55:00Z" },
];

/**
 * Helper function to create InventoryItemView for UI display
 * Maps inventory records to view models with product and franchise info
 */
export function createInventoryItemView(inventory: Inventory): InventoryItemView | null {
  // Map product_franchise_id to product (simplified - using modulo for cycling through products)
  const productIndex = Number(inventory.productFranchiseId) - 1;
  const mockProduct = PRODUCTS_FOR_INVENTORY[productIndex % PRODUCTS_FOR_INVENTORY.length];

  // Derive franchise from inventory record distribution (simplified mapping)
  const inventoryId = Number(inventory.id);
  const franchiseIndex = Math.floor((inventoryId - 1) / 3);
  const franchise = FRANCHISES_MOCK[franchiseIndex % FRANCHISES_MOCK.length];

  if (!mockProduct || !franchise) return null;

  return {
    inventory,
    product: {
      id: mockProduct.id,
      name: mockProduct.name,
      sku: mockProduct.sku,
      description: mockProduct.description,
    },
    productFranchise: {
      id: inventory.productFranchiseId,
      franchiseId: franchise.id,
      productId: mockProduct.id,
      priceBase: mockProduct.minPrice,
      isActive: true,
      isDeleted: false,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    },
    franchiseName: franchise.name,
    franchiseCode: franchise.code,
  };
}

/**
 * Get all inventory items as view models for UI
 */
export function getInventoryItemViews(): InventoryItemView[] {
  return INVENTORY_MOCK
    .map(inv => createInventoryItemView(inv))
    .filter((view): view is InventoryItemView => view !== null);
}

/**
 * Get inventory items for a specific franchise
 */
export function getInventoryByFranchiseId(franchiseId: number): InventoryItemView[] {
  return getInventoryItemViews().filter(
    view => view.productFranchise.franchiseId === franchiseId
  );
}

/**
 * Get low stock items (quantity <= alert_threshold)
 */
export function getLowStockItems(): InventoryItemView[] {
  return getInventoryItemViews().filter(
    view => view.inventory.quantity <= view.inventory.alertThreshold
  );
}
