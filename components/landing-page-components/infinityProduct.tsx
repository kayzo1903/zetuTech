"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard, { ProductType } from "../cards/productcards";

interface InfinityProductsProps {
  initialProducts: ProductType[];
}

export default function InfinityProducts({
  initialProducts,
}: InfinityProductsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialProducts.length);

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/infinity?offset=${offset}&limit=8`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const newProducts: ProductType[] = await res.json();

      // If no new products, stop loading
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setOffset((prev) => prev + newProducts.length);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  // Infinite scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreProducts, hasMore, loading]);

  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-semibold">New Arrival</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Discover our latest tech collection
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>

        {/* Status Messages */}
        <div className="mt-12 text-center">
          {loading && hasMore && (
            <div className="text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
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
              <p className="mt-2">Loading more products...</p>
            </div>
          )}

          {!hasMore && (
            <p className="text-gray-500 dark:text-gray-400">
              🎉 You&apos;ve reached the end of our catalog
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
