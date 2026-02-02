import type { Product } from "@/types/product.type";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    SKU: "ESP-001",
    name: "Classic Espresso",
    description: "Bold and intense with rich crema",
    content: "Premium espresso beans, single shot",
    min_price: 3.0,
    max_price: 4.0,
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 2,
    SKU: "LAT-001",
    name: "Smooth Latte",
    description: "Creamy perfection with velvety foam",
    content: "Espresso with steamed milk and foam",
    min_price: 4.0,
    max_price: 5.0,
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 3,
    SKU: "MAC-001",
    name: "Caramel Macchiato",
    description: "Sweet caramel meets bold espresso",
    content: "Espresso, steamed milk, vanilla syrup, caramel drizzle",
    min_price: 4.5,
    max_price: 5.5,
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 4,
    SKU: "ICE-001",
    name: "Iced Americano",
    description: "Refreshing and bold over ice",
    content: "Espresso shots over ice with cold water",
    min_price: 3.5,
    max_price: 4.5,
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 5,
    SKU: "CAP-001",
    name: "Vanilla Cappuccino",
    description: "Classic with a hint of vanilla",
    content: "Espresso, steamed milk, vanilla syrup, foam",
    min_price: 4.25,
    max_price: 5.25,
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 6,
    SKU: "MOC-001",
    name: "Mocha Delight",
    description: "Rich chocolate meets premium coffee",
    content: "Espresso, steamed milk, chocolate syrup, whipped cream",
    min_price: 4.75,
    max_price: 5.75,
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
];

// Temporary mock mapping: Product ID -> Category ID
export const PRODUCT_CATEGORY_MAP: Record<number, number> = {
  1: 1, // Espresso
  2: 2, // Latte
  3: 2, // Latte
  4: 3, // Iced Coffee
  5: 2, // Latte
  6: 4, // Specialty
};
