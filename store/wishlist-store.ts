// store/wishlist-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getWishlist, toggleWishlistItem } from "@/lib/api/wishlistApiCall";

interface WishlistState {
  items: string[];
  loading: boolean;
  initialized: boolean;
  fetchWishlist: () => Promise<void>;
  initializeWishlist: () => Promise<void>;
  toggleItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      initialized: false,

      fetchWishlist: async () => {
        set({ loading: true });
        try {
          const result = await getWishlist();
          
          // ✅ Handle different possible response structures
          if (result.success) {
            const items = result.data?.items || result.items || [];
            set({
              items: items.map((item: any) => item.id || item.productId),
              initialized: true,
            });
          } else {
            set({ initialized: true });
          }
        } catch (error) {
          console.error("❌ Error fetching wishlist:", error);
          set({ initialized: true });
        } finally {
          set({ loading: false });
        }
      },

      initializeWishlist: async () => {
        const state = get();
        if (!state.initialized && !state.loading) {
          await state.fetchWishlist();
        }
      },

      toggleItem: async (productId: string) => {
        const prevItems = get().items;
        const alreadyInWishlist = prevItems.includes(productId);

        // ✅ Optimistic update
        set({
          items: alreadyInWishlist
            ? prevItems.filter((id) => id !== productId)
            : [...prevItems, productId],
        });

        try {
          const result = await toggleWishlistItem(productId);
          
          if (!result.success) {
            throw new Error(result.error || "Failed to toggle wishlist");
          }
          
          // ✅ Optional: Re-sync with server to ensure consistency
          // await get().fetchWishlist();
          
        } catch (error) {
          console.error("❌ Toggle wishlist failed, rolling back:", error);
          // ✅ Rollback to previous state
          set({ items: prevItems });
          
          // ✅ You might want to show a toast notification here
          // toast.error("Failed to update wishlist");
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => {
        set({ items: [], initialized: false });
      },

      syncWithServer: async () => {
        if (!get().loading) {
          await get().fetchWishlist();
        }
      },
    }),
    {
      name: "wishlist-storage",
      skipHydration: true,
    }
  )
);