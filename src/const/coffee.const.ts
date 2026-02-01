export interface CoffeeProduct {
  name: string;
  description: string;
  image: string;
}

export const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    name: "Classic Espresso",
    description: "Bold and intense with rich crema",
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop",
  },
  {
    name: "Smooth Latte",
    description: "Creamy perfection with velvety foam",
    image:
      "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&auto=format&fit=crop",
  },
  {
    name: "Caramel Macchiato",
    description: "Sweet caramel meets bold espresso",
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop",
  },
  {
    name: "Iced Americano",
    description: "Refreshing and bold over ice",
    image:
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&auto=format&fit=crop",
  },
  {
    name: "Vanilla Cappuccino",
    description: "Classic with a hint of vanilla",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop",
  },
  {
    name: "Mocha Delight",
    description: "Rich chocolate meets premium coffee",
    image:
      "https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=749&auto=format&fit=crop",
  },
];
