// hooks/useInfinityProducts.ts
import { useInfiniteQuery } from "@tanstack/react-query";

// hooks/useInfinityProducts.ts
export function useInfinityProducts(limit = 12) {
  return useInfiniteQuery({
    queryKey: ["products", "infinity"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/products/infinity?offset=${pageParam}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      // ✅ Use nextOffset from API response instead of calculating
      return lastPage.hasMore ? lastPage.nextOffset : undefined;
    },
    initialPageParam: 0, // ✅ Add this for React Query v4+
  });
}