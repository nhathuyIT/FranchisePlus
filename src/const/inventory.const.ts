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
    SKU: "ARAB-BEAN-001",
    name: "Arabica Coffee Beans",
    description: "Premium Arabica coffee beans",
    content: null,
    min_price: 200000,
    max_price: 250000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    SKU: "ROBU-BEAN-002",
    name: "Robusta Coffee Beans",
    description: "Strong Robusta coffee beans",
    content: null,
    min_price: 150000,
    max_price: 200000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 3,
    SKU: "MILK-WHOLE-003",
    name: "Whole Milk",
    description: "Fresh whole milk",
    content: null,
    min_price: 15000,
    max_price: 20000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 4,
    SKU: "SUGAR-WHITE-004",
    name: "White Sugar",
    description: "Premium white sugar",
    content: null,
    min_price: 20000,
    max_price: 30000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 5,
    SKU: "SYRUP-CHOC-005",
    name: "Chocolate Syrup",
    description: "Rich chocolate syrup",
    content: null,
    min_price: 90000,
    max_price: 110000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 6,
    SKU: "SYRUP-VANI-006",
    name: "Vanilla Syrup",
    description: "Sweet vanilla syrup",
    content: null,
    min_price: 80000,
    max_price: 100000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 7,
    SKU: "MILK-ALMOND-007",
    name: "Almond Milk",
    description: "Plant-based almond milk",
    content: null,
    min_price: 25000,
    max_price: 35000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 8,
    SKU: "SYRUP-CARA-008",
    name: "Caramel Syrup",
    description: "Sweet caramel syrup",
    content: null,
    min_price: 85000,
    max_price: 105000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 9,
    SKU: "MILK-OAT-009",
    name: "Oat Milk",
    description: "Creamy oat milk",
    content: null,
    min_price: 30000,
    max_price: 40000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 10,
    SKU: "SYRUP-HAZE-010",
    name: "Hazelnut Syrup",
    description: "Nutty hazelnut syrup",
    content: null,
    min_price: 95000,
    max_price: 110000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 11,
    SKU: "CREAM-WHIP-011",
    name: "Whipped Cream",
    description: "Fresh whipped cream",
    content: null,
    min_price: 45000,
    max_price: 55000,
    is_active: true,
    is_deleted: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
];

/**
 * Mock inventory data - 22 records distributed across 10 franchises
 * Includes low stock items (quantity <= alert_threshold) for testing alerts
 */
