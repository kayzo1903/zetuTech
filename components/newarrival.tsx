"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Clock, Zap } from "lucide-react"

const newArrivals = [
  {
    id: "1",
    name: "Dell Inspiron 15",
    price: "1,200,000 TZS",
    originalPrice: "1,450,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.5,
    reviews: 24,
    isNew: true,
    specs: ["Intel i7", "16GB RAM", "512GB SSD"]
  },
  {
    id: "2",
    name: "HP Pavilion 14",
    price: "1,350,000 TZS",
    originalPrice: "1,600,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.2,
    reviews: 18,
    isNew: true,
    specs: ["AMD Ryzen 7", "8GB RAM", "256GB SSD"]
  },
  {
    id: "3",
    name: "Lenovo ThinkPad E14",
    price: "1,500,000 TZS",
    originalPrice: "1,750,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.8,
    reviews: 32,
    isNew: false,
    specs: ["Intel i5", "16GB RAM", "1TB SSD"]
  },
]

export default function NewArrivals() {
  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              New Arrivals
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Freshly added premium laptops with exclusive discounts
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition group"
          >
            View All
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <Link href={`/products/${product.id}`} className="block">
                {/* Product Image Container */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* New Badge */}
                  {product.isNew && (
                    <div className="absolute top-3 left-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                      NEW
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  {/* Product Name and Rating */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center text-sm text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-gray-700 dark:text-gray-300">{product.rating}</span>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="flex items-center gap-2 mb-4">
                    {product.specs.slice(0, 2).map((spec, i) => (
                      <span 
                        key={i}
                        className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                    {product.specs.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{product.specs.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center mb-4">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {product.price}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Just added</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-amber-500" />
                      <span>In stock</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button for Mobile */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}