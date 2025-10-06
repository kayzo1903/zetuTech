"use client";

import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetch("/api/cart")
        .then((res) => res.json())
        .then((data) => setCartItems(data.items || []));
    }
  }, [open]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>🛒 View Cart</Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>Your Cart</DrawerHeader>
          <div className="p-4 space-y-3">
            {cartItems.length === 0 && <p>No items in cart.</p>}
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.productName}</span>
                <span>x{item.quantity}</span>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
