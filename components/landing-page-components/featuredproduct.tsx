"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Shield,
  Clock,
  Star,
  Truck,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/lib/types/product";
import WishlistButton from "@/app/wishlist/components/wishlist-button";
import { toast } from "sonner";
import { ProductActionButtons } from "../cart-system/product-action-btn";

interface FeaturedProductProps {
  featuredProduct: Product | null;
}

// ✅ FIXED: Format price - now accepts number
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

// ✅ FIXED: Calculate discount percentage - now works with numbers
const calculateDiscount = (
  originalPrice: number,
  salePrice: number | null
): number => {
  if (!salePrice) return 0;
  return Math.round((1 - salePrice / originalPrice) * 100);
};

// ✅ FIXED: Stock Status
const getStockConfig = (stock: number) => {
  if (stock > 10)
    return {
      label: `In stock (${stock} available)`,
      variant: "success" as const,
    };
  if (stock > 3)
    return { label: `Low stock (${stock} left)`, variant: "warning" as const };
  if (stock > 0)
    return { label: `Only ${stock} left!`, variant: "danger" as const };
  return { label: "Out of stock", variant: "outline" as const };
};

const badgeVariants = {
  success:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
  warning:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700",
  danger:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
  outline:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
};

export default function FeaturedProduct({
  featuredProduct,
}: FeaturedProductProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!featuredProduct) return null;

  // ✅ FIXED: Share function with proper parameters and URL construction
  const shareProduct = () => {
    // Construct the product URL using slug and id
    const productUrl = `${window.location.origin}/products/${featuredProduct.slug}/${featuredProduct.id}`;

    const shareData = {
      title: featuredProduct.name,
      text: featuredProduct.description || "Check out this amazing product!",
      url: productUrl,
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.error("Sharing failed:", error);
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(productUrl);
        toast.success("Product link copied to clipboard!");
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(productUrl);
      toast.success("Product link copied to clipboard!");
    }
  };

  // ✅ FIXED: Pass numbers instead of strings
  const discountPercent = calculateDiscount(
    featuredProduct.originalPrice,
    featuredProduct.salePrice
  );
  const stockConfig = getStockConfig(featuredProduct.stock);
  const currentPrice =
    featuredProduct.salePrice || featuredProduct.originalPrice;

  const features = [
    { text: "30-day money-back guarantee", icon: RotateCcw },
    { text: "Free shipping", icon: Truck },
    { text: "1-year warranty", icon: Shield },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-6 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 lg:mb-8"
        >
          <Badge className="bg-blue-600 text-white px-3 py-1 border-0">
            <Zap className="w-4 h-4 mr-1" /> Today&apos;s Featured Deal
          </Badge>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
          {/* Mobile-first: Image Top */}
          <div className="flex flex-col">
            <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden">
              <Image
                src={
                  featuredProduct.images[selectedImageIndex] ||
                  "/placeholder-product.png"
                }
                alt={featuredProduct.name}
                fill
                priority
                className="object-contain bg-gray-50 dark:bg-gray-800"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Wishlist & Share Buttons */}
              <div className="absolute top-4 right-4 flex flex-nowrap gap-2">
                <WishlistButton productId={featuredProduct.id} />
                {/* ✅ FIXED: Share Button */}
                <button
                  onClick={shareProduct}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 border-0">
                  -{discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            {featuredProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto mt-3">
                {featuredProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {featuredProduct.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(featuredProduct.averageRating || 0)
                          ? "fill-current"
                          : "opacity-30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {(featuredProduct.averageRating || 0).toFixed(1)} (
                  {featuredProduct.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Price Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {/* ✅ FIXED: Pass number instead of string */}
                    {formatPrice(currentPrice)}
                  </span>
                  {featuredProduct.hasDiscount && featuredProduct.salePrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {/* ✅ FIXED: Pass number instead of string */}
                      {formatPrice(featuredProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Badge
                    className={`text-sm ${badgeVariants[stockConfig.variant]}`}
                  >
                    <Clock className="w-3 h-3 mr-1" /> {stockConfig.label}
                  </Badge>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <ProductActionButtons
                  product={featuredProduct}
                  layout="horizontal"
                  className="mt-4"
                />
              </div>

              {/* Accordions */}
              <Accordion type="single" collapsible>
                <AccordionItem value="description">
                  <AccordionTrigger>Product Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {featuredProduct.description ||
                        "No description provided."}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reviews">
                  <AccordionTrigger>Customer Reviews</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {featuredProduct.reviewCount || 0} reviews available.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <feature.icon className="w-4 h-4 text-green-500 mr-2" />
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
