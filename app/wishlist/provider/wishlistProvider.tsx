// components/providers/WishlistProvider.tsx
"use client";

import { useWishlistStore } from "@/store/wishlist-store";
import { useEffect, useState } from "react";

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const initializeWishlist = useWishlistStore((state) => state.initializeWishlist);
  const syncWithServer = useWishlistStore((state) => state.syncWithServer);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Initialize on mount
      initializeWishlist();

      // Periodic sync every 60s
      const interval = setInterval(() => {
        syncWithServer();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isMounted, initializeWishlist, syncWithServer]);

  // ✅ Prevent SSR mismatch
  if (!isMounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}