import type { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  {
    id: 1,
    code: "espresso",
    name: "Espresso",
    description: "Bold and intense coffee drinks",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 2,
    code: "latte",
    name: "Latte",
    description: "Creamy milk-based coffee drinks",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 3,
    code: "iced-coffee",
    name: "Iced Coffee",
    description: "Refreshing cold coffee beverages",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 4,
    code: "specialty",
    name: "Specialty",
    description: "Unique and seasonal coffee creations",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
];
