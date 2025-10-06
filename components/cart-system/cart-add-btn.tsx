"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAddToCart() {
    setLoading(true);
    try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      router.refresh(); // optional — update UI
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
