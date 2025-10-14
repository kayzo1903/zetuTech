// components/cart/product-action-buttons.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart/store';
import { ProductAttributeSelection } from '@/lib/cart/types';
import { Minus, Plus, ShoppingCart, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types/product';
import { useRouter } from 'next/navigation';

interface ProductActionButtonsProps {
  product: Product;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showQuantity?: boolean;
  selectedAttributes?: ProductAttributeSelection;
  layout?: 'horizontal' | 'vertical';
}

export function ProductActionButtons({
  product,
  size = 'default',
  className,
  showQuantity = true,
  selectedAttributes,
  layout = 'horizontal',
}: ProductActionButtonsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isBuyNowProcessing, setIsBuyNowProcessing] = useState(false);
  const { addItem, isUpdating, items } = useCartStore();
  const router = useRouter();

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
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleBuyNow = async () => {
    if (product.stock < totalQuantity) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    setIsBuyNowProcessing(true);

    try {
      await addItem(product, quantity, selectedAttributes);
      router.push('/checkout');
    } catch (error) {
      console.error('Failed to process buy now:', error);
      setIsBuyNowProcessing(false);
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
  const isDisabled = isOutOfStock || isUpdating || isBuyNowProcessing;

  if (layout === 'vertical') {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Quantity Selector */}
        {showQuantity && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quantity:</span>
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleBuyNow}
            disabled={isDisabled}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            size={size}
          >
            {isBuyNowProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Buy Now
          </Button>

          <Button
            onClick={handleAddToCart}
            disabled={isDisabled}
            variant="outline"
            className="w-full"
            size={size}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ShoppingCart className="h-4 w-4 mr-2" />
            )}
            Add to Cart
          </Button>
        </div>
      </div>
    );
  }

  // Horizontal Layout (default)
  return (
    <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
      {/* Quantity Selector */}
      {showQuantity && (
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={decrement}
            disabled={quantity <= 1 || isDisabled}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center text-sm font-medium">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={increment}
            disabled={quantity >= product.stock || isDisabled}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-1 gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          variant="outline"
          className="flex-1"
          size={size}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          Add to Cart
        </Button>

        <Button
          onClick={handleBuyNow}
          disabled={isDisabled}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          size={size}
        >
          {isBuyNowProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Buy Now
        </Button>
      </div>
    </div>
  );
}