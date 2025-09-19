"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronDown, Monitor, Laptop, Gamepad, Briefcase, DollarSign, Apple } from "lucide-react";

// Mock category data
const categories = [
  {
    id: "premium",
    name: "Premium Laptops",
    description: "High-performance laptops for professionals and creators",
    image: "/premium-category.jpeg",
    count: 12,
    icon: Monitor,
    specs: ["Intel i7/i9", "16GB+ RAM", "512GB+ SSD", "High-resolution displays"]
  },
  {
    id: "gaming",
    name: "Gaming Laptops",
    description: "Powerful machines for gaming enthusiasts",
    image: "/gaming-category.jpeg",
    count: 8,
    icon: Gamepad,
    specs: ["Dedicated GPUs", "High refresh rate", "RGB lighting", "Cooling systems"]
  },
  {
    id: "business",
    name: "Business Laptops",
    description: "Reliable and secure laptops for professionals",
    image: "/business-category.jpeg",
    count: 15,
    icon: Briefcase,
    specs: ["Security features", "Long battery life", "Professional design", "Docking support"]
  },
  {
    id: "budget",
    name: "Budget Friendly",
    description: "Affordable options for everyday use",
    image: "/budget-category.jpeg",
    count: 20,
    icon: DollarSign,
    specs: ["Value performance", "Essential features", "Long battery life", "Lightweight"]
  },
  {
    id: "apple",
    name: "Apple MacBooks",
    description: "Premium Apple ecosystem devices",
    image: "/apple-category.jpeg",
    count: 10,
    icon: Apple,
    specs: ["macOS", "Retina displays", "M1/M2 chips", "Premium build quality"]
  },
  {
    id: "2-in-1",
    name: "2-in-1 Convertibles",
    description: "Versatile laptops that transform into tablets",
    image: "/2in1-category.jpeg",
    count: 7,
    icon: Laptop,
    specs: ["Touchscreen", "360° hinge", "Stylus support", "Tablet mode"]
  }
];

// Mock featured products for each category
const featuredProducts = {
  premium: [
    { id: "1", name: "Dell XPS 15", price: "2,450,000 TZS", image: "/laptop1.jpeg", rating: 4.8 },
    { id: "3", name: "Lenovo ThinkPad X1", price: "2,800,000 TZS", image: "/laptop1.jpeg", rating: 4.9 }
  ],
  gaming: [
    { id: "5", name: "ASUS ROG Zephyrus", price: "3,200,000 TZS", image: "/laptop1.jpeg", rating: 4.5 },
    { id: "7", name: "MSI Katana GF66", price: "2,900,000 TZS", image: "/laptop1.jpeg", rating: 4.6 }
  ],
  business: [
    { id: "3", name: "Lenovo ThinkPad X1", price: "2,800,000 TZS", image: "/laptop1.jpeg", rating: 4.9 },
    { id: "8", name: "HP EliteBook 840", price: "2,100,000 TZS", image: "/laptop1.jpeg", rating: 4.7 }
  ],
  budget: [
    { id: "6", name: "Acer Swift 3", price: "1,500,000 TZS", image: "/laptop1.jpeg", rating: 4.3 },
    { id: "9", name: "Lenovo IdeaPad 3", price: "1,200,000 TZS", image: "/laptop1.jpeg", rating: 4.2 }
  ],
  apple: [
    { id: "4", name: "MacBook Pro 14\"", price: "3,500,000 TZS", image: "/laptop1.jpeg", rating: 4.7 },
    { id: "10", name: "MacBook Air M2", price: "2,800,000 TZS", image: "/laptop1.jpeg", rating: 4.8 }
  ],
  "2-in-1": [
    { id: "2", name: "HP Spectre x360", price: "2,200,000 TZS", image: "/laptop1.jpeg", rating: 4.6 },
    { id: "11", name: "Lenovo Yoga 9i", price: "2,600,000 TZS", image: "/laptop1.jpeg", rating: 4.5 }
  ]
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredCategories = selectedCategory === "all" 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laptop Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Browse our carefully curated laptop categories to find the perfect device for your needs
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredCategories.length} category{filteredCategories.length !== 1 ? 'ies' : ''}
          </p>
          
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 appearance-none pr-8 text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="name">Alphabetical</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <Link href={`/categories/${category.id}`} className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    <p className="text-blue-200 text-sm">{category.count} models</p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>

                  {/* Key Specs */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Key Features:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.specs.slice(0, 2).map((spec, i) => (
                        <span 
                          key={i}
                          className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                      {category.specs.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{category.specs.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Featured Products */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Popular Models:
                    </h4>
                    <div className="space-y-2">
                      {featuredProducts[category.id as keyof typeof featuredProducts]?.map((product) => (
                        <div key={product.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300 truncate">{product.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="ml-1 text-xs">{product.rating}</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{product.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                      Browse {category.name}
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        {selectedCategory === "all" && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
              <p className="mb-6 max-w-2xl mx-auto">
                Our experts are ready to help you find the perfect laptop for your needs and budget.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Contact Our Experts
                </button>
                <button className="px-6 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                  Compare Laptops
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}