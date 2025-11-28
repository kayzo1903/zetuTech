// hooks/useWishlistBulkCheck.ts
import { useWishlistStore } from "@/store/wishlist-store";
// Hook to check multiple product IDs in wishlist

export function useWishlistBulkCheck(productIds: string[]) {
  const { isInWishlist } = useWishlistStore();

  return productIds.reduce((acc, id) => {
    acc[id] = isInWishlist(id);
    return acc;
  }, {} as Record<string, boolean>);
}
