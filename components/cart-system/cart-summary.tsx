// components/cart/cart-summary.tsx
"use client";

import { useCartStore } from "@/lib/cart/store";
import { formatNumber } from "@/utils/formartCurency";

export function CartSummary() {
  const { summary } = useCartStore();

  if (summary.isEmpty) {
    return null;
  }

  return (
    <div className="space-y-2 px-2">
      <div className="flex justify-between text-sm">
        <span>Items ({summary.totalItems})</span>
        <span>Tsh{formatNumber(summary.cartTotal)}</span>
      </div>

      {summary.totalDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-Tsh{formatNumber(summary.totalDiscount)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span className="text-green-600">Free</span>
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>Tsh {formatNumber(summary.cartTotal)}</span>
        </div>
      </div>
    </div>
  );
}
