import type { Category } from "@/types/category";
import type { ID } from "@/types/common";

export const CATEGORIES: Category[] = [
  {
    id: 1 as ID,
    code: "MUST_TRY",
    name: "Must Try",
    description: "Featured products of the day",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: 2 as ID,
    code: "COFFEE",
    name: "Coffee",
    description: "Brewed and specialty coffee drinks",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: 3 as ID,
    code: "TEA",
    name: "Tea",
    description: "Fruit teas and milk teas",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: 4 as ID,
    code: "FOOD",
    name: "Food",
    description: "Bakery and light meals",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
];
