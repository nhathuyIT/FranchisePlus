export interface CoffeeProduct {
  id: number;
  sku: string;
  name: string;
  description: string;
  image: string;
  min_price: number;
  max_price: number;
  is_active: boolean;
}

export const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: 1,
    sku: "CF-ESP-001",
    name: "Classic Espresso",
    description: "Bold and intense with rich crema",
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop",
    min_price: 49000,
    max_price: 49000,
    is_active: true,
  },
  {
    id: 2,
    sku: "CF-LAT-002",
    name: "Smooth Latte",
    description: "Creamy perfection with velvety foam",
    image:
      "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&auto=format&fit=crop",
    min_price: 45000,
    max_price: 55000,
    is_active: true,
  },
  {
    id: 3,
    sku: "CF-MAC-003",
    name: "Caramel Macchiato",
    description: "Sweet caramel meets bold espresso",
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop",
    min_price: 52000,
    max_price: 62000,
    is_active: true,
  },
  {
    id: 4,
    sku: "CF-AME-004",
    name: "Iced Americano",
    description: "Refreshing and bold over ice",
    image:
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&auto=format&fit=crop",
    min_price: 39000,
    max_price: 39000,
    is_active: true,
  },
  {
    id: 5,
    sku: "CF-CAP-005",
    name: "Vanilla Cappuccino",
    description: "Classic with a hint of vanilla",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop",
    min_price: 47000,
    max_price: 57000,
    is_active: true,
  },
  {
    id: 6,
    sku: "CF-MOC-006",
    name: "Mocha Delight",
    description: "Rich chocolate meets premium coffee",
    image:
      "https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=749&auto=format&fit=crop",
    min_price: 55000,
    max_price: 65000,
    is_active: true,
  },
];
