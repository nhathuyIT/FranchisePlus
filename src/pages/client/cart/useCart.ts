import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderItem } from '@/types/order';

export type CartItem = Omit<OrderItem, 'productFranchiseId'> & {
  productFranchiseId: string | number;
  imageUrl?: string;
};

export interface Cart extends Omit<Order, 'id' | 'code' | 'confirmedAt' | 'completedAt' | 'cancelledAt' | 'createdBy'> {
  id: string;
  code: string;
  items: CartItem[];
}

function getDefaultCart(): Cart {
  return {
    id: 'draft',
    code: 'DRAFT',
    franchiseId: 1,
    customerId: 1,
    type: 'ONLINE',
    status: 'DRAFT',
    totalAmount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    items: [],
  };
}

interface CartStore {
  cart: Cart;
  addItem: (productId: string | number, productName: string, price: number, quantity?: number, imageUrl?: string) => void;
  updateQuantity: (productId: string | number, newQuantity: number) => void;
  removeItem: (productId: string | number) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: getDefaultCart(),

      addItem: (productId, productName, price, quantity = 1, imageUrl?: string) => {
        if (productId == null || productId === '' || Number.isNaN(productId)) return;

        const { cart } = get();
        const items = Array.isArray(cart?.items) ? cart.items : [];

        // Dedup: exact ID match, or same name + same price (covers different components
        // passing catalog-id vs franchise-id for the same logical product)
        const existing = items.find(
          item =>
            item.productFranchiseId === productId ||
            (item.productNameSnapshot === productName && item.priceSnapshot === price),
        );

        let newItems: CartItem[];
        if (existing) {
          newItems = items.map(item =>
            item === existing
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  lineTotal: (item.quantity + quantity) * item.priceSnapshot,
                  ...(imageUrl ? { imageUrl } : {}),
                }
              : item,
          );
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            orderId: 0,
            productFranchiseId: productId,
            productNameSnapshot: productName,
            priceSnapshot: price,
            quantity,
            lineTotal: price * quantity,
            imageUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
          };
          newItems = [...items, newItem];
        }

        set({
          cart: {
            ...cart,
            items: newItems,
            totalAmount: newItems.reduce((sum, i) => sum + i.lineTotal, 0),
            updatedAt: new Date().toISOString(),
          },
        });
      },

      updateQuantity: (productId, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const { cart } = get();
        set({
          cart: {
            ...cart,
            items: cart.items.map(item =>
              item.productFranchiseId === productId
                ? {
                    ...item,
                    quantity: newQuantity,
                    lineTotal: newQuantity * item.priceSnapshot,
                  }
                : item
            ),
            updatedAt: new Date().toISOString(),
          },
        });
      },

      removeItem: (productId) => {
        const { cart } = get();
        set({
          cart: {
            ...cart,
            items: cart.items.filter(item => item.productFranchiseId !== productId),
            updatedAt: new Date().toISOString(),
          },
        });
      },

      clearCart: () => set({ cart: getDefaultCart() }),
    }),
    {
      name: 'coffee_cart',
      version: 2,
      migrate: () => ({ cart: getDefaultCart() }),
    }
  )
);

// Hook giữ nguyên API cũ - tất cả component dùng chung 1 store
export function useCart() {
  const { cart, addItem, updateQuantity, removeItem, clearCart } = useCartStore();

  const subtotal = cart.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalAmount = subtotal;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalAmount,
    itemCount,
  };
}
