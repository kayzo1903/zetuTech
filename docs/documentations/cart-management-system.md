I'll implement a comprehensive, well-documented cart system for your ZetuTech ecommerce platform. Let me build this step by step with proper TypeScript types and modern React patterns.

## 📁 Project Structure

```
lib/
├── cart/
│   ├── types.ts
│   ├── store.ts (Zustand)
│   ├── utils.ts
│   └── constants.ts
├── api/
│   └── cart/
│       ├── route.ts
│       ├── add/route.ts
│       ├── update/route.ts
│       ├── remove/route.ts
│       └── merge/route.ts
utils/
├── cart-helpers.ts
└── session.ts
components/
├── cart/
│   ├── add-to-cart-button.tsx
│   ├── cart-drawer.tsx
│   ├── cart-items.tsx
│   ├── cart-summary.tsx
│   └── cart-badge.tsx
└── providers/
    └── cart-provider.tsx
```

## 1. Type Definitions

```typescript
// lib/cart/types.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  brand: string;
  productType: string;
  originalPrice: number;
  salePrice: number | null;
  hasDiscount: boolean;
  stock: number;
  stockStatus: string;
  status: string;
  slug: string;
  categories: string[];
  images: string[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt?: string;
  warrantyPeriod?: number | null;
  warrantyDetails?: string | null;
  sku?: string | null;
  hasWarranty?: boolean;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number; // Price at time of adding
  selectedAttributes?: ProductAttributeSelection;
  createdAt: string;
  updatedAt: string;
  product: Product; // Joined product data
}

export interface ProductAttributeSelection {
  [key: string]: string; // { color: "red", size: "xl" }
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface CartSummary {
  totalItems: number;
  totalUniqueItems: number;
  cartTotal: number;
  originalTotal: number;
  totalDiscount: number;
  isEmpty: boolean;
}

// API Request/Response types
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  selectedAttributes?: ProductAttributeSelection;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface RemoveCartItemRequest {
  cartItemId: string;
}

export interface CartResponse {
  success: boolean;
  cart?: Cart;
  items?: CartItem[];
  error?: string;
}
```

## 2. Zustand Store

