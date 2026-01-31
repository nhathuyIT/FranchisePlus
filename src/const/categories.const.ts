export interface Category {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    code: "MUST_TRY",
    name: "Must Try",
    description: "Featured products of the day",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: 2,
    code: "COFFEE",
    name: "Coffee",
    description: "Brewed and specialty coffee drinks",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: 3,
    code: "TEA",
    name: "Tea",
    description: "Fruit teas and milk teas",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: 4,
    code: "FOOD",
    name: "Food",
    description: "Bakery and light meals",
    is_active: true,
    is_deleted: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
];
