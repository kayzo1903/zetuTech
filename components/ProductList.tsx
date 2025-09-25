// app/components/ProductsList.tsx
"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import { ProductsListProps } from "@/lib/types/product";
import ProductCard from "./cards/productlistCard";

export default function ProductsList({
  initialData,
  searchParams,
}: ProductsListProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const currentProductType = searchParams.productType || "all";

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
  ];

  const updateFilters = async (newParams: Record<string, string>) => {
    setLoading(true);

    // Always reset page when filters change (unless it's just pagination)
    const isPageChange = Object.keys(newParams).length === 1 && newParams.page;
    const mergedParams = {
      ...searchParams,
      ...newParams,
      page: isPageChange ? newParams.page : "1",
    };

    // Keep "all" so backend knows it's default
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(mergedParams)) {
      cleaned[key] = value ?? ""; // keep empty string if unset
    }

    const queryString = new URLSearchParams(cleaned).toString();

    try {
      const res = await fetch(`/api/products/product-list?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const newData = await res.json();
      setData(newData);

      // Update URL without reloading
      window.history.pushState({}, "", `/products?${queryString}`);
    } catch (err) {
      console.error("Error updating filters:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    // Set productType to "all" explicitly
    updateFilters({
      productType: "all", // This will trigger the "All Types" radio button
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      page: "1",
    });
  };

  const hasActiveFilters = Object.values(searchParams).some(
    (param) => param && param !== "all" && param !== "newest"
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentProductType !== "all"
              ? PRODUCT_TYPES.find((t) => t.id === currentProductType)?.label
              : "All Products"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {data.pagination.totalCount} products found
          </p>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              {Object.entries(searchParams).map(([key, value]) => {
                if (!value || value === "all" || value === "newest")
                  return null;

                let label = value;
                if (key === "productType") {
                  label =
                    PRODUCT_TYPES.find((t) => t.id === value)?.label || value;
                } else if (key === "category") {
                  label = value;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {label}
                    <button
                      onClick={() => updateFilters({ [key]: "" })}
                      className="hover:text-blue-600"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <ChevronDown
                    className={`w-5 h-5 transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              <div
                className={`space-y-6 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                {/* Product Type */}
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
                        checked={
                          currentProductType === "all" || !currentProductType
                        }
                        onChange={(e) =>
                          updateFilters({ productType: e.target.value })
                        }
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
                          checked={currentProductType === type.id}
                          onChange={(e) =>
                            updateFilters({ productType: e.target.value })
                          }
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                {data.filters.brands.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Brand
                    </h3>
                    <select
                      value={searchParams.brand || "all"}
                      onChange={(e) => updateFilters({ brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
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

                {/* Price */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Price Range
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={searchParams.minPrice || ""}
                      onChange={(e) =>
                        updateFilters({ minPrice: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={searchParams.maxPrice || ""}
                      onChange={(e) =>
                        updateFilters({ maxPrice: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm"
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
                Showing {data.products.length} of {data.pagination.totalCount}{" "}
                products
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={searchParams.sortBy || "newest"}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse"
                  >
                    <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : data.products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {data.products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    disabled={!data.pagination.hasPrev}
                    onClick={() =>
                      updateFilters({
                        page: (data.pagination.page - 1).toString(),
                      })
                    }
                    className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: data.pagination.totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilters({ page: p.toString() })}
                      className={`px-4 py-2 rounded-md ${
                        data.pagination.page === p
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={!data.pagination.hasNext}
                    onClick={() =>
                      updateFilters({
                        page: (data.pagination.page + 1).toString(),
                      })
                    }
                    className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
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
