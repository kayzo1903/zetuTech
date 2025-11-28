// components/cart/add-to-cart-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart/store';
import {  ProductAttributeSelection } from '@/lib/cart/types';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types/product';

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