"use client";
// ✅ Fixed import
import { useEffect, useCallback } from "react";
import ProductCard, { ProductType } from "../cards/productcards";
import { useInfinityProducts } from "@/hooks/useInfinityProduct";


interface InfinityProductsProps {
  initialProducts?: ProductType[];
}

interface ProductsResponse {
  products: ProductType[];
  hasMore: boolean;
  nextOffset?: number;
}

export default function InfinityProducts({
  initialProducts = [],
}: InfinityProductsProps) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityProducts(8);

  // ✅ Fixed scroll handler with throttle
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // ✅ Better threshold calculation
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const scrollListener = () => handleScroll();

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, [handleScroll]);

  // ✅ Proper type handling for merged products
  const allPages = data?.pages as ProductsResponse[] | undefined;
  const products =
    allPages?.flatMap((page) => page.products) || initialProducts;

  // ✅ Use product.id instead of index for key
  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-2">Discover</h2>
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Loading States */}
        <div className="mt-8 text-center">
          {(isLoading || isFetchingNextPage) && (
            <div className="text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p>Loading more products...</p>
            </div>
          )}

          {!hasNextPage && products.length > 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              🎉 You&apos;ve seen all products
            </p>
          )}

          {!isLoading && products.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              No products found
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
