// components/cart/cart-badge.tsx
'use client';


import { ShoppingCart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useCartStore } from '@/lib/cart/store';

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