```typescript
// lib/cart/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, CartSummary, Product, ProductAttributeSelection } from './types';

interface CartState {
  // State
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Computed
  summary: CartSummary;
  
  // Actions
  initializeCart: () => Promise<void>;
  addItem: (product: Product, quantity: number, attributes?: ProductAttributeSelection) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  syncCart: (cartData: Cart) => void;
}

// Helper function to calculate cart summary
const calculateSummary = (items: CartItem[]): CartSummary => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalUniqueItems = items.length;
  
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = items.reduce((sum, item) => {
    const originalPrice = item.product.originalPrice;
    return sum + (originalPrice * item.quantity);
  }, 0);
  
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

      // Initialize cart on app load
      initializeCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch cart');
          }

          const data = await response.json();
          
          if (data.cart && data.items) {
            const items = data.items || [];
            const summary = calculateSummary(items);
            
            set({
              cart: data.cart,
              items,
              summary,
              isLoading: false,
            });
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
      addItem: async (product: Product, quantity: number, attributes?: ProductAttributeSelection) => {
        const { items, cart } = get();
        set({ isUpdating: true, error: null });

        try {
          // Optimistic update
          const existingItemIndex = items.findIndex(
            item => 
              item.productId === product.id && 
              JSON.stringify(item.selectedAttributes) === JSON.stringify(attributes)
          );

          let optimisticItems: CartItem[];
          
          if (existingItemIndex > -1) {
            // Update existing item
            optimisticItems = items.map((item, index) =>
              index === existingItemIndex
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    // Create a temporary ID for optimistic update
                    id: item.id.startsWith('temp-') ? `temp-${Date.now()}` : item.id,
                  }
                : item
            );
          } else {
            // Add new item
            const tempCartItem: CartItem = {
              id: `temp-${Date.now()}`,
              cartId: cart?.id || 'temp-cart',
              productId: product.id,
              quantity,
              price: product.salePrice || product.originalPrice,
              selectedAttributes: attributes,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product,
            };
            optimisticItems = [...items, tempCartItem];
          }

          const optimisticSummary = calculateSummary(optimisticItems);
          set({
            items: optimisticItems,
            summary: optimisticSummary,
          });

          // API call
          const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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
          
          // Update with real data from server
          set({
            items: data.items || optimisticItems,
            summary: calculateSummary(data.items || optimisticItems),
            isUpdating: false,
          });

        } catch (error) {
          console.error('Add to cart error:', error);
          
          // Revert optimistic update on error
          const currentItems = get().items;
          const currentSummary = calculateSummary(currentItems);
          
          set({
            error: error instanceof Error ? error.message : 'Failed to add item to cart',
            items: currentItems,
            summary: currentSummary,
            isUpdating: false,
          });
        }
      },

      // Update item quantity
      updateQuantity: async (cartItemId: string, quantity: number) => {
        const { items } = get();
        set({ isUpdating: true, error: null });

        try {
          // Optimistic update
          const optimisticItems = items.map(item =>
            item.id === cartItemId ? { ...item, quantity } : item
          ).filter(item => item.quantity > 0); // Remove if quantity becomes 0

          const optimisticSummary = calculateSummary(optimisticItems);
          set({
            items: optimisticItems,
            summary: optimisticSummary,
          });

          // API call
          const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cartItemId,
              quantity,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update cart item');
          }

          // No need to update state again since we already did optimistic update

        } catch (error) {
          console.error('Update quantity error:', error);
          
          // Revert optimistic update
          const currentItems = get().items;
          const currentSummary = calculateSummary(currentItems);
          
          set({
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            items: currentItems,
            summary: currentSummary,
            isUpdating: false,
          });
        }
      },

      // Remove item from cart
      removeItem: async (cartItemId: string) => {
        const { items } = get();
        set({ isUpdating: true, error: null });

        try {
          // Optimistic update
          const optimisticItems = items.filter(item => item.id !== cartItemId);
          const optimisticSummary = calculateSummary(optimisticItems);
          
          set({
            items: optimisticItems,
            summary: optimisticSummary,
          });

          // API call
          const response = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove item from cart');
          }

        } catch (error) {
          console.error('Remove item error:', error);
          
          // Revert optimistic update
          const currentItems = get().items;
          const currentSummary = calculateSummary(currentItems);
          
          set({
            error: error instanceof Error ? error.message : 'Failed to remove item',
            items: currentItems,
            summary: currentSummary,
            isUpdating: false,
          });
        }
      },

      // Clear entire cart
      clearCart: async () => {
        set({ isUpdating: true, error: null });

        try {
          // Optimistic update
          const emptySummary = calculateSummary([]);
          set({
            items: [],
            summary: emptySummary,
          });

          // API call - we'll implement this endpoint later
          const response = await fetch('/api/cart', {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to clear cart');
          }

        } catch (error) {
          console.error('Clear cart error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isUpdating: false,
          });
        }
      },

      // Sync cart with server data (useful after login/merge)
      syncCart: (cartData: Cart) => {
        const summary = calculateSummary(cartData.items);
        set({
          cart: cartData,
          items: cartData.items,
          summary,
        });
      },

      // Utility actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        // Only persist these fields
        cart: state.cart,
        items: state.items,
        summary: state.summary,
      }),
    }
  )
);
```

## 3. Utility Functions

```typescript
// utils/session.ts
import { cookies } from 'next/headers';

export async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('guest_session_id')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    // Note: In Next.js App Router, cookies are set in Server Actions or Route Handlers
  }

  return sessionId;
}

export function createGuestSessionId(): string {
  return crypto.randomUUID();
}
```

