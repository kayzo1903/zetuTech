// components/cart/cart-drawer.tsx - ADD THIS BUTTON
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
import { CartBadge } from './cart-badge';
import { ShoppingCart, X, Loader2, ArrowRight } from 'lucide-react';
import { CartItems } from './cart-items';
import { CartSummary } from './cart-summary';
import Link from 'next/link'; // ✅ Add this import

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
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-white dark:bg-gray-800">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart ({summary.totalItems})</span>
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
              
              <div className="space-y-2 px-2">
                {/* ✅ ADD THIS: View Full Cart Button */}
                <Button 
                  variant="outline"
                  className="w-full" 
                  asChild
                >
                  <Link 
                    href="/cart" 
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center"
                  >
                    View Full Cart Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setOpen(false);
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