"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, ArrowRight, Star, Shield, Truck, Heart } from "lucide-react";
import { Product } from "@/lib/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl px-4 mx-auto sm:px-6">
        {/* Section Header */}
        <div className="flex flex-row flex-nowrap items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">New Arrival</h2>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition group"
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
            >
              <Link
                href={`/products/${product.slug}/${product.id}`}
                className="block"
              >
                {/* Product Image Container */}
                <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                    {product.hasDiscount && (
                      <Badge className="bg-red-500 text-white border-0 font-bold px-2 py-0.5 sm:px-3 sm:py-1 text-xs">
                        -
                        {Math.round(
                          (1 -
                            Number(product.salePrice) /
                              Number(product.originalPrice)) *
                            100
                        )}
                        %
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-green-500 text-white border-0 text-xs px-2 py-0.5 sm:px-3 sm:py-1"
                    >
                      New
                    </Badge>
                  </div>

                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist logic
                    }}
                  >
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Product Details */}
                <div className="p-3 sm:p-5">
                  {/* Brand */}
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {product.averageRating || 4.5}
                      </span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-2 sm:mb-4">
                    <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                      {Number(
                        product.salePrice || product.originalPrice
                      ).toLocaleString()}{" "}
                      TZS
                    </span>
                    {product.hasDiscount && (
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                        {Number(product.originalPrice).toLocaleString()} TZS
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-4">
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Truck className="w-3 h-3 text-green-500" />
                      <span className="hidden xs:inline">Free shipping</span>
                      <span className="xs:hidden">Free</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Shield className="w-3 h-3 text-blue-500" />
                      <span className="hidden xs:inline">1Y warranty</span>
                      <span className="xs:hidden">1Y</span>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.stock > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          product.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Just added</span>
                      <span className="sm:hidden">New</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Add to Cart Button */}
              <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 sm:py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-base"
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
