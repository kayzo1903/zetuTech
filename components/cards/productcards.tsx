"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Truck, Shield, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  brand: string;
  images: string[];
  originalPrice: number;
  salePrice?: number;
  hasDiscount: boolean;
  averageRating: number;
  stock: number;
}

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // const discountPercentage = product.hasDiscount 
  //   ? Math.round((1 - Number(product.salePrice) / Number(product.originalPrice)) * 100)
  //   : 0;

  const savingsAmount = product.hasDiscount 
    ? Number(product.originalPrice) - Number(product.salePrice || product.originalPrice)
    : 0;

  const finalPrice = Number(product.salePrice || product.originalPrice);
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
    >
      <Link href={`/products/${product.slug}/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={imageError ? "/placeholder.png" : product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Save Amount Badge */}
          {product.hasDiscount && savingsAmount > 0 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-500 text-white border-0 font-bold px-2 py-1 text-xs">
                Save {savingsAmount.toLocaleString()} TZS
              </Badge>
            </div>
          )}

          {/* Low Stock Indicator */}
          {isLowStock && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500 text-white border-0 font-bold px-2 py-1 text-xs">
                Only {product.stock} left
              </Badge>
            </div>
          )}

          {/* Wishlist Button - Top Right Corner */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-md transition-all ${
              isWishlisted 
                ? 'bg-red-500 text-white opacity-100' 
                : 'group-hover:opacity-100'
            }`}
            onClick={toggleWishlist}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Product Details */}
        <div className="p-3 sm:p-5">
          {/* Brand + Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {product.averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base sm:text-xl font-bold">
              {finalPrice.toLocaleString()} TZS
            </span>
            {product.hasDiscount && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {Number(product.originalPrice).toLocaleString()} TZS
              </span>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-green-500" />
              Free Shipping
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-500" />
              1Y Warranty
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-3 pb-3 sm:px-5 sm:pb-5">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-transform hover:scale-105"
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </motion.div>
  );
}