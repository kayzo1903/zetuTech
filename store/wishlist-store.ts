// // store/wishlistStore.ts
// import { create } from "zustand";
// import { getWishlist, toggleWishlistItem } from "@/lib/api/wishlistApiCall";

// interface WishlistState {
//   items: string[];
//   loading: boolean;
//   fetchWishlist: () => Promise<void>;
//   toggleItem: (productId: string) => Promise<void>;
// }

// export const useWishlistStore = create<WishlistState>((set, get) => ({
//   items: [],
//   loading: false,

//   fetchWishlist: async () => {
//     set({ loading: true });
//     try {
//       const result = await getWishlist();
//       if (result.success && result.data) {
//         // store only product IDs for quick lookup
//         set({ items: result.data.items.map((item) => item.id) });
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist:", error);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   toggleItem: async (productId: string) => {
//     try {
//       const result = await toggleWishlistItem(productId);
//       if (result.success) {
//         const currentItems = get().items;
//         if (result.action === "added") {
//           set({ items: [...currentItems, productId] });
//         } else if (result.action === "removed") {
//           set({ items: currentItems.filter((id) => id !== productId) });
//         }
//       }
//     } catch (error) {
//       console.error("Error toggling wishlist item:", error);
//     }
//   },
// }));
