// src/store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  totalItems: number;
  totalPrice: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            // Check if new quantity exceeds stock
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
              throw new Error(
                `Cannot add more items. Only ${product.stock} available in stock.`
              );
            }

            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }

          // Check stock before adding new item
          if (quantity > product.stock) {
            throw new Error(
              `Cannot add ${quantity} items. Only ${product.stock} available in stock.`
            );
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const item = state.items.find((item) => item.product._id === productId);
          if (!item) return state;

          // Check stock limit
          if (quantity > item.product.stock) {
            throw new Error(
              `Cannot set quantity to ${quantity}. Only ${item.product.stock} available in stock.`
            );
          }

          return {
            items: state.items.map((item) =>
              item.product._id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      get totalPrice() {
        return get().items.reduce(
          (total, item) => total + item.product.costInVouchers * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
