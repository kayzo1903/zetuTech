// components/cart/cart-items.tsx
'use client';

import { useCartStore } from '@/lib/cart/store';
import { Loader2 } from 'lucide-react';
import { CartItem } from './cart-item';

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