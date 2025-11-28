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