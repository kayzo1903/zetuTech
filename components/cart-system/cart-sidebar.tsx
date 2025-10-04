"use client";

import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import CartItem from "./cart-tems";
import { formatNumber } from "@/utils/formartCurency";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, getCartSummary, clearCart, clearUserCart, isGuest } = useCart();
  
  const { totalItems, subtotal, total, shipping, tax } = getCartSummary();
  const hasItems = totalItems > 0;

  if (!isOpen) return null;

  const handleClearCart = () => {
    if (isGuest()) {
      clearCart();
    } else {
      clearUserCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Cart
            </h2>
            {hasItems && (
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="h-full flex flex-col">
          {!state.cart || !hasItems ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                Add some amazing products to get started with your shopping
              </p>
              <Button onClick={onClose} size="lg">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(state.cart.type === 'guest' ? state.cart.data.items : state.cart.data.items).map((item, index) => (
                  <CartItem
                    key={isGuest() ? item.productId : `user-${item.id}`}
                    item={item}
                    variant="compact"
                    showImage={true}
                    showStock={true}
                    editable={true}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">{formatNumber(subtotal)}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-medium">{formatNumber(shipping)}</span>
                    </div>
                  )}
                  
                  {tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium">{formatNumber(tax)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {formatNumber(total)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex-1"
                    onClick={onClose}
                  >
                    <Link href="/products">
                      Continue Shopping
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={onClose}
                  >
                    <Link href="/cart" className="flex items-center gap-2">
                      View Cart
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Clear Cart Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={state.isUpdating}
                  className="w-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}