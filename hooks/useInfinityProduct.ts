import { Product } from "@/lib/types/product";
import { useInfiniteQuery } from "@tanstack/react-query";

// ✅ Define API response type
interface ProductsApiResponse {
  products: Product[];
  hasMore: boolean;
  nextOffset: number;
}

export const infinityProductsQueryKey = (limit: number) => ["products", "infinity", limit];

export const infinityProductsQueryFn = async ({ pageParam = 0, limit = 12 }: { pageParam?: number; limit?: number }): Promise<ProductsApiResponse> => {
  const response = await fetch(`/api/products/infinity?offset=${pageParam}&limit=${limit}`);
  if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
  const data = await response.json();

  if (!Array.isArray(data.products) || typeof data.hasMore !== "boolean") {
    throw new Error("Invalid API response structure");
  }
  return data;
};

interface UseInfinityProductsOptions {
  limit?: number;
  enabled?: boolean;
}

export function useInfinityProducts({ limit = 12, enabled = true }: UseInfinityProductsOptions = {}) {
  return useInfiniteQuery({
    queryKey: infinityProductsQueryKey(limit),
    queryFn: ({ pageParam }) => infinityProductsQueryFn({ pageParam, limit }),
    getNextPageParam: (lastPage: ProductsApiResponse) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}