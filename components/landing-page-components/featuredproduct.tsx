"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Zap, Shield, Clock, CheckCircle, Star, Truck, RotateCcw } from "lucide-react"
import { useState } from "react"
import { FeaturedProductTypes } from "@/lib/server/get-featuredProduct"

interface FeaturedProductProps {
  featuredProduct: FeaturedProductTypes | null
}

// Price formatting utility
const formatPrice = (price: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parseFloat(price))
}

// Calculate discount percentage helper
const calculateDiscount = (originalPrice: string, salePrice: string | null): number => {
  if (!salePrice) return 0
  return Math.round((1 - parseFloat(salePrice) / parseFloat(originalPrice)) * 100)
}

// Stock status configuration
const getStockConfig = (stock: number) => {
  if (stock > 10) return { 
    label: `In stock (${stock} available)`, 
    variant: "success" as const,
    urgency: null 
  }
  if (stock > 3) return { 
    label: `Low stock (${stock} left)`, 
    variant: "warning" as const,
    urgency: "Moderate demand" 
  }
  if (stock > 0) return { 
    label: `Only ${stock} left!`, 
    variant: "danger" as const,
    urgency: "Selling fast!" 
  }
  return { 
    label: "Out of stock", 
    variant: "outline" as const,
    urgency: null 
  }
}

// Badge variants based on stock status
const badgeVariants = {
  success: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
  warning: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700",
  danger: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
  outline: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
}

export default function FeaturedProduct({ featuredProduct }: FeaturedProductProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Early return if no featured product
  if (!featuredProduct) {
    return null
  }

  const discountPercent = calculateDiscount(featuredProduct.originalPrice, featuredProduct.salePrice)
  const stockConfig = getStockConfig(featuredProduct.stock)
  const currentPrice = featuredProduct.salePrice || featuredProduct.originalPrice
  
  const features = [
    { text: "30-day money-back guarantee", icon: RotateCcw },
    { text: "Free shipping", icon: Truck },
    { text: "1-year warranty", icon: Shield }
  ]

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-4 py-2 border-0 shadow-sm">
            <Zap className="w-4 h-4 mr-2" />
            Today&apos;s Featured Deal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
            {featuredProduct.name}
          </h1>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-shadow duration-300"
        >
          <div className="grid lg:grid-cols-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600"
            >
              {/* Wishlist Button */}
              <div className="absolute top-6 right-6 z-20">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  onClick={() => setIsLiked(!isLiked)}
                  aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart 
                    className={`h-5 w-5 transition-all duration-200 ${
                      isLiked 
                        ? "fill-red-500 text-red-500 scale-110" 
                        : "text-gray-600 dark:text-gray-300"
                    }`} 
                  />
                </Button>
              </div>
              
              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-6 left-6 z-20">
                  <Badge className="bg-red-500 text-white border-0 px-3 py-2 text-sm font-semibold shadow-lg">
                    -{discountPercent}% OFF
                  </Badge>
                </div>
              )}

              {/* Main Image */}
              <div className="relative h-80 md:h-96 mb-6">
                <Image
                  src={featuredProduct.images[selectedImageIndex] || "/placeholder-product.png"}
                  alt={featuredProduct.name}
                  fill
                  className="object-contain transition-transform duration-300 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {featuredProduct.images.length > 1 && (
                <div className="flex justify-center gap-3 mt-6">
                  {featuredProduct.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-xl bg-white dark:bg-gray-600 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedImageIndex === index
                          ? "border-blue-500 dark:border-blue-400 shadow-md"
                          : "border-gray-200 dark:border-gray-500 hover:border-blue-300"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`${featuredProduct.name} view ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="80px"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 md:p-10"
            >
              {/* Product Header */}
              <div className="mb-6">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 mb-3">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Certified Refurbished
                </Badge>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {featuredProduct.name}
                </h2>
                
                {/* Rating */}
                <div className="flex items-center flex-wrap gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          i < Math.floor(featuredProduct.averageRating) 
                            ? 'fill-current' 
                            : 'stroke-current opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {featuredProduct.averageRating.toFixed(1)} • {featuredProduct.reviewCount} reviews
                  </span>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="my-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(currentPrice)}
                  </span>
                  {featuredProduct.hasDiscount && featuredProduct.salePrice && (
                    <>
                      <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(featuredProduct.originalPrice)}
                      </span>
                      <Badge className="bg-green-500 text-white border-0 px-3 py-1 text-sm">
                        Save {discountPercent}%
                      </Badge>
                    </>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                  <Badge className={`flex items-center ${badgeVariants[stockConfig.variant]}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {stockConfig.label}
                  </Badge>
                  
                  {stockConfig.urgency && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm font-semibold text-amber-600 dark:text-amber-400 animate-pulse"
                    >
                      {stockConfig.urgency}
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="my-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                  Included Benefits:
                </h4>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <feature.icon className="w-4 h-4 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
                      <span className="font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="flex-1 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Link href={`/products/${featuredProduct.slug}/${featuredProduct.id}`} className="flex items-center justify-center">
                    View Full Details
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="py-6 text-base font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                  disabled={featuredProduct.stock === 0}
                >
                  <Link href={`/checkout?product=${featuredProduct.id}`}>
                    {featuredProduct.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </Link>
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex justify-center items-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Truck className="w-4 h-4" />
                  Free shipping
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Shield className="w-4 h-4" />
                  Secure checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <RotateCcw className="w-4 h-4" />
                  30-day returns
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}