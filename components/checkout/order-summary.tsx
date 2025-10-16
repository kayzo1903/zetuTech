// components/checkout/order-summary.tsx
"use client";

import { useCartStore } from "@/lib/cart/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutData } from "@/lib/types/checkout";
import { Shield, User } from "lucide-react";

interface OrderSummaryProps {
  checkoutData: CheckoutData;
  isGuest?: boolean; // Add this prop
}

export default function OrderSummary({
  checkoutData,
  isGuest = false,
}: OrderSummaryProps) {
  const { summary, items } = useCartStore();

  // ✅ Fixed shipping logic: Free in Dar es Salaam, 15,000 elsewhere
  const isDarEsSalaam = checkoutData.contact?.region === "Dar es Salaam";
  const shippingCost = isDarEsSalaam ? 0 : 15000;

  const total = summary.cartTotal + shippingCost 

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order Summary</CardTitle>
          {isGuest && (
            <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              <User className="w-3 h-3" />
              Guest
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Guest Notice */}
        {isGuest && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Guest Checkout
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Save your order number to track your order later.
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  You&apos;re checking out as a guest. Your order will be
                  processed normally, but you won&apos;t have access to order
                  history unless you create an account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × TZS {item.price.toLocaleString()}
                </p>
                {item.selectedAttributes &&
                  Object.keys(item.selectedAttributes).length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {Object.values(item.selectedAttributes).join(", ")}
                    </p>
                  )}
              </div>
              <p className="text-sm font-medium whitespace-nowrap">
                TZS {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>TZS {summary.cartTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `TZS ${shippingCost.toLocaleString()}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax </span>
            <span> - </span>
          </div>

          {summary.totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-TZS {summary.totalDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>TZS {Math.round(total).toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Notice */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            {isDarEsSalaam ? (
              <span className="text-green-600">
                🎉 Free delivery in Dar es Salaam!
              </span>
            ) : (
              <span>
                Shipping to {checkoutData.contact?.region || "your region"}: TZS
                15,000
              </span>
            )}
          </p>
        </div>

        {/* Security Badge */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Secure checkout • 256-bit SSL encryption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
