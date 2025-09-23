// components/productdetail.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Truck,
  Shield,
  ArrowLeft,
  Heart,
  Share2,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { Product } from "@/lib/validation-schemas/product-type";

// components/productdetail.tsx

interface ProductDetailProps {
  productData: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({
  productData,
  relatedProducts,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // Add your cart logic here
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add your favorite logic here
  };

  // components/productdetail.tsx
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: productData.name,
        text: productData.shortDescription || productData.description, // Fallback to description if shortDescription is null
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  // Format price function - updated to handle null values
  const formatPrice = (price: string | null) => {
    if (!price) return "TZS 0";

    const priceNum = parseFloat(price);
    return priceNum.toLocaleString("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    });
  };

  // Calculate discount percentage
  const discountPercentage =
    productData.hasDiscount &&
    productData.salePrice &&
    productData.originalPrice
      ? Math.round(
          (1 -
            parseFloat(productData.salePrice) /
              parseFloat(productData.originalPrice)) *
            100
        )
      : 0;

  // Generate specifications from available data
  const specifications = [
    { name: "Brand", value: productData.brand },
    { name: "Product Type", value: productData.productType },
    { name: "SKU", value: productData.sku || "N/A" },
    { name: "Stock Status", value: productData.stockStatus },
    { name: "In Stock", value: productData.stock.toString() },
    ...(productData.hasWarranty
      ? [
          { name: "Warranty", value: `${productData.warrantyPeriod} years` },
          {
            name: "Warranty Details",
            value: productData.warrantyDetails || "Standard warranty",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative h-96 w-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-4 shadow-md mb-4">
              {productData.images.length > 0 ? (
                <Image
                  src={productData.images[selectedImage]}
                  alt={productData.name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingCart className="h-16 w-16" />
                </div>
              )}
            </div>

            {productData.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-md overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-sm border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-500 dark:border-blue-400 scale-105"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${productData.name} view ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {productData.name}
                </h1>
                <div className="flex items-center">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(productData.averageRating)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {productData.averageRating.toFixed(1)} (
                    {productData.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={shareProduct}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(productData.salePrice)}
                </span>
                {productData.hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(productData.originalPrice)}
                    </span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-md text-sm font-medium">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              <p
                className={`mt-2 text-sm font-medium ${
                  productData.stock > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {productData.stock > 0
                  ? `In stock (${productData.stock} available)`
                  : "Out of stock"}
              </p>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {productData.description}
              </p>
            </div>

            {/* Categories */}
            {productData.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {productData.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 dark:text-white min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(productData.stock, quantity + 1))
                    }
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    disabled={quantity >= productData.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    productData.stock === 0
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {addedToCart ? "Added to Cart! ✓" : "Add to Cart"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={productData.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    productData.stock === 0
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                >
                  Buy Now
                </motion.button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Truck className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Free Shipping
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Delivery in 2-3 days
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Shield className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {productData.hasWarranty
                      ? `${productData.warrantyPeriod} Year Warranty`
                      : "1 Year Warranty"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Free support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Product Details
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <tbody>
                {specifications.map((spec, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800"
                    }
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white w-1/3">
                      {spec.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Related Products
              </h2>
              <Link
                href={`/products?productType=${productData.productType}`}
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View all {productData.productType}s
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <Link
                    href={`/products/${product.slug}/${product.id}`}
                    className="block"
                  >
                    <div className="relative h-48 w-full">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                            {product.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.reviewCount} reviews
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(product.salePrice)}
                        </span>
                        {product.hasDiscount && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
