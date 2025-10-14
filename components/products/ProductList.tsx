"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { X, Filter } from "lucide-react";
import { ProductsListProps, SearchParams } from "@/lib/types/product";
import { PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import ProductCard from "../cards/productlistCard";
import { useDebounce } from "@/hooks/debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flattenCategories = (categories: any) => {
  if (!categories) return [];
  if (Array.isArray(categories)) return categories;
  return Object.values(categories).flat();
};

export default function DiscoverPage({ initialData }: ProductsListProps) {
  const search = useSearchParams();
  const filtersRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const isSyncingFromURL = useRef(false);

  const safeInitialData = {
    products: initialData?.products || [],
    filters: {
      brands: initialData?.filters?.brands || [],
      productTypes: initialData?.filters?.productTypes || PRODUCT_TYPES,
      categories: flattenCategories(initialData?.filters?.categories),
    },
    pagination: initialData?.pagination || {
      page: 1,
      limit: 12,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  };

  const [data, setData] = useState(safeInitialData);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchParams>({
    productType: "all",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
    page: "1",
  });
  const debouncedFilters = useDebounce(localFilters, 500);

  const fetchProducts = useCallback(async (params: SearchParams, isFromURLSync = false) => {
    setLoading(true);
    try {
      const cleanedParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          cleanedParams[key] = value.toString();
        }
      });
      
      const queryString = new URLSearchParams(cleanedParams).toString();
      const res = await fetch(`/api/products?${queryString}`);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const newData = await res.json();
      const transformedData = {
        ...newData,
        filters: {
          brands: newData.filters?.brands || [],
          productTypes: newData.filters?.productTypes || PRODUCT_TYPES,
          categories: flattenCategories(newData.filters?.categories),
        },
      };
      
      setData(transformedData);
      
      if (!isFromURLSync) {
        const url = queryString ? `/products?${queryString}` : '/products';
        window.history.replaceState({}, "", url);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // URL sync
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const params: SearchParams = {
      productType: search.get("productType") || search.get("type") || "all",
      category: search.get("category") || "",
      brand: search.get("brand") || "",
      minPrice: search.get("minPrice") || "",
      maxPrice: search.get("maxPrice") || "",
      sortBy: search.get("sortBy") || "newest",
      page: search.get("page") || "1",
    };
    
    isSyncingFromURL.current = true;
    setLocalFilters(params);
    fetchProducts(params, true);
  }, [search, fetchProducts]);

  // React to filter changes
  useEffect(() => {
    if (isSyncingFromURL.current) {
      isSyncingFromURL.current = false;
      return;
    }
    if (isInitialMount.current) return;
    
    fetchProducts(debouncedFilters);
  }, [debouncedFilters, fetchProducts]);

  const handleFilterChange = (key: keyof SearchParams, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const resetFilters: SearchParams = {
      productType: "all",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
      page: "1",
    };
    setLocalFilters(resetFilters);
    setShowFilters(false);
  };

  const hasActiveFilters = Object.entries(localFilters).some(
    ([key, value]) => 
      value && 
      value !== "all" && 
      value !== "newest" && 
      value !== "1" &&
      !["page", "limit"].includes(key)
  );

  // Get filter display label
  const getFilterLabel = (key: string, value: string): string => {
    if (key === "productType") {
      return PRODUCT_TYPES.find(t => t.id === value)?.label || value;
    }
    if (key === "minPrice") return `Min: TZS ${value}`;
    if (key === "maxPrice") return `Max: TZS ${value}`;
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="py-6 text-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Discover Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Find top items from your favorite brands
        </p>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Filter className="w-4 h-4" /> 
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            )}
          </button>

          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === "all" || value === "newest" || value === "1") 
                return null;

              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                >
                  {getFilterLabel(key, value)}
                  <button
                    onClick={() => handleFilterChange(key as keyof SearchParams, "")}
                    className="hover:text-blue-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={clearFilters}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {data.products.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <Filter className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">
              Try adjusting your filters
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={() => setShowFilters(false)}
        >
          <div
            ref={filtersRef}
            className="bg-white dark:bg-gray-900 w-full max-w-md max-h-[80vh] rounded-2xl shadow-xl p-6 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters Content - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Product Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Type
                </label>
                <select
                  value={localFilters.productType}
                  onChange={(e) => handleFilterChange("productType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Products</option>
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              {data.filters.brands.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Brand
                  </label>
                  <select
                    value={localFilters.brand}
                    onChange={(e) => handleFilterChange("brand", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Brands</option>
                    {data.filters.brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category */}
              {data.filters.categories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={localFilters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {data.filters.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Range (TZS)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={localFilters.minPrice || ""}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}