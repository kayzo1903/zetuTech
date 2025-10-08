// components/cart/cart-badge.tsx
'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { summary } = useCartStore();
  
  return (
    <div className={`relative ${className}`}>
      <ShoppingCart className="h-5 w-5" />
      {!summary.isEmpty && (
        <div className="absolute -top-2 -right-2">
          <div className="relative">
            <div className={`h-4 w-4 bg-red-500 rounded-full flex items-center justify-center ${
              summary.totalItems > 0 ? 'animate-ping' : ''
            }`} />
            <div className="absolute inset-0 h-4 w-4 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">
                {summary.totalItems > 99 ? '99+' : summary.totalItems}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}