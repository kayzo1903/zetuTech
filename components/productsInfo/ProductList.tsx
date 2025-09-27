// app/components/ProductsList.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import {  X, Filter } from "lucide-react";
import { ProductsListProps, SearchParams } from "@/lib/types/product";
import { PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import ProductCard from "../cards/productlistCard";
import { useDebounce } from "@/hooks/debounce";

export default function ProductsList({
  initialData,
  searchParams,
}: ProductsListProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchParams>(searchParams);

  const debouncedFilters = useDebounce(localFilters, 500);

  const currentProductType = searchParams.productType || "all";

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
  ];


 const updateFilters = useCallback(async (newParams: Partial<SearchParams>) => {
  setLoading(true);

  try {
    // Clean parameters
    const cleanedParams: Record<string, string> = {};
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all") {
        cleanedParams[key] = value.toString();
      }
    });

    // Always reset to page 1 when filters change (except for page changes)
    if (!newParams.page && Object.keys(newParams).some(k => k !== 'page')) {
      cleanedParams.page = "1";
    }

    const queryString = new URLSearchParams(cleanedParams).toString();
    
    const res = await fetch(`/api/products?${queryString}`);
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const newData = await res.json();
    setData(newData);

    // Update URL without page reload
    window.history.replaceState({}, "", `/products?${queryString}`);
  } catch (err) {
    console.error("Error updating filters:", err);
  } finally {
    setLoading(false);
  }
}, []); // Empty dependency array since we don't use any external variables

useEffect(() => {
  updateFilters(debouncedFilters);
}, [debouncedFilters, updateFilters]); // Now properly included

  const handleFilterChange = (key: keyof SearchParams, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    const resetFilters: SearchParams = {
      productType: "all",
      brand: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
      page: "1",
    };
    
    setLocalFilters(resetFilters);
    updateFilters(resetFilters);
  };

  const hasActiveFilters = Object.entries(searchParams).some(
    ([key, value]) => 
      value && 
      value !== "all" && 
      value !== "newest" && 
      value !== "1" &&
      !['page', 'limit'].includes(key)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentProductType !== "all"
                  ? PRODUCT_TYPES.find((t) => t.id === currentProductType)?.label
                  : "All Products"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {data.pagination.totalCount.toLocaleString()} products found
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              {Object.entries(searchParams).map(([key, value]) => {
                if (!value || value === "all" || value === "newest" || value === "1") return null;

                let label = value;
                if (key === "productType") {
                  label = PRODUCT_TYPES.find((t) => t.id === value)?.label || value;
                } else if (key === "minPrice") {
                  label = `Min $${value}`;
                } else if (key === "maxPrice") {
                  label = `Max $${value}`;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {label}
                    <button
                      onClick={() => handleFilterChange(key as keyof SearchParams, "")}
                      className="hover:text-blue-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Type */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Product Type
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="productType"
                        value="all"
                        checked={localFilters.productType === "all" || !localFilters.productType}
                        onChange={(e) => handleFilterChange("productType", e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        All Types
                      </span>
                    </label>
                    {PRODUCT_TYPES.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          name="productType"
                          value={type.id}
                          checked={localFilters.productType === type.id}
                          onChange={(e) => handleFilterChange("productType", e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                {data.filters.brands.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Brand
                    </h3>
                    <select
                      value={localFilters.brand || "all"}
                      onChange={(e) => handleFilterChange("brand", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
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

                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Price Range ($)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minPrice || ""}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                      min="0"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxPrice || ""}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                      min="0"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {data.products.length} of {data.pagination.totalCount.toLocaleString()} products
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={localFilters.sortBy || "newest"}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Products Grid */}
            <div className={loading ? "opacity-50" : ""}>
              {data.products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {data.products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    disabled={!data.pagination.hasPrev || loading}
                    onClick={() => handleFilterChange("page", (data.pagination.page - 1).toString())}
                    className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        disabled={loading}
                        onClick={() => handleFilterChange("page", pageNum.toString())}
                        className={`px-4 py-2 rounded-md ${
                          data.pagination.page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={!data.pagination.hasNext || loading}
                    onClick={() => handleFilterChange("page", (data.pagination.page + 1).toString())}
                    className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}