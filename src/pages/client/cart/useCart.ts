import { useState, useEffect } from 'react';
import type { Order, OrderItem } from '@/types/order';

const CART_KEY = 'coffee_cart';

export type CartItem = OrderItem;

export interface Cart extends Omit<Order, 'id' | 'code' | 'confirmed_at' | 'completed_at' | 'cancelled_at' | 'created_by'> {
  id: string;
  code: string;
  items: CartItem[];
}

function getInitialCart(): Cart {
  const raw = localStorage.getItem(CART_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  
  // Return minimal cart structure
  return {
    id: 'draft',
    code: 'DRAFT',
    franchise_id: 1,
    customer_id: 1,
    type: 'ONLINE',
    status: 'DRAFT',
    total_amount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
    items: [],
  };
}

export function useCart() {
  const [cart, setCart] = useState<Cart>(getInitialCart());

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Add item to cart or increase quantity if exists
  const addItem = (productId: number, productName: string, price: number, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.items.find(item => item.product_franchise_id === productId);
      
      if (existing) {
        // Update existing item
        return {
          ...prev,
          items: prev.items.map(item =>
            item.product_franchise_id === productId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  line_total: (item.quantity + quantity) * item.price_snapshot
                }
              : item
          ),
          updated_at: new Date().toISOString(),
        };
      }
      
      // Add new item
      const newItem: CartItem = {
        id: Date.now(), // Simple ID generation
        order_id: 0, // Will be set when order is created
        product_franchise_id: productId,
        product_name_snapshot: productName,
        price_snapshot: price,
        quantity: quantity,
        line_total: price * quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
      };
      
      return {
        ...prev,
        items: [...prev.items, newItem],
        updated_at: new Date().toISOString(),
      };
    });
  };

  // Update item quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product_franchise_id === productId
          ? {
              ...item,
              quantity: newQuantity,
              line_total: newQuantity * item.price_snapshot
            }
          : item
      ),
      updated_at: new Date().toISOString(),
    }));
  };

  // Remove item from cart
  const removeItem = (productId: number) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product_franchise_id !== productId),
      updated_at: new Date().toISOString(),
    }));
  };

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.line_total, 0);
  const totalAmount = subtotal; // Add taxes/fees here if needed

  // Clear cart
  const clearCart = () => {
    setCart(getInitialCart());
  };

  // Get item count
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
