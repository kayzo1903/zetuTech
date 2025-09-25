// components/cards/productlistCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product; // ✅ Use unified type
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Price calculations
  // Price calculations (now working with numbers)
  const originalPrice = product.originalPrice;
  const salePrice = product.salePrice;
  const displayPrice = salePrice || originalPrice;
  const discountPercentage =
    product.hasDiscount && salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  // Stock status styling
  const getStockStatus = () => {
    switch (product.stockStatus) {
      case "In Stock":
        return { text: "In Stock", class: "text-green-600 bg-green-50" };
      case "Low Stock":
        return {
          text: `Only ${product.stock} left`,
          class: "text-amber-600 bg-amber-50",
        };
      case "Out of Stock":
        return { text: "Out of Stock", class: "text-red-600 bg-red-50" };
      case "Preorder":
        return { text: "Preorder", class: "text-blue-600 bg-blue-50" };
      default:
        return { text: product.stockStatus, class: "text-gray-600 bg-gray-50" };
    }
  };

  const stockInfo = getStockStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full"
    >
      <Link
        href={`/products/${product.slug}/${product.id}`}
        className="block flex-1 md:flex flex-col"
      >
        {/* Product Image Section */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {product.images.length > 0 ? (
            <Image
              src={imageError ? "/placeholder.png" : product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Top Left Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.hasDiscount && discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white border-0 font-bold px-2 py-1 text-xs">
                -{discountPercentage}%
              </Badge>
            )}

            {product.stockStatus === "Low Stock" && product.stock > 0 && (
              <Badge className="bg-amber-500 text-white border-0 font-bold px-2 py-1 text-xs">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Top Right Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md transition-all ${
                isWishlisted
                  ? "bg-red-500 text-white opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              onClick={toggleWishlist}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
              />
            </Button>
          </div>

          {/* Bottom Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-3 py-1">
            <div className="flex justify-between items-center">
              <span className="text-white">{stockInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {product.brand}
            </span>
            {/* Removed rating section */}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors text-sm leading-tight">
            {product.name}
          </h3>

          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.categories.slice(0, 2).map((category, i) => (
                <span
                  key={i}
                  className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                >
                  {category}
                </span>
              ))}
              {product.categories.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{product.categories.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Product Type & Warranty */}
          <div className="mb-3 space-y-1">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {product.productType.replace("-", " ")}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {displayPrice.toLocaleString("en-TZ", {
                  style: "currency",
                  currency: "TZS",
                  maximumFractionDigits: 0,
                })}
              </span>
              {product.hasDiscount && salePrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {originalPrice.toLocaleString("en-TZ", {
                    style: "currency",
                    currency: "TZS",
                    maximumFractionDigits: 0,
                  })}
                </span>
              )}
            </div>

            {/* Savings */}
            {product.hasDiscount && salePrice && (
              <div className="text-xs text-green-600 font-medium">
                Save{" "}
                {(originalPrice - salePrice).toLocaleString("en-TZ", {
                  style: "currency",
                  currency: "TZS",
                  maximumFractionDigits: 0,
                })}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-transform hover:scale-105 text-sm py-2"
          disabled={
            product.stock === 0 || product.stockStatus === "Out of Stock"
          }
        >
          {product.stockStatus === "Out of Stock"
            ? "Out of Stock"
            : product.stockStatus === "Preorder"
            ? "Preorder Now"
            : "Add to Cart"}
        </Button>
      </div>
    </motion.div>
  );
}
