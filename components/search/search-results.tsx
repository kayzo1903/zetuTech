// components/search/search-results.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, } from "lucide-react";
import ProductCard from "../cards/productlistCard";
import { Product } from "@/lib/types/product";


interface SearchResult {
  products: Product[];
}

export default function SearchResults({ searchQuery }: { searchQuery?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || searchQuery || '';
  
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  
  // Fetch search results
  useEffect(() => {
    if (query && query.length >= 2) {
      console.log("🔍 Fetching search results for:", query);
      setLoading(true);
      setError(null);
      
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(async (response) => {
          if (!response.ok) throw new Error('Search failed');
          const data = await response.json();
          console.log("✅ Search results:", data);
          setResults(data);
        })
        .catch((err) => {
          console.error('❌ Search error:', err);
          setError('Failed to search products. Please try again.');
          setResults(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setResults(null);
    }
  }, [query]);

  const goBack = () => {
    router.back();
  };

  if (!query || query.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Search for Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Use the search bar in the header to find products.
          </p>
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Search Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {loading 
              ? `Searching for "${query}"...`
              : results 
                ? `Found ${results.products.length} result${results.products.length === 1 ? '' : 's'} for "${query}"`
                : `No results found for "${query}"`
            }
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Searching for &quot;{query}&quot;...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results && (
        <div className="space-y-6">
          {results.products.length > 0 ? (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      ...product,
                      // Ensure all required fields are present
                      images: product.images || [],
                      categories: product.categories,
                      originalPrice: product.originalPrice || 0,
                      salePrice: product.salePrice || null,
                      hasDiscount: product.hasDiscount || false,
                      stock: product.stock || 0,
                      slug: product.slug || `/product/${product.id}`,
                      status: product.status || 'active'
                    }} 
                  />
                ))}
              </div>

              {/* Show More Results (if needed) */}
              {results.products.length >= 20 && (
                <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Showing first 20 results
                  </p>
                  <button
                    onClick={() => {
                      // You can implement pagination here if needed
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('limit', '40');
                      router.push(`/search?${params.toString()}`);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Load More Results
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any products matching &quot;{query}&quot;. Try checking your spelling or using different keywords.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Suggestions:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Try more general keywords</li>
                  <li>• Check your spelling</li>
                  <li>• Browse by category instead</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}