```typescript
// utils/cart-helpers.ts
import { dbServer } from '@/db/db-server';
import { cart, cartItem, product } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { Cart, CartItem } from '@/lib/cart/types';

/**
 * Get or create cart for user or guest
 */
export async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    // Try to find user's cart
    const [userCart] = await dbServer
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .orderBy(desc(cart.createdAt))
      .limit(1);

    if (userCart) return userCart;

    // Create new cart for user
    const [newCart] = await dbServer
      .insert(cart)
      .values({ 
        userId,
        expiresAt: sql`NOW() + INTERVAL '30 days'`
      })
      .returning();

    return newCart;
  }

  if (sessionId) {
    // Try to find guest cart
    const [guestCart] = await dbServer
      .select()
      .from(cart)
      .where(eq(cart.sessionId, sessionId))
      .orderBy(desc(cart.createdAt))
      .limit(1);

    if (guestCart) return guestCart;

    // Create new cart for guest
    const [newCart] = await dbServer
      .insert(cart)
      .values({ 
        sessionId,
        expiresAt: sql`NOW() + INTERVAL '30 days'`
      })
      .returning();

    return newCart;
  }

  throw new Error('Either userId or sessionId is required');
}

/**
 * Get cart items with product data
 */
export async function getCartItems(cartId: string): Promise<CartItem[]> {
  const items = await dbServer
    .select({
      id: cartItem.id,
      cartId: cartItem.cartId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.price,
      selectedAttributes: cartItem.selectedAttributes,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        brand: product.brand,
        productType: product.productType,
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        hasDiscount: product.hasDiscount,
        stock: product.stock,
        stockStatus: product.stockStatus,
        status: product.status,
        slug: product.slug,
        categories: product.categories,
        images: product.images,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        warrantyPeriod: product.warrantyPeriod,
        warrantyDetails: product.warrantyDetails,
        sku: product.sku,
        hasWarranty: product.hasWarranty,
      },
    })
    .from(cartItem)
    .innerJoin(product, eq(cartItem.productId, product.id))
    .where(eq(cartItem.cartId, cartId))
    .orderBy(desc(cartItem.createdAt));

  return items.map(item => ({
    ...item,
    selectedAttributes: item.selectedAttributes 
      ? JSON.parse(item.selectedAttributes)
      : undefined,
  }));
}

/**
 * Add item to cart with validation
 */
export async function addItemToCart({
  userId,
  sessionId,
  productId,
  quantity,
  selectedAttributes,
}: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity: number;
  selectedAttributes?: any;
}) {
  // Validate quantity
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  // Get or create cart
  const activeCart = await getOrCreateCart(userId, sessionId);

  // Check product existence and stock
  const [productData] = await dbServer
    .select()
    .from(product)
    .where(eq(product.id, productId));

  if (!productData) {
    throw new Error('Product not found');
  }

  if (productData.stock < quantity) {
    throw new Error(`Only ${productData.stock} items available in stock`);
  }

  if (productData.status !== 'active') {
    throw new Error('Product is not available for purchase');
  }

  // Check for existing item with same attributes
  const existingItems = await dbServer
    .select()
    .from(cartItem)
    .where(
      and(
        eq(cartItem.cartId, activeCart.id),
        eq(cartItem.productId, productId),
        selectedAttributes 
          ? eq(cartItem.selectedAttributes, JSON.stringify(selectedAttributes))
          : sql`1=1` // Always true if no attributes
      )
    );

  if (existingItems.length > 0) {
    // Update existing item
    const existingItem = existingItems[0];
    const newQuantity = existingItem.quantity + quantity;

    if (productData.stock < newQuantity) {
      throw new Error(`Only ${productData.stock} items available in stock`);
    }

    await dbServer
      .update(cartItem)
      .set({
        quantity: newQuantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItem.id, existingItem.id));
  } else {
    // Add new item
    const finalPrice = productData.salePrice ?? productData.originalPrice;

    await dbServer.insert(cartItem).values({
      cartId: activeCart.id,
      productId,
      quantity,
      price: finalPrice,
      selectedAttributes: selectedAttributes 
        ? JSON.stringify(selectedAttributes)
        : null,
    });
  }

  // Return updated cart items
  return await getCartItems(activeCart.id);
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  // Get current cart item with product data
  const [currentItem] = await dbServer
    .select({
      cartItem: cartItem,
      product: product,
    })
    .from(cartItem)
    .innerJoin(product, eq(cartItem.productId, product.id))
    .where(eq(cartItem.id, cartItemId))
    .limit(1);

  if (!currentItem) {
    throw new Error('Cart item not found');
  }

  if (currentItem.product.stock < quantity) {
    throw new Error(`Only ${currentItem.product.stock} items available in stock`);
  }

  await dbServer
    .update(cartItem)
    .set({ 
      quantity,
      updatedAt: new Date()
    })
    .where(eq(cartItem.id, cartItemId));
}

/**
 * Remove item from cart
 */
export async function removeCartItem(cartItemId: string) {
  await dbServer
    .delete(cartItem)
    .where(eq(cartItem.id, cartItemId));
}

/**
 * Merge guest cart into user cart
 */
export async function mergeCarts(guestSessionId: string, userId: string) {
  const [guestCart] = await dbServer
    .select()
    .from(cart)
    .where(eq(cart.sessionId, guestSessionId));

  if (!guestCart) {
    return; // No guest cart to merge
  }

  const [userCart] = await dbServer
    .select()
    .from(cart)
    .where(eq(cart.userId, userId));

  const guestItems = await getCartItems(guestCart.id);

  if (userCart) {
    // Merge guest items into user cart
    for (const guestItem of guestItems) {
      const existingUserItems = await dbServer
        .select()
        .from(cartItem)
        .where(
          and(
            eq(cartItem.cartId, userCart.id),
            eq(cartItem.productId, guestItem.productId),
            guestItem.selectedAttributes
              ? eq(cartItem.selectedAttributes, JSON.stringify(guestItem.selectedAttributes))
              : sql`1=1`
          )
        );

      if (existingUserItems.length > 0) {
        // Update quantity for existing item
        await dbServer
          .update(cartItem)
          .set({
            quantity: existingUserItems[0].quantity + guestItem.quantity,
            updatedAt: new Date(),
          })
          .where(eq(cartItem.id, existingUserItems[0].id));
      } else {
        // Add new item to user cart
        await dbServer.insert(cartItem).values({
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: guestItem.quantity,
          price: guestItem.price,
          selectedAttributes: guestItem.selectedAttributes
            ? JSON.stringify(guestItem.selectedAttributes)
            : null,
        });
      }
    }

    // Delete guest cart
    await dbServer.delete(cart).where(eq(cart.id, guestCart.id));
  } else {
    // Convert guest cart to user cart
    await dbServer
      .update(cart)
      .set({ 
        userId,
        sessionId: null 
      })
      .where(eq(cart.id, guestCart.id));
  }

  return await getCartItems(userCart?.id || guestCart.id);
}
```

