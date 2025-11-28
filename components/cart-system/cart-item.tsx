// components/cart/cart-item.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { CartItem as CartItemType } from "@/lib/cart/types";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/formartCurency";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === item.quantity) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const increment = () => {
    if (item.quantity < item.product.stock) {
      handleQuantityChange(item.quantity + 1);
    }
  };

  const decrement = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    }
  };

  //   const itemTotal = item.price * item.quantity;
  //   const originalTotal = item.product.originalPrice * item.quantity;
  const hasDiscount = item.product.hasDiscount;

  return (
    <div
      className={cn(
        "flex gap-4 p-4 border rounded-lg relative",
        isUpdating && "opacity-50"
      )}
    >
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      <div className="flex-shrink-0">
        <Image
          src={item.product.image || "/placeholder-product.jpg"}
          alt={item.product.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">
          {item.product.name}
        </h4>

        {item.selectedAttributes && (
          <div className="text-xs text-muted-foreground mb-2">
            {Object.entries(item.selectedAttributes).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">TSH {formatNumber(item.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              TSH {formatNumber(item.product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-r-none"
              onClick={decrement}
              disabled={item.quantity <= 1 || isUpdating}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-l-none"
              onClick={increment}
              disabled={item.quantity >= item.product.stock || isUpdating}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleRemove}
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
