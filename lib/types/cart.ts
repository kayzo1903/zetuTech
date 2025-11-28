// lib/cart/types.ts

import { Product } from "./product";

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
