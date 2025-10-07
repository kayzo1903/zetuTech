// lib/cart/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, CartSummary, ProductAttributeSelection, CartProduct } from './types';
import { Product } from '../types/product';

// Helper function to calculate cart summary
const calculateSummary = (items: CartItem[]): CartSummary => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalUniqueItems = items.length;

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const originalTotal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const totalDiscount = originalTotal - cartTotal;
  const isEmpty = items.length === 0;

  return {
    totalItems,
    totalUniqueItems,
    cartTotal,
    originalTotal,
    totalDiscount,
    isEmpty,
  };
};

// Helper to convert Product → CartProduct
const toCartProduct = (product: Product): CartProduct => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  image: product.images?.[0] || '/placeholder.png',
  stock: product.stock,
  status: product.status,
  originalPrice: product.originalPrice,
  salePrice: product.salePrice,
  hasDiscount: product.hasDiscount,
});

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  summary: CartSummary;

  initializeCart: () => Promise<void>;
  addItem: (product: Product, quantity: number, attributes?: ProductAttributeSelection) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: (cartData: Cart) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      items: [],
      isLoading: false,
      isUpdating: false,
      error: null,
      summary: {
        totalItems: 0,
        totalUniqueItems: 0,
        cartTotal: 0,
        originalTotal: 0,
        totalDiscount: 0,
        isEmpty: true,
      },

      // Initialize cart from API
      initializeCart: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/cart', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error('Failed to fetch cart');
          const data = await response.json();

          if (data.cart && data.items) {
            const items = data.items || [];
            const summary = calculateSummary(items);
            set({ cart: data.cart, items, summary, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Cart initialization error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load cart',
            isLoading: false,
          });
        }
      },

      // Add item to cart
      addItem: async (product, quantity, attributes) => {
        const { items, cart } = get();
        set({ isUpdating: true, error: null });

        try {
          const existingItemIndex = items.findIndex(
            item =>
              item.productId === product.id &&
              JSON.stringify(item.selectedAttributes) === JSON.stringify(attributes)
          );

          let optimisticItems: CartItem[];

          if (existingItemIndex > -1) {
            optimisticItems = items.map((item, i) =>
              i === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const tempCartItem: CartItem = {
              id: `temp-${Date.now()}`,
              cartId: cart?.id || 'temp-cart',
              productId: product.id,
              quantity,
              price: product.salePrice ?? product.originalPrice,
              selectedAttributes: attributes,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: toCartProduct(product),
            };
            optimisticItems = [...items, tempCartItem];
          }

          set({
            items: optimisticItems,
            summary: calculateSummary(optimisticItems),
          });

          // API call
          const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              quantity,
              selectedAttributes: attributes,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add item to cart');
          }

          const data = await response.json();
          set({
            items: data.items || optimisticItems,
            summary: calculateSummary(data.items || optimisticItems),
            isUpdating: false,
          });
        } catch (error) {
          console.error('Add to cart error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to add item to cart',
            isUpdating: false,
          });
        }
      },

      // Update quantity
      updateQuantity: async (cartItemId, quantity) => {
        const { items } = get();
        set({ isUpdating: true, error: null });

        try {
          const optimisticItems = items
            .map(item => (item.id === cartItemId ? { ...item, quantity } : item))
            .filter(item => item.quantity > 0);

          set({
            items: optimisticItems,
            summary: calculateSummary(optimisticItems),
          });

          const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId, quantity }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update cart item');
          }

          set({ isUpdating: false });
        } catch (error) {
          console.error('Update quantity error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            isUpdating: false,
          });
        }
      },

      // Remove item
      removeItem: async (cartItemId) => {
        const { items } = get();
        set({ isUpdating: true, error: null });

        try {
          const optimisticItems = items.filter(item => item.id !== cartItemId);
          set({
            items: optimisticItems,
            summary: calculateSummary(optimisticItems),
          });

          const response = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove item');
          }

          set({ isUpdating: false });
        } catch (error) {
          console.error('Remove item error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to remove item',
            isUpdating: false,
          });
        }
      },

      // Clear cart
      clearCart: async () => {
        set({ isUpdating: true, error: null });

        try {
          set({
            items: [],
            summary: calculateSummary([]),
          });

          const response = await fetch('/api/cart', { method: 'DELETE' });
          if (!response.ok) throw new Error('Failed to clear cart');

          set({ isUpdating: false });
        } catch (error) {
          console.error('Clear cart error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isUpdating: false,
          });
        }
      },

      // Sync cart after login/merge
      syncCart: (cartData: Cart) => {
        const summary = calculateSummary(cartData.items);
        set({
          cart: cartData,
          items: cartData.items,
          summary,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
        items: state.items,
        summary: state.summary,
      }),
    }
  )
);
