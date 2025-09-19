"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Truck, Shield, Zap } from "lucide-react";

// Mock categories data for tech products
const categories = [
  { id: 1, name: "Gaming Laptops", icon: "🎮" },
  { id: 2, name: "Business Laptops", icon: "💼" },
  { id: 3, name: "Student Laptops", icon: "🎓" },
  { id: 4, name: "Desktop PCs", icon: "🖥️" },
  { id: 5, name: "Accessories", icon: "⌨️" },
];

// Mock featured deals
const featuredDeals = [
  {
    id: 1,
    name: "Gaming Laptop Pro",
    price: "2,450,000 TZS",
    originalPrice: "2,800,000 TZS",
    discount: "12% off",
    image: "/laptop1.jpeg",
    rating: 4.8,
    category: "Gaming",
  },
  {
    id: 2,
    name: "Ultrabook Elite",
    price: "1,890,000 TZS",
    originalPrice: "2,100,000 TZS",
    discount: "10% off",
    image: "/laptop1.jpeg",
    rating: 4.6,
    category: "Business",
  },
  {
    id: 3,
    name: "Student Essential",
    price: "1,250,000 TZS",
    originalPrice: "1,500,000 TZS",
    discount: "17% off",
    image: "/laptop1.jpeg",
    rating: 4.5,
    category: "Student",
  },
];

export default function Hero() {
  const [currentDeal, setCurrentDeal] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Auto-rotate deals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % featuredDeals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoriesRef.current) {
      const scrollAmount = 200;
      categoriesRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Categories */}
          <div className="lg:w-1/4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
              Shop by Category
            </h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center py-2 px-3 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-xl mr-3">{category.icon}</span>
                  <span className="text-gray-800 dark:text-gray-200">{category.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Why Choose ZetuTech?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Free Dar es Salaam Delivery
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    1-Year Warranty
                  </span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Same-Day Setup
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Featured Deal */}
          <div className="lg:w-2/4 relative">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden h-full">
              <div className="p-6 flex flex-col md:flex-row items-center h-full">
                <div className="md:w-1/2 mb-4 md:mb-0">
                  <motion.div
                    key={currentDeal}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="inline-block bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                      {featuredDeals[currentDeal].discount}
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {featuredDeals[currentDeal].name}
                    </h2>
                    <div className="flex items-center mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(featuredDeals[currentDeal].rating)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-blue-100 text-sm ml-2">
                        ({featuredDeals[currentDeal].rating})
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-white">
                        {featuredDeals[currentDeal].price}
                      </span>
                      <span className="text-blue-200 line-through ml-2">
                        {featuredDeals[currentDeal].originalPrice}
                      </span>
                    </div>
                    <Link
                      href={`/product/${featuredDeals[currentDeal].id}`}
                      className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative w-64 h-48">
                    <Image
                      src={featuredDeals[currentDeal].image}
                      alt={featuredDeals[currentDeal].name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Deal navigation dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {featuredDeals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDeal(index)}
                  className={`w-2 h-2 rounded-full ${
                    currentDeal === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Promotional Banner */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-lg p-5 text-white h-full">
              <h3 className="font-bold text-lg mb-3">Tech Support Included</h3>
              <p className="text-sm text-gray-200 mb-4">
                Free setup and 3 months tech support with every purchase
              </p>
              <div className="bg-gray-900 rounded p-3 mb-4">
                <p className="text-xs text-gray-300">Special Offer</p>
                <p className="font-semibold">Get antivirus software FREE</p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Categories */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">
              Popular Right Now
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => scrollCategories("left")}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollCategories("right")}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={categoriesRef}
            className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex-shrink-0 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Shop now</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
