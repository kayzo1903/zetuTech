"use client";
import { useEffect, useCallback, useRef } from "react";
import { useInfinityProducts } from "@/hooks/useInfinityProduct";
import ProductCard from "../cards/productlistCard";
import ProductSkeletonGrid from "../cards/skeletongrid";
import { Product } from "@/lib/types/product";

interface InfinityProductsProps {
  initialProducts?: Product[];
}

export default function InfinityProducts({ initialProducts = [] }: InfinityProductsProps) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfinityProducts({ limit: 12, enabled: true });

  // ✅ Use ref to track throttle state and latest values
  const throttleRef = useRef({
    inThrottle: false,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // ✅ Update ref values when dependencies change
  useEffect(() => {
    throttleRef.current.hasNextPage = hasNextPage;
    throttleRef.current.isFetchingNextPage = isFetchingNextPage;
    throttleRef.current.fetchNextPage = fetchNextPage;
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ Simple scroll handler with inline throttle logic
  const handleScroll = useCallback(() => {
    const { inThrottle, hasNextPage, isFetchingNextPage, fetchNextPage } = throttleRef.current;
    
    if (inThrottle || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceToBottom < 300) {
      throttleRef.current.inThrottle = true;
      fetchNextPage();
      
      setTimeout(() => {
        throttleRef.current.inThrottle = false;
      }, 200);
    }
  }, []); // Empty dependencies since we use ref

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // ✅ Error state
  if (error) {
    return (
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-red-500">Error loading products: {error.message}</p>
        </div>
      </section>
    );
  }

  const products = data?.pages.flatMap((page) => page.products) || initialProducts;

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-8">Discover</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            <ProductSkeletonGrid count={12} />
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          {(isLoading || isFetchingNextPage) && (
            <p className="text-gray-500 dark:text-gray-400">Loading more products...</p>
          )}

          {!hasNextPage && products.length > 0 && (
            <p className="text-gray-500 dark:text-gray-400">🎉 You&apos;ve seen all products</p>
          )}

          {!isLoading && products.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          )}
        </div>
      </div>
    </section>
  );
}