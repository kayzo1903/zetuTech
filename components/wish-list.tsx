// components/wishlist/wishlist.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";
import { Product } from "@/lib/types/product";

// Mock data matching your Product type
const WISHLIST_ITEMS: Product[] = [
  {
    id: "1",
    name: 'MacBook Pro 16"',
    description: 'M2 Pro chip, 16GB RAM, 1TB SSD - Experience unparalleled performance with the latest MacBook Pro.',
    shortDescription: "M2 Pro chip, 16GB RAM, 1TB SSD",
    brand: "Apple",
    productType: "laptop",
    originalPrice: 2799000,
    salePrice: 2499000,
    hasDiscount: true,
    stock: 15,
    stockStatus: "In Stock",
    status: "active",
    slug: "macbook-pro-16",
    categories: ["Laptops", "Apple", "Premium"],
    images: ["/images/categories/laptops.jpg"],
    averageRating: 4.8,
    reviewCount: 124,
    createdAt: "2024-01-15",
    warrantyPeriod: 12,
    warrantyDetails: "1 year limited warranty",
    sku: "MBP16-M2-2024",
    hasWarranty: true
  },
  {
    id: "2",
    name: "Sony WH-1000XM5",
    description: "Wireless Noise Canceling Headphones with exceptional sound quality.",
    shortDescription: "Wireless Noise Canceling Headphones",
    brand: "Sony",
    productType: "headphones",
    originalPrice: 449000,
    salePrice: 399000,
    hasDiscount: true,
    stock: 8,
    stockStatus: "Low Stock",
    status: "active",
    slug: "sony-wh-1000xm5",
    categories: ["Audio", "Headphones", "Wireless"],
    images: ["/images/categories/laptops.jpg"],
    averageRating: 4.6,
    reviewCount: 89,
    createdAt: "2024-02-20",
    warrantyPeriod: 24,
    warrantyDetails: "2 years manufacturer warranty",
    sku: "SONY-XM5-2024",
    hasWarranty: true
  },
  {
    id: "3",
    name: "iPhone 15 Pro",
    description: "Titanium design, 256GB, Natural Titanium - The ultimate iPhone experience.",
    shortDescription: "Titanium, 256GB, Natural Titanium",
    brand: "Apple",
    productType: "smartphone",
    originalPrice: 1299000,
    salePrice: 1199000,
    hasDiscount: true,
    stock: 0,
    stockStatus: "Out of Stock",
    status: "active",
    slug: "iphone-15-pro",
    categories: ["Smartphones", "Apple", "Flagship"],
    images: ["/images/categories/laptops.jpg"],
    averageRating: 4.9,
    reviewCount: 256,
    createdAt: "2024-03-10",
    warrantyPeriod: 12,
    warrantyDetails: "1 year Apple warranty",
    sku: "IP15P-256-TI",
    hasWarranty: true
  },
  {
    id: "4",
    name: "Samsung Odyssey G9",
    description: '49" Curved Gaming Monitor with stunning visuals and immersive experience.',
    shortDescription: '49" Curved Gaming Monitor',
    brand: "Samsung",
    productType: "monitor",
    originalPrice: 1499000,
    salePrice: 1299000,
    hasDiscount: true,
    stock: 25,
    stockStatus: "In Stock",
    status: "active",
    slug: "samsung-odyssey-g9",
    categories: ["Monitors", "Gaming", "Curved"],
    images: ["/images/categories/laptops.jpg"],
    averageRating: 4.7,
    reviewCount: 67,
    createdAt: "2024-01-30",
    warrantyPeriod: 36,
    warrantyDetails: "3 years panel warranty",
    sku: "SAM-ODY-G9-49",
    hasWarranty: true
  }
];

export default function Wishlist() {
  const [items, setItems] = useState<Product[]>(WISHLIST_ITEMS);
  const [sortBy, setSortBy] = useState("date-added");

  const removeFromWishlist = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const moveToCart = (id: string) => {
    // In a real app, this would move the item to cart
    console.log("Moving item to cart:", id);
    // For demo, just remove from wishlist
    removeFromWishlist(id);
  };

  const addAllToCart = () => {
    const inStockItems = items.filter((item) => item.stockStatus === "In Stock" || item.stockStatus === "Low Stock");
    inStockItems.forEach((item) => moveToCart(item.id));
  };

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.salePrice || item.originalPrice), 0);
  const inStockCount = items.filter((item) => item.stockStatus === "In Stock" || item.stockStatus === "Low Stock").length;

  // Stock status styling (matching your product card)
  const getStockStatus = (product: Product) => {
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

  if (items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist. Review them anytime and easily
            move them to your cart.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Wishlist
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600 dark:text-slate-400">
            {totalItems} {totalItems === 1 ? "item" : "items"} • Total value:{" "}
            {totalValue.toLocaleString("en-TZ", {
              style: "currency",
              currency: "TZS",
              maximumFractionDigits: 0,
            })}
          </p>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-added">Date Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share List
            </Button>
          </div>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-6">
        {items.map((item, index) => {
          const stockInfo = getStockStatus(item);
          const discountPercentage = item.hasDiscount && item.salePrice
            ? Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100)
            : 0;
          const displayPrice = item.salePrice || item.originalPrice;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full"
            >
              <CardContent className="p-0 flex flex-col h-full">
                {/* Product Image Section */}
                <Link 
                  href={`/products/${item.slug}/${item.id}`}
                  className="block flex-1 md:flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}

                    {/* Top Left Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.hasDiscount && discountPercentage > 0 && (
                        <Badge className="bg-red-500 text-white border-0 font-bold px-2 py-1 text-xs">
                          -{discountPercentage}%
                        </Badge>
                      )}

                      {item.stockStatus === "Low Stock" && item.stock > 0 && (
                        <Badge className="bg-amber-500 text-white border-0 font-bold px-2 py-1 text-xs">
                          Low Stock
                        </Badge>
                      )}
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
                        {item.brand}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors text-sm leading-tight">
                      {item.name}
                    </h3>

                    {/* Categories */}
                    {item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.categories.slice(0, 2).map((category, i) => (
                          <span
                            key={i}
                            className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {category}
                          </span>
                        ))}
                        {item.categories.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{item.categories.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Product Type & Warranty */}
                    <div className="mb-3 space-y-1">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {item.productType.replace("-", " ")}
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
                        {item.hasDiscount && item.salePrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {item.originalPrice.toLocaleString("en-TZ", {
                              style: "currency",
                              currency: "TZS",
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        )}
                      </div>

                      {/* Savings */}
                      {item.hasDiscount && item.salePrice && (
                        <div className="text-xs text-green-600 font-medium">
                          Save{" "}
                          {(item.originalPrice - item.salePrice).toLocaleString("en-TZ", {
                            style: "currency",
                            currency: "TZS",
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Actions Section - Matching your product card layout */}
                <div className="p-4 pt-0">
                  <div className="flex flex-col gap-2">
                    {/* Remove Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-300 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>

                    {/* Add to Cart Button */}
                    <Button
                      size="sm"
                      disabled={item.stockStatus === "Out of Stock"}
                      onClick={(e) => {
                        e.preventDefault();
                        moveToCart(item.id);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {item.stockStatus === "Out of Stock"
                        ? "Out of Stock"
                        : item.stockStatus === "Preorder"
                        ? "Preorder Now"
                        : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          );
        })}
      </div>

      {/* Wishlist Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Ready to checkout?
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Move all available items to your cart
          </p>
        </div>
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={addAllToCart}
          disabled={inStockCount === 0}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add All to Cart ({inStockCount})
        </Button>
      </div>
    </div>
  );
}