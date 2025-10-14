"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { ProductsListProps, SearchParams } from "@/lib/types/product";
import { PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import ProductCard from "../cards/productlistCard";
import { useDebounce } from "@/hooks/debounce";

export default function ProductsList({ initialData }: ProductsListProps) {
  const search = useSearchParams();
  const isInitialMount = useRef(true);
  const isSyncingFromURL = useRef(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    productType: true,
    brand: true,
    price: true,
  });
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

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
  ];

  /** Close filters when clicking outside (mobile only) */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFilters &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  /** Fetch products */
  const fetchProducts = useCallback(async (params: SearchParams, isFromURLSync = false) => {
    setLoading(true);
    try {
      const cleanedParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all") cleanedParams[key] = value.toString();
      });

      const queryString = new URLSearchParams(cleanedParams).toString();

      const res = await fetch(`/api/products?${queryString}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const newData = await res.json();
      setData(newData);

      if (!isFromURLSync) {
        window.history.replaceState({}, "", `/products?${queryString}`);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Sync filters with URL */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params: SearchParams = {
      productType: search.get("type") || search.get("productType") || "all",
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

  /** Fetch when filters change (debounced) */
  useEffect(() => {
    if (isSyncingFromURL.current) {
      isSyncingFromURL.current = false;
      return;
    }

    if (isInitialMount.current) {
      return;
    }

    fetchProducts(debouncedFilters);
  }, [debouncedFilters, fetchProducts]);

  /** Handle filter change */
  const handleFilterChange = (key: keyof SearchParams, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));

    // Auto-close the filter panel on mobile after selection
    if (window.innerWidth < 1024) {
      setTimeout(() => setShowFilters(false), 250);
    }
  };

  /** Clear filters */
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
    if (window.innerWidth < 1024) setShowFilters(false);
  };

  /** Toggle filter section */
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = Object.entries(localFilters).some(
    ([key, value]) =>
      value &&
      value !== "all" &&
      value !== "newest" &&
      value !== "1" &&
      !["page", "limit"].includes(key)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {localFilters.productType !== "all"
                  ? PRODUCT_TYPES.find((t) => t.id === localFilters.productType)?.label
                  : "All Products"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {data.pagination.totalCount.toLocaleString()} products found
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Summary (visible when there are active filters) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-2 flex-wrap mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>

            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === "all" || value === "newest" || value === "1")
                return null;

              let label = value;
              if (key === "productType") {
                label = PRODUCT_TYPES.find((t) => t.id === value)?.label || value;
              } else if (key === "minPrice") {
                label = `Min Tsh${value}`;
              } else if (key === "maxPrice") {
                label = `Max Tsh${value}`;
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
              className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {showFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden transition-opacity" />
            )}

            <div
              ref={filtersRef}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4 transition-all duration-300 ${
                showFilters 
                  ? "fixed inset-4 z-50 lg:relative lg:inset-auto lg:z-auto overflow-y-auto"
                  : "hidden lg:block"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <div className="flex items-center gap-2">
                  {/* Clear All inside sidebar */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition"
                    >
                      Clear All
                    </button>
                  )}

                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Product Type */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <button
                    onClick={() => toggleSection("productType")}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Product Type
                    </h3>
                    <span className="lg:hidden">
                      {expandedSections.productType ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <div className={`${expandedSections.productType ? "block" : "hidden lg:block"} mt-3`}>
                    <div className="space-y-2">
                      <label className="flex items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
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
                        <label
                          key={type.id}
                          className="flex items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
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
                </div>

                {/* Brand Filter */}
                {data?.filters?.brands?.length > 0 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <button
                      onClick={() => toggleSection("brand")}
                      className="flex items-center justify-between w-full"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Brand
                      </h3>
                      <span className="lg:hidden">
                        {expandedSections.brand ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    <div className={`${expandedSections.brand ? "block" : "hidden lg:block"} mt-3`}>
                      <select
                        value={localFilters.brand || "all"}
                        onChange={(e) => handleFilterChange("brand", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
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
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <button
                    onClick={() => toggleSection("price")}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Price Range (Tsh)
                    </h3>
                    <span className="lg:hidden">
                      {expandedSections.price ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <div className={`${expandedSections.price ? "block" : "hidden lg:block"} mt-3`}>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.minPrice || ""}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        min="0"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.maxPrice || ""}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        min="0"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sticky Apply Filters Button */}
                <div className="lg:hidden sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {data.products.length} of{" "}
                {data.pagination.totalCount.toLocaleString()} products
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={localFilters.sortBy || "newest"}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={loading ? "opacity-50" : ""}>
              {data.products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {data.products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