export const INVENTORY_MOCK: Inventory[] = [
  { id: 1, product_franchise_id: 1, quantity: 150, alert_threshold: 50, is_active: true, is_deleted: false, created_at: "2025-01-01T08:00:00Z", updated_at: "2025-01-30T10:00:00Z" },
  { id: 2, product_franchise_id: 2, quantity: 30, alert_threshold: 40, is_active: true, is_deleted: false, created_at: "2025-01-01T08:00:00Z", updated_at: "2025-01-29T14:30:00Z" },
  { id: 3, product_franchise_id: 3, quantity: 80, alert_threshold: 30, is_active: true, is_deleted: false, created_at: "2025-01-01T08:00:00Z", updated_at: "2025-01-30T09:15:00Z" },
  { id: 4, product_franchise_id: 1, quantity: 20, alert_threshold: 50, is_active: true, is_deleted: false, created_at: "2025-01-02T09:00:00Z", updated_at: "2025-01-30T08:45:00Z" },
  { id: 5, product_franchise_id: 4, quantity: 60, alert_threshold: 20, is_active: true, is_deleted: false, created_at: "2025-01-02T09:00:00Z", updated_at: "2025-01-29T16:20:00Z" },
  { id: 6, product_franchise_id: 5, quantity: 15, alert_threshold: 25, is_active: true, is_deleted: false, created_at: "2025-01-02T09:00:00Z", updated_at: "2025-01-30T11:00:00Z" },
  { id: 7, product_franchise_id: 2, quantity: 100, alert_threshold: 40, is_active: true, is_deleted: false, created_at: "2025-01-03T07:30:00Z", updated_at: "2025-01-29T13:40:00Z" },
  { id: 8, product_franchise_id: 6, quantity: 35, alert_threshold: 20, is_active: true, is_deleted: false, created_at: "2025-01-03T07:30:00Z", updated_at: "2025-01-30T10:25:00Z" },
  { id: 9, product_franchise_id: 3, quantity: 25, alert_threshold: 30, is_active: true, is_deleted: false, created_at: "2025-01-04T10:00:00Z", updated_at: "2025-01-30T07:50:00Z" },
  { id: 10, product_franchise_id: 7, quantity: 40, alert_threshold: 15, is_active: true, is_deleted: false, created_at: "2025-01-04T10:00:00Z", updated_at: "2025-01-29T15:10:00Z" },
  { id: 11, product_franchise_id: 1, quantity: 75, alert_threshold: 50, is_active: true, is_deleted: false, created_at: "2025-01-04T10:00:00Z", updated_at: "2025-01-30T12:30:00Z" },
  { id: 12, product_franchise_id: 8, quantity: 10, alert_threshold: 20, is_active: false, is_deleted: false, created_at: "2025-01-05T08:45:00Z", updated_at: "2025-01-28T09:00:00Z" },
  { id: 13, product_franchise_id: 1, quantity: 120, alert_threshold: 50, is_active: true, is_deleted: false, created_at: "2025-01-06T09:30:00Z", updated_at: "2025-01-30T11:45:00Z" },
  { id: 14, product_franchise_id: 9, quantity: 18, alert_threshold: 25, is_active: true, is_deleted: false, created_at: "2025-01-06T09:30:00Z", updated_at: "2025-01-29T17:20:00Z" },
  { id: 15, product_franchise_id: 2, quantity: 90, alert_threshold: 40, is_active: true, is_deleted: false, created_at: "2025-01-07T07:00:00Z", updated_at: "2025-01-30T08:15:00Z" },
  { id: 16, product_franchise_id: 10, quantity: 28, alert_threshold: 20, is_active: true, is_deleted: false, created_at: "2025-01-07T07:00:00Z", updated_at: "2025-01-29T12:40:00Z" },
  { id: 17, product_franchise_id: 4, quantity: 45, alert_threshold: 20, is_active: true, is_deleted: false, created_at: "2025-01-08T10:20:00Z", updated_at: "2025-01-30T09:50:00Z" },
  { id: 18, product_franchise_id: 3, quantity: 12, alert_threshold: 30, is_active: true, is_deleted: false, created_at: "2025-01-08T10:20:00Z", updated_at: "2025-01-30T06:30:00Z" },
  { id: 19, product_franchise_id: 1, quantity: 65, alert_threshold: 50, is_active: true, is_deleted: false, created_at: "2025-01-09T08:10:00Z", updated_at: "2025-01-29T14:15:00Z" },
  { id: 20, product_franchise_id: 11, quantity: 22, alert_threshold: 15, is_active: true, is_deleted: false, created_at: "2025-01-09T08:10:00Z", updated_at: "2025-01-30T13:25:00Z" },
  { id: 21, product_franchise_id: 5, quantity: 8, alert_threshold: 25, is_active: true, is_deleted: false, created_at: "2025-01-10T09:45:00Z", updated_at: "2025-01-30T10:40:00Z" },
  { id: 22, product_franchise_id: 2, quantity: 110, alert_threshold: 40, is_active: true, is_deleted: false, created_at: "2025-01-10T09:45:00Z", updated_at: "2025-01-29T16:55:00Z" },
];

/**
 * Helper function to create InventoryItemView for UI display
 * Maps inventory records to view models with product and franchise info
 */
export function createInventoryItemView(inventory: Inventory): InventoryItemView | null {
  // Map product_franchise_id to product (simplified - using modulo for cycling through products)
  const productIndex = Number(inventory.product_franchise_id) - 1;
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
      SKU: mockProduct.SKU,
      description: mockProduct.description,
    },
    productFranchise: {
      id: inventory.product_franchise_id,
      franchise_id: franchise.id,
      product_id: mockProduct.id,
      price_base: mockProduct.min_price, // Use min_price as base price
      is_active: true,
      is_deleted: false,
      created_at: inventory.created_at,
      updated_at: inventory.updated_at,
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
    view => view.productFranchise.franchise_id === franchiseId
  );
}

/**
 * Get low stock items (quantity <= alert_threshold)
 */
export function getLowStockItems(): InventoryItemView[] {
  return getInventoryItemViews().filter(
    view => view.inventory.quantity <= view.inventory.alert_threshold
  );
}
