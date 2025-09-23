// app/components/ProductsList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronDown, X } from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
} from "@/lib/validation-schemas/product-type";

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  brand: string;
  productType: string;
  originalPrice: string;
  salePrice: string;
  hasDiscount: boolean;
  stock: number;
  stockStatus: string;
  status: string;
  slug: string;
  categories: string[];
  images: string[];
  createdAt: string;
}

interface ProductsListProps {
  initialData: {
    products: Product[];
    filters: {
      brands: string[];
      productTypes: typeof PRODUCT_TYPES;
      categories: typeof PRODUCT_CATEGORIES;
    };
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  searchParams: {
    productType?: string;
    category?: string;
    brand?: string;
    status?: string;
    stockStatus?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
  };
}

export default function ProductsList({
  initialData,
  searchParams,
}: ProductsListProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const currentProductType = searchParams.productType || "all";
  const currentCategory = searchParams.category || "all";

  // Get available categories for current product type
  const availableCategories =
    currentProductType !== "all"
      ? PRODUCT_CATEGORIES[
          currentProductType as keyof typeof PRODUCT_CATEGORIES
        ] || []
      : [];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
  ];

  const updateFilters = async (newParams: Record<string, string>) => {
    setLoading(true);

    // Merge old params with new ones
    const mergedParams = { ...searchParams, ...newParams, page: "1" };

    // Remove empty or "all" values
    const cleanedParams: Record<string, string> = {};
    Object.entries(mergedParams).forEach(([key, value]) => {
      if (value && value !== "all") {
        cleanedParams[key] = value;
      }
    });

    const queryString = new URLSearchParams(cleanedParams).toString();

    try {
      const res = await fetch(`/api/products/product-list?${queryString}`);
      const newData = await res.json();
      setData(newData);

      // Update URL without full reload
      window.history.pushState({}, "", `/products?${queryString}`);
    } catch (error) {
      console.error("Error updating filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    updateFilters({
      productType: "",
      category: "",
      brand: "",
      status: "",
      stockStatus: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
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
                {/* Product Type Filter */}
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
                        checked={currentProductType === "all"}
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

                {/* Category Filter */}
                {availableCategories.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Category
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value="all"
                          checked={currentCategory === "all"}
                          onChange={(e) =>
                            updateFilters({ category: e.target.value })
                          }
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          All Categories
                        </span>
                      </label>
                      {availableCategories.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={currentCategory === category}
                            onChange={(e) =>
                              updateFilters({ category: e.target.value })
                            }
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand Filter */}
                {data.filters.brands.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Brand
                    </h3>
                    <div className="space-y-2">
                      <select
                        value={searchParams.brand || "all"}
                        onChange={(e) =>
                          updateFilters({ brand: e.target.value })
                        }
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
                  </div>
                )}

                {/* Price Range */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative h-48 w-full">
                        {product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}

                        {product.hasDiscount && (
                          <div className="absolute top-3 left-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                            SALE
                          </div>
                        )}

                        {product.stockStatus === "Low Stock" && (
                          <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                            LOW STOCK
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center text-sm text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-gray-700 dark:text-gray-300">
                              -
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.categories.slice(0, 2).map((category, i) => (
                            <span
                              key={i}
                              className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
                            >
                              {category}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center mb-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {typeof product.salePrice === "string"
                              ? parseFloat(product.salePrice).toLocaleString(
                                  "en-TZ",
                                  {
                                    style: "currency",
                                    currency: "TZS",
                                  }
                                )
                              : product.salePrice}
                          </span>
                          {product.hasDiscount && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                              {typeof product.originalPrice === "string"
                                ? parseFloat(
                                    product.originalPrice
                                  ).toLocaleString("en-TZ", {
                                    style: "currency",
                                    currency: "TZS",
                                  })
                                : product.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{product.brand}</span>
                          <span>{product.stock} in stock</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
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
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => updateFilters({ page: page.toString() })}
                      className={`px-4 py-2 rounded-md ${
                        data.pagination.page === page
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {page}
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
