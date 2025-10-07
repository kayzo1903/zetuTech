"use client";

import { authClient } from "@/lib/auth-client";
import { useWishlistStore } from "@/store/wishlist-store";
import { useEffect, useState } from "react";

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const initializeWishlist = useWishlistStore((state) => state.initializeWishlist);
  const syncWithServer = useWishlistStore((state) => state.syncWithServer);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isPending) return;

    if (session?.user) {
      // ✅ Logged in: initialize and periodically sync
      initializeWishlist();

      const interval = setInterval(() => {
        syncWithServer();
      }, 60000);

      return () => clearInterval(interval);
    } else {
      // 🚫 Logged out: clear wishlist
      clearWishlist();
    }
  }, [isMounted, session, isPending, initializeWishlist, syncWithServer, clearWishlist]);

  // Prevent hydration mismatch
  if (!isMounted) return <>{children}</>;

  return <>{children}</>;
}
