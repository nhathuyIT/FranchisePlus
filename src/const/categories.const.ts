import type { Category } from "@/types/category";
import type { ID } from "@/types/common";

// Re-export Category type for easy import
export type { Category };

export const CATEGORIES: Category[] = [
  {
    id: 1 as ID,
    code: "MUST_TRY",
    name: "Must Try",
    description: "Featured products of the day",
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: 2 as ID,
    code: "COFFEE",
    name: "Coffee",
    description: "Brewed and specialty coffee drinks",
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: 3 as ID,
    code: "TEA",
    name: "Tea",
    description: "Fruit teas and milk teas",
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: 4 as ID,
    code: "FOOD",
    name: "Food",
    description: "Bakery and light meals",
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
];
