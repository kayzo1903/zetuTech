"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Zap, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types/product";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl px-4 mx-auto sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">
              New Arrival
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Freshly added premium products with exclusive discounts
            </p>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition group"
          >
            View All
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            <div className="flex space-x-6 min-w-max">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <Link
                    href={`/products/${product.slug}/${product.id}`}
                    className="block group"
                  >
                    {/* Product Image Container */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Discount Badge */}
                      {product.hasDiscount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                      {/* Product Name */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 h-14">
                          {product.name}
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center mb-4">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {Number(
                            product.salePrice || product.originalPrice
                          ).toLocaleString()}{" "}
                          TZS
                        </span>
                        {product.hasDiscount && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            {Number(product.originalPrice).toLocaleString()} TZS
                          </span>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>New</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-amber-500" />
                          <span>
                            {product.stock > 0 ? "In stock" : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll gradient indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 pointer-events-none" />
        </div>

        {/* View All Button for Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            View All Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
