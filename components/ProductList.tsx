"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Filter, Grid, List, Star, ChevronDown, Search } from "lucide-react";

// Mock product data
const products = [
  {
    id: "1",
    name: "Dell XPS 15",
    price: "2,450,000 TZS",
    originalPrice: "2,800,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.8,
    reviews: 42,
    specs: ["Intel i7", "16GB RAM", "512GB SSD", "15.6\" FHD"],
    category: "Premium",
    stock: 3,
    isNew: true
  },
  {
    id: "2",
    name: "HP Spectre x360",
    price: "2,200,000 TZS",
    originalPrice: "2,500,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.6,
    reviews: 38,
    specs: ["Intel i5", "8GB RAM", "256GB SSD", "13.3\" Touch"],
    category: "2-in-1",
    stock: 5,
    isNew: false
  },
  {
    id: "3",
    name: "Lenovo ThinkPad X1",
    price: "2,800,000 TZS",
    originalPrice: "3,200,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.9,
    reviews: 56,
    specs: ["Intel i7", "16GB RAM", "1TB SSD", "14\" 4K"],
    category: "Business",
    stock: 2,
    isNew: true
  },
  {
    id: "4",
    name: "MacBook Pro 14\"",
    price: "3,500,000 TZS",
    originalPrice: "4,000,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.7,
    reviews: 67,
    specs: ["Apple M1 Pro", "16GB RAM", "512GB SSD", "14.2\" Liquid Retina"],
    category: "Apple",
    stock: 4,
    isNew: false
  },
  {
    id: "5",
    name: "ASUS ROG Zephyrus",
    price: "3,200,000 TZS",
    originalPrice: "3,600,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.5,
    reviews: 29,
    specs: ["AMD Ryzen 9", "32GB RAM", "1TB SSD", "RTX 3060"],
    category: "Gaming",
    stock: 1,
    isNew: true
  },
  {
    id: "6",
    name: "Acer Swift 3",
    price: "1,500,000 TZS",
    originalPrice: "1,800,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.3,
    reviews: 31,
    specs: ["AMD Ryzen 5", "8GB RAM", "256GB SSD", "14\" FHD"],
    category: "Budget",
    stock: 7,
    isNew: false
  }
];

const categories = ["All", "Premium", "Gaming", "Business", "Budget", "Apple", "2-in-1"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Newest", "Rating"];

export default function ProductsList() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch(sortBy) {
        case "Price: Low to High":
          return parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, ''));
        case "Price: High to Low":
          return parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, ''));
        case "Newest":
          return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
        case "Rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laptop Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover our curated selection of premium laptops
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          {/* Search */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search laptops..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Category filter */}
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Categories</h3>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilters(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 last:mb-0 ${
                          selectedCategory === category
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 appearance-none pr-8"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-6"
          }>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
                  viewMode === "list" && "flex"
                }`}
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className={`relative ${viewMode === "list" ? "w-1/3 h-48" : "h-48 w-full"}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                        NEW
                      </div>
                    )}
                    {product.stock < 5 && (
                      <div className="absolute top-3 right-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {product.stock} LEFT
                      </div>
                    )}
                  </div>

                  <div className={`p-5 ${viewMode === "list" ? "w-2/3" : ""}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center text-sm text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-gray-700 dark:text-gray-300">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.specs.slice(0, 2).map((spec, i) => (
                        <span 
                          key={i}
                          className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center mb-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {product.price}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                        {product.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{product.category}</span>
                      <span>{product.reviews} reviews</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                2
              </button>
              <button className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                3
              </button>
              <button className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}