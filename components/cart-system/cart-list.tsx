// app/components/cart-system/cart-list.tsx
'use client';

import { useCartStore } from '@/lib/cart/store';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck, RotateCcw, Heart, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CartList() {
  const { items, summary, updateQuantity, removeItem, clearCart, isLoading } = useCartStore();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityUpdate = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      await updateQuantity(cartItemId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      console.error(error)
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartItemId: string, productName: string) => {
    try {
      await removeItem(cartItemId);
      toast.success(`${productName} removed from cart`);
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (items.length === 0) return;
    
    if (confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (error) {
        console.error(error)
        toast.error('Failed to clear cart');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-4 bg-gray-100 rounded-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (summary.isEmpty) {
    return (
      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6">
        <div className="text-center py-8 sm:py-16">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
            Looks like you haven&apos;t added any products to your cart yet. Start shopping to discover amazing deals!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/products" className="flex-1 sm:flex-none">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
                Start Shopping
              </Button>
            </Link>
            <Link href="/" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full text-sm sm:text-base">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Mobile Back Navigation */}
      <div className="lg:hidden mb-4">
        <Link href="/products">
          <Button variant="ghost" size="sm" className="pl-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            {summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'} • {summary.totalUniqueItems} unique products
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleClearCart}
          disabled={items.length === 0}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto justify-center"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        {/* Cart Items - Main Content */}
        <div className="lg:col-span-2">
          {/* Cart Items List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-4">
                  {/* Product Image */}
                  <Link 
                    href={`/products/${item.product.slug}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.product.slug}`}
                          className="hover:text-blue-600 transition-colors block"
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg line-clamp-2 leading-tight">
                            {item.product.name}
                          </h3>
                        </Link>
                        
                        {/* Product Attributes */}
                        {item.selectedAttributes && (
                          <div className="mt-1 sm:mt-2 flex flex-wrap gap-1">
                            {Object.entries(item.selectedAttributes).map(([key, value]) => (
                              <span
                                key={key}
                                className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-300"
                              >
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stock Status */}
                        <div className="mt-1 sm:mt-2">
                          {item.product.stock > 10 ? (
                            <span className="text-green-600 text-xs sm:text-sm">In Stock</span>
                          ) : item.product.stock > 0 ? (
                            <span className="text-orange-600 text-xs sm:text-sm">
                              Only {item.product.stock} left
                            </span>
                          ) : (
                            <span className="text-red-600 text-xs sm:text-sm">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.product.name)}
                        disabled={updatingItems.has(item.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0 ml-1"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3 sm:mt-4">
                      {/* Price */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.product.hasDiscount ? (
                            <>
                              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                TZS {item.price.toLocaleString()}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                TZS {item.product.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                Save {Math.round((1 - item.price / item.product.originalPrice) * 100)}%
                              </span>
                            </>
                          ) : (
                            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                              TZS {item.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          TZS {(item.price * item.quantity).toLocaleString()} total
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <span className="text-sm text-gray-600 sm:hidden">Qty:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <div className="w-8 sm:w-12 text-center">
                            {updatingItems.has(item.id) ? (
                              <div className="animate-pulse text-xs sm:text-sm">...</div>
                            ) : (
                              <span className="font-medium text-sm sm:text-base">{item.quantity}</span>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock || updatingItems.has(item.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Free Shipping</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Over TZS 500,000</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Warranty</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">1+ years</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Easy Returns</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">30-day policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sticky top-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Order Summary
            </h2>

            {/* Pricing Breakdown */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal ({summary.totalItems} items)</span>
                <span className="text-gray-900 dark:text-white">
                  TZS {summary.originalTotal.toLocaleString()}
                </span>
              </div>
              
              {summary.totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-green-600">
                    -TZS {summary.totalDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">
                  {summary.cartTotal > 500000 ? 'Free' : 'TZS 15,000'}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">
                  TZS {Math.round(summary.cartTotal * 0.18).toLocaleString()}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3">
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    TZS {summary.cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <Link href="/checkout" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 text-sm sm:text-base">
                  Proceed to Checkout
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              </Link>
              
              <Link href="/products">
                <Button variant="outline" className="w-full text-sm sm:text-base py-2 sm:py-3">
                  Continue Shopping
                </Button>
              </Link>

              <Button variant="ghost" className="w-full text-gray-600 text-sm sm:text-base py-2 sm:py-3">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Save for Later
              </Button>
            </div>

            {/* Security Badge */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 text-center">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Secure checkout • 256-bit SSL</span>
              </div>
            </div>
          </div>

          {/* Recently Viewed Suggestions - Hidden on mobile for space */}
          <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hidden sm:block">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">
              You might also like
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center py-2 sm:py-4">
              <p>Based on your cart items, we&apos;ll show recommendations here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}