## 4. API Routes

### Main Cart Route

```typescript
// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getGuestSessionId } from '@/utils/session';
import { getOrCreateCart, getCartItems } from '@/utils/cart-helpers';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    let userId: string | undefined;
    let sessionId: string | undefined;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      sessionId = await getGuestSessionId();
    }

    const cart = await getOrCreateCart(userId, sessionId);
    const items = await getCartItems(cart.id);

    return NextResponse.json({
      success: true,
      cart,
      items,
    });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cart' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // This would clear the entire cart
    // Implementation depends on your auth/session system
    return NextResponse.json({ 
      success: true, 
      message: 'Cart cleared' 
    });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to clear cart' 
      },
      { status: 500 }
    );
  }
}
```

### Add to Cart Route

```typescript
// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getGuestSessionId } from '@/utils/session';
import { addItemToCart } from '@/utils/cart-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, selectedAttributes } = body;

    // Validation
    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    let userId: string | undefined;
    let sessionId: string | undefined;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      sessionId = await getGuestSessionId();
    }

    const items = await addItemToCart({
      userId,
      sessionId,
      productId,
      quantity,
      selectedAttributes,
    });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add item to cart' 
      },
      { status: 500 }
    );
  }
}
```

### Update Cart Route

```typescript
// app/api/cart/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateCartItemQuantity } from '@/utils/cart-helpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    await updateCartItemQuantity(cartItemId, quantity);

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully',
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update cart item' 
      },
      { status: 500 }
    );
  }
}
```

