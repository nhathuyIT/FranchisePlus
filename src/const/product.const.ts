import type { Product } from "@/types/product.type";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    categoryId: "cat-1",
    name: "Classic Espresso",
    description: "Bold and intense with rich crema",
    price: 3.5,
    images: [
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop",
    ],
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "prod-2",
    categoryId: "cat-2",
    name: "Smooth Latte",
    description: "Creamy perfection with velvety foam",
    price: 4.5,
    images: [
      "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&auto=format&fit=crop",
    ],
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "prod-3",
    categoryId: "cat-2",
    name: "Caramel Macchiato",
    description: "Sweet caramel meets bold espresso",
    price: 5.0,
    images: [
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop",
    ],
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "prod-4",
    categoryId: "cat-3",
    name: "Iced Americano",
    description: "Refreshing and bold over ice",
    price: 4.0,
    images: [
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&auto=format&fit=crop",
    ],
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "prod-5",
    categoryId: "cat-2",
    name: "Vanilla Cappuccino",
    description: "Classic with a hint of vanilla",
    price: 4.75,
    images: [
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop",
    ],
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "prod-6",
    categoryId: "cat-4",
    name: "Mocha Delight",
    description: "Rich chocolate meets premium coffee",
    price: 5.25,
    images: [
      "https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=749&auto=format&fit=crop",
    ],
    status: "active",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  }
];
