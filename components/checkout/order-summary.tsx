// components/checkout/order-summary.tsx
'use client';

import { useCartStore } from '@/lib/cart/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutData } from '@/lib/types/checkout';

interface OrderSummaryProps {
  checkoutData: CheckoutData;
}

export default function OrderSummary({ checkoutData }: OrderSummaryProps) {
  const { summary, items } = useCartStore();

  // ✅ Fixed shipping logic: Free in Dar es Salaam, 15,000 elsewhere
  const isDarEsSalaam = checkoutData.contact?.region === 'Dar es Salaam';
  const shippingCost = isDarEsSalaam ? 0 : 15000;
  
  const tax = summary.cartTotal * 0.18; // 18% VAT
  const total = summary.cartTotal + shippingCost + tax;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × TZS {item.price.toLocaleString()}
                </p>
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
            <span>Tax (18% VAT)</span>
            <span>TZS {Math.round(tax).toLocaleString()}</span>
          </div>

          {summary.totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-TZS {summary.totalDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>TZS {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Notice */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            {isDarEsSalaam ? (
              <span className="text-green-600">🎉 Free delivery in Dar es Salaam!</span>
            ) : (
              <span>Shipping to {checkoutData.contact?.region}: TZS 15,000</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}