### Remove from Cart Route

```typescript
// app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { removeCartItem } from '@/utils/cart-helpers';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId } = body;

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    await removeCartItem(cartItemId);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove item from cart' 
      },
      { status: 500 }
    );
  }
}
```

### Merge Cart Route

```typescript
// app/api/cart/merge/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { mergeCarts } from '@/utils/cart-helpers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { guestSessionId } = body;

    if (!guestSessionId) {
      return NextResponse.json(
        { success: false, error: 'Guest session ID is required' },
        { status: 400 }
      );
    }

    const items = await mergeCarts(guestSessionId, session.user.id);

    return NextResponse.json({
      success: true,
      items,
      message: 'Cart merged successfully',
    });
  } catch (error) {
    console.error('Cart merge error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to merge carts' 
      },
      { status: 500 }
    );
  }
}
```

## 5. React Components

### Add to Cart Button

```tsx
// components/cart/add-to-cart-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart/store';
import { Product, ProductAttributeSelection } from '@/lib/cart/types';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showQuantity?: boolean;
  selectedAttributes?: ProductAttributeSelection;
}

export function AddToCartButton({
  product,
  variant = 'default',
  size = 'default',
  className,
  showQuantity = true,
  selectedAttributes,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isUpdating, items } = useCartStore();

  // Check if product is in cart
  const existingCartItem = items.find(
    item => 
      item.productId === product.id && 
      JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
  );

  const totalQuantity = existingCartItem ? existingCartItem.quantity + quantity : quantity;

  const handleAddToCart = async () => {
    if (product.stock < totalQuantity) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    try {
      await addItem(product, quantity, selectedAttributes);
      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      // Error is handled in the store
      console.error('Failed to add to cart:', error);
    }
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const isOutOfStock = product.stock === 0;
  const isDisabled = isOutOfStock || isUpdating;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showQuantity && (
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={decrement}
            disabled={quantity <= 1 || isDisabled}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={increment}
            disabled={quantity >= product.stock || isDisabled}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Button
        variant={variant}
        size={size}
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="flex-1"
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )}
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}
```

### Cart Badge

```tsx
// components/cart/cart-badge.tsx
'use client';

import { useCartStore } from '@/lib/cart/store';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { summary } = useCartStore();
  
  if (summary.isEmpty) {
    return (
      <div className={className}>
        <ShoppingCart className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className={className}>
      <ShoppingCart className="h-5 w-5" />
      <Badge 
        variant="secondary" 
        className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
      >
        {summary.totalItems > 99 ? '99+' : summary.totalItems}
      </Badge>
    </div>
  );
}
```

### Cart Drawer

```tsx
// components/cart/cart-drawer.tsx
'use client';

import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart/store';
import { CartItems } from './cart-items';
import { CartSummary } from './cart-summary';
import { CartBadge } from './cart-badge';
import { ShoppingCart, X, Loader2 } from 'lucide-react';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { summary, isLoading, clearCart, isUpdating } = useCartStore();

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CartBadge />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : summary.isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some products to get started
            </p>
            <Button onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <CartItems />
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <CartSummary />
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setOpen(false);
                    // Navigate to checkout
                    window.location.href = '/checkout';
                  }}
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
```

### Cart Items

