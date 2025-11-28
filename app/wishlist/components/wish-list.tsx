// components/wishlist/Wishlist.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Share2, Loader2 } from "lucide-react";
import { Product } from "@/lib/types/product";
import { toast } from "sonner";
import { getWishlist, removeWishlistItem } from "@/lib/api/wishlistApiCall";
import { useCartStore } from "@/lib/cart/store"; // ✅ Import cart store

export default function Wishlist() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date-added");

  // Track button loading states
  const [loadingRemove, setLoadingRemove] = useState<string | null>(null);
  const [loadingCart, setLoadingCart] = useState<string | null>(null);
  const [loadingAddAll, setLoadingAddAll] = useState(false);

  // ✅ Get cart store functions
  const { addItem, isUpdating } = useCartStore();

  // Load wishlist items on component mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const result = await getWishlist();

      if (result.success && result.data) {
        setItems(result.data.items);
      } else {
        toast.error(result.error || "Failed to load wishlist");
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      setLoadingRemove(id);
      const result = await removeWishlistItem(id);

      if (result.success) {
        setItems(items.filter((item) => item.id !== id));
        toast.success("Item removed from wishlist");
      } else {
        toast.error(result.error || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    } finally {
      setLoadingRemove(null);
    }
  };

  // ✅ Updated: Move to cart with proper cart store integration
  const moveToCart = async (product: Product) => {
    try {
      setLoadingCart(product.id);
      
      // Check if product is available
      if (product.stockStatus === "Out of Stock") {
        toast.error("Product is out of stock");
        return;
      }

      // Add to cart using the cart store
      await addItem(product, 1); // Default quantity: 1
      
      toast.success(`${product.name} added to cart`);
      
      // Optionally remove from wishlist after adding to cart
      // Uncomment the line below if you want to auto-remove from wishlist
      // await handleRemoveFromWishlist(product.id);
      
    } catch (error) {
      console.error("Error moving to cart:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart";
      toast.error(errorMessage);
    } finally {
      setLoadingCart(null);
    }
  };

  // ✅ Updated: Add all available items to cart
  const addAllToCart = async () => {
    try {
      setLoadingAddAll(true);
      const inStockItems = items.filter(
        (item) =>
          item.stockStatus === "In Stock" || item.stockStatus === "Low Stock"
      );

      if (inStockItems.length === 0) {
        toast.error("No available items to add to cart");
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Process items sequentially to avoid overwhelming the API
      for (const item of inStockItems) {
        try {
          await addItem(item, 1);
          successCount++;
          
          // Optional: Add small delay between requests
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed to add ${item.name} to cart:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Added ${successCount} items to cart${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
      }
      
      if (errorCount > 0 && successCount === 0) {
        toast.error("Failed to add items to cart");
      }

    } catch (error) {
      console.error("Error adding all to cart:", error);
      toast.error("Failed to add items to cart");
    } finally {
      setLoadingAddAll(false);
    }
  };

  // Apply sorting
  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (
          (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice)
        );
      case "price-high":
        return (
          (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice)
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "date-added":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const inStockCount = sortedItems.filter(
    (item) =>
      item.stockStatus === "In Stock" || item.stockStatus === "Low Stock"
  ).length;

  // Stock status styling
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

  // Skeleton Loading for the entire wishlist
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty wishlist state
  if (sortedItems.length === 0) {
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
          <div className="text-sm text-gray-600 dark:text-slate-400">
            {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} • {inStockCount} available
          </div>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedItems.map((item, index) => {
          const stockInfo = getStockStatus(item);
          const discountPercentage =
            item.hasDiscount && item.salePrice
              ? Math.round(
                  ((item.originalPrice - item.salePrice) / item.originalPrice) *
                    100
                )
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
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors text-sm leading-tight">
                      {item.name}
                    </h3>

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
                    </div>
                  </div>
                </Link>

                {/* Actions Section */}
                <div className="p-4 pt-0">
                  <div className="flex flex-col gap-2">
                    {/* Remove Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingRemove === item.id}
                      className="w-full border-gray-300 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromWishlist(item.id);
                      }}
                    >
                      {loadingRemove === item.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      {loadingRemove === item.id ? "Removing..." : "Remove"}
                    </Button>

                    {/* Add to Cart Button */}
                    <Button
                      size="sm"
                      disabled={
                        item.stockStatus === "Out of Stock" ||
                        loadingCart === item.id ||
                        isUpdating
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        moveToCart(item);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingCart === item.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      )}
                      {loadingCart === item.id
                        ? "Adding..."
                        : item.stockStatus === "Out of Stock"
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
            {inStockCount > 0 
              ? `Move ${inStockCount} available ${inStockCount === 1 ? 'item' : 'items'} to your cart`
              : 'No available items to add to cart'
            }
          </p>
        </div>
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={addAllToCart}
          disabled={inStockCount === 0 || loadingAddAll || isUpdating}
        >
          {loadingAddAll ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5 mr-2" />
          )}
          {loadingAddAll 
            ? "Adding..." 
            : inStockCount > 0 
              ? `Add All to Cart (${inStockCount})`
              : 'No Items Available'
          }
        </Button>
      </div>
    </div>
  );
}