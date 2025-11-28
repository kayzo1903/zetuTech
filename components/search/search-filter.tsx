// components/search/search-filters.tsx
"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    brands: string[];
    categories: string[];
  };
  selectedFilters: {
    brands: string[];
    categories: string[];
    minPrice?: string;
    maxPrice?: string;
    sortBy: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (filters: any) => void;
}

export function SearchFilters({ filters, selectedFilters, onFilterChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedFilters.brands.includes(brand)
      ? selectedFilters.brands.filter(b => b !== brand)
      : [...selectedFilters.brands, brand];
    
    onFilterChange({ ...selectedFilters, brands: newBrands });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedFilters.categories.includes(category)
      ? selectedFilters.categories.filter(c => c !== category)
      : [...selectedFilters.categories, category];
    
    onFilterChange({ ...selectedFilters, categories: newCategories });
  };

  const clearAllFilters = () => {
    onFilterChange({
      brands: [],
      categories: [],
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance'
    });
  };

  const hasActiveFilters = selectedFilters.brands.length > 0 || 
    selectedFilters.categories.length > 0 || 
    selectedFilters.minPrice || 
    selectedFilters.maxPrice;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {selectedFilters.brands.length + selectedFilters.categories.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort by
          </label>
          <select
            value={selectedFilters.sortBy}
            onChange={(e) => onFilterChange({ ...selectedFilters, sortBy: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={selectedFilters.minPrice || ''}
              onChange={(e) => onFilterChange({ ...selectedFilters, minPrice: e.target.value })}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={selectedFilters.maxPrice || ''}
              onChange={(e) => onFilterChange({ ...selectedFilters, maxPrice: e.target.value })}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Brands */}
        {filters.brands.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brands
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filters.brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {filters.categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filters.categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}