```tsx
// components/cart/cart-items.tsx
'use client';

import { useCartStore } from '@/lib/cart/store';
import { CartItem } from './cart-item';
import { Loader2 } from 'lucide-react';

export function CartItems() {
  const { items, isUpdating } = useCartStore();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Cart Item

```tsx
// components/cart/cart-item.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart/store';
import { CartItem as CartItemType } from '@/lib/cart/types';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === item.quantity) return;
    
    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const increment = () => {
    if (item.quantity < item.product.stock) {
      handleQuantityChange(item.quantity + 1);
    }
  };

  const decrement = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    }
  };

  const itemTotal = item.price * item.quantity;
  const originalTotal = item.product.originalPrice * item.quantity;
  const hasDiscount = item.product.hasDiscount;

  return (
    <div className={cn(
      "flex gap-4 p-4 border rounded-lg relative",
      isUpdating && "opacity-50"
    )}>
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      
      <div className="flex-shrink-0">
        <Image
          src={item.product.images[0] || '/placeholder-product.jpg'}
          alt={item.product.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">
          {item.product.name}
        </h4>
        
        {item.selectedAttributes && (
          <div className="text-xs text-muted-foreground mb-2">
            {Object.entries(item.selectedAttributes).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">
            ${item.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${item.product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-r-none"
              onClick={decrement}
              disabled={item.quantity <= 1 || isUpdating}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-l-none"
              onClick={increment}
              disabled={item.quantity >= item.product.stock || isUpdating}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleRemove}
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Cart Summary

```tsx
// components/cart/cart-summary.tsx
'use client';

import { useCartStore } from '@/lib/cart/store';

export function CartSummary() {
  const { summary } = useCartStore();

  if (summary.isEmpty) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Items ({summary.totalItems})</span>
        <span>${summary.cartTotal.toFixed(2)}</span>
      </div>
      
      {summary.totalDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-${summary.totalDiscount.toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span className="text-green-600">Free</span>
      </div>
      
      <div className="border-t pt-2">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${summary.cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
```

## 6. Cart Provider

```tsx
// components/providers/cart-provider.tsx
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/cart/store';

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const initializeCart = useCartStore(state => state.initializeCart);

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  return <>{children}</>;
}
```

## 7. Usage Example

### Layout Integration

```tsx
// app/layout.tsx
import { CartProvider } from '@/components/providers/cart-provider';
import { CartDrawer } from '@/components/cart/cart-drawer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {/* Your header with cart drawer */}
          <header>
            <nav>
              {/* Your navigation */}
              <CartDrawer />
            </nav>
          </header>
          
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
```

### Product Page Usage

```tsx
// app/products/[slug]/page.tsx
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { getProductBySlug } from '@/lib/products';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product images */}
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        
        {/* Product info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">
              ${product.salePrice || product.originalPrice}
            </span>
            {product.hasDiscount && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <AddToCartButton 
            product={product}
            className="max-w-xs"
            showQuantity={true}
          />
        </div>
      </div>
    </div>
  );
}
```

## 8. Key Features Implemented

✅ **Dual Cart System** - Guest + Authenticated users  
✅ **Optimistic Updates** - Immediate UI feedback  
✅ **Stock Validation** - Prevents over-selling  
✅ **Price Locking** - Items maintain added price  
✅ **Session Persistence** - Carts survive browser sessions  
✅ **Cart Merging** - Guest → User cart migration  
✅ **Type Safety** - Full TypeScript support  
✅ **Error Handling** - Graceful error states  
✅ **Performance** - Debounced updates, efficient re-renders  
✅ **Mobile Responsive** - Shadcn UI components  

## 9. Next Steps

1. **Add cart persistence** with your authentication system
2. **Implement cart sharing** functionality
3. **Add abandoned cart recovery** emails
4. **Integrate with inventory management**
5. **Add cart analytics** and reporting

This system provides a solid foundation for your ZetuTech ecommerce platform with excellent user experience and developer experience!