import type { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Espresso",
    description: "Bold and intense coffee drinks",
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "cat-2",
    name: "Latte",
    description: "Creamy milk-based coffee drinks",
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "cat-3",
    name: "Iced Coffee",
    description: "Refreshing cold coffee beverages",
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "cat-4",
    name: "Specialty",
    description: "Unique and seasonal coffee creations",
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
];
