"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Zap, Shield, Clock, CheckCircle, Star } from "lucide-react"
import { useState } from "react"

// Dummy product data (later, fetch from DB)
const featuredProduct = {
  id: "1",
  name: "HP EliteBook 840 G5",
  price: 650,
  originalPrice: 799,
  stock: 5,
  image: "/laptop-sample.png", // Replace with Cloudflare URL
  specs: [
    { label: "Processor", value: "Intel Core i7, 8th Gen" },
    { label: "RAM", value: "16GB DDR4" },
    { label: "Storage", value: "512GB SSD" },
    { label: "Display", value: "14-inch Full HD" },
    { label: "Graphics", value: "Intel UHD Graphics 620" },
    { label: "Condition", value: "Refurbished - Excellent" },
  ],
  features: ["30-day money-back guarantee", "Free shipping", "1-year warranty"],
  rating: 4.7,
  reviews: 142,
}

export default function FeaturedProduct() {
  const [isLiked, setIsLiked] = useState(false)

  
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 px-3 py-1">
            <Zap className="w-4 h-4 mr-1" />
            Today&apos;s Featured Deal
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Premium Laptop at Special Price
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-gray-600 dark:text-gray-300 mt-3 max-w-xl mx-auto"
          >
            Updated daily with exclusive discounts on premium refurbished laptops.
          </motion.p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden max-w-6xl mx-auto border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative p-8 bg-gray-50 dark:bg-gray-700"
            >
              <div className="absolute top-6 right-6 z-10">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-600 dark:text-gray-200"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart 
                    className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400" : ""}`} 
                  />
                </Button>
              </div>
              
              <div className="relative h-80">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 border rounded-lg bg-gray-100 dark:bg-gray-600 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"></div>
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 mb-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Certified Refurbished
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {featuredProduct.name}
                  </h3>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(featuredProduct.rating) ? 'fill-current' : 'stroke-current'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                      {featuredProduct.rating} ({featuredProduct.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${featuredProduct.price}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${featuredProduct.originalPrice}
                  </span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100">
                    Save ${featuredProduct.originalPrice - featuredProduct.price}
                  </Badge>
                </div>
                
                <div className="flex items-center mt-4">
                  <Badge
                    className={`flex items-center ${
                      featuredProduct.stock > 3
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                        : featuredProduct.stock > 0
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100"
                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {featuredProduct.stock > 0 ? (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        {featuredProduct.stock > 3
                          ? `In stock (${featuredProduct.stock} available)`
                          : `Only ${featuredProduct.stock} left!`}
                      </>
                    ) : (
                      "Out of stock"
                    )}
                  </Badge>
                  
                  {featuredProduct.stock > 0 && featuredProduct.stock <= 3 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-3 text-sm text-amber-700 dark:text-amber-400 font-medium"
                    >
                      Selling fast!
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 my-6">
                {featuredProduct.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-300">{spec.label}:</span>
                    <span className="text-gray-900 dark:text-white"> {spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="my-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">This product includes:</h4>
                <ul className="space-y-2">
                  {featuredProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Shield className="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button asChild size="lg" className="flex-1 py-6 text-base text-gray-50 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  <Link href={`/checkout?product=${featuredProduct.id}`}>
                    Buy Now - ${featuredProduct.price}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="py-6 text-base border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  View Details
                </Button>
              </div>
              
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Free shipping • 30-day money-back guarantee
              </p>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          This deal expires in <span className="font-semibold text-gray-700 dark:text-gray-200">23:59:12</span>
        </motion.div>
      </div>
    </section>
  )
}