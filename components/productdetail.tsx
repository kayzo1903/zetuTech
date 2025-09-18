"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Truck, Shield, ArrowLeft, Heart, Share2, Check, ChevronRight } from "lucide-react";

// Mock product data - in a real app this would come from your data source
const product = {
  id: "1",
  name: "Dell XPS 15",
  price: "2,450,000 TZS",
  originalPrice: "2,800,000 TZS",
  images: ["/laptop1.jpeg", "/laptop2.jpeg", "/laptop3.jpeg"],
  rating: 4.8,
  reviews: 42,
  description: "The Dell XPS 15 is a powerful and sleek laptop designed for professionals and creatives. Featuring a stunning 15.6-inch InfinityEdge display, powerful Intel processors, and dedicated graphics, it's perfect for demanding tasks.",
  specs: [
    { name: "Processor", value: "Intel Core i7-11800H" },
    { name: "RAM", value: "16GB DDR4" },
    { name: "Storage", value: "512GB NVMe SSD" },
    { name: "Display", value: '15.6" FHD (1920 x 1080) InfinityEdge' },
    { name: "Graphics", value: "NVIDIA GeForce RTX 3050 Ti 4GB" },
    { name: "Battery", value: "86Whr, up to 8 hours" },
    { name: "Weight", value: "1.8 kg" },
    { name: "Operating System", value: "Windows 11 Pro" },
  ],
  features: [
    "Premium aluminum chassis",
    "Backlit keyboard",
    "Thunderbolt 4 ports",
    "Wi-Fi 6 compatible",
    "Fingerprint reader",
    "Studio-quality speakers"
  ],
  stock: 3,
  category: "Premium",
  sku: "DLL-XPS15-11800H",
};

// Mock similar products data
const similarProducts = [
  {
    id: "2",
    name: "HP Spectre x360",
    price: "2,200,000 TZS",
    originalPrice: "2,500,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.6,
    reviews: 38,
    specs: ["Intel i5", "8GB RAM", "256GB SSD", "13.3\" Touch"],
    category: "2-in-1",
    stock: 5,
    isNew: false
  },
  {
    id: "3",
    name: "Lenovo ThinkPad X1",
    price: "2,800,000 TZS",
    originalPrice: "3,200,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.9,
    reviews: 56,
    specs: ["Intel i7", "16GB RAM", "1TB SSD", "14\" 4K"],
    category: "Business",
    stock: 2,
    isNew: true
  },
  {
    id: "4",
    name: "MacBook Pro 14\"",
    price: "3,500,000 TZS",
    originalPrice: "4,000,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.7,
    reviews: 67,
    specs: ["Apple M1 Pro", "16GB RAM", "512GB SSD", "14.2\" Liquid Retina"],
    category: "Apple",
    stock: 4,
    isNew: false
  },
  {
    id: "5",
    name: "ASUS ROG Zephyrus",
    price: "3,200,000 TZS",
    originalPrice: "3,600,000 TZS",
    image: "/laptop1.jpeg",
    rating: 4.5,
    reviews: 29,
    specs: ["AMD Ryzen 9", "32GB RAM", "1TB SSD", "RTX 3060"],
    category: "Gaming",
    stock: 1,
    isNew: true
  }
];

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <Link href="/products" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative h-96 w-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-4 shadow-md mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-md overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-sm border-2 ${
                    selectedImage === index 
                      ? "border-blue-500 dark:border-blue-400" 
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{product.price}</span>
                <span className="ml-3 text-lg text-gray-500 dark:text-gray-400 line-through">
                  {product.originalPrice}
                </span>
                <span className="ml-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-md text-sm font-medium">
                  Save 12%
                </span>
              </div>
              <p className="text-green-600 dark:text-green-400 mt-2">
                {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="mr-3 text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-gray-900 dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white ${
                    product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold ${
                    product.stock === 0
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                >
                  Buy Now
                </motion.button>
              </div>
            </div>

            {/* Shipping and Warranty */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Truck className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Delivery in 2-3 days</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Shield className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">1 Year Warranty</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Free support</p>
                </div>
              </div>
            </div>

            {/* SKU and Category */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>SKU: {product.sku}</p>
              <p>Category: {product.category}</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Specifications</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.specs.map((spec, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white w-1/3">{spec.name}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Similar Products</h2>
            <Link 
              href="/products" 
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                        NEW
                      </div>
                    )}
                    {product.stock < 5 && (
                      <div className="absolute top-3 right-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {product.stock} LEFT
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center text-sm text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-gray-700 dark:text-gray-300">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.specs.slice(0, 2).map((spec, i) => (
                        <span 
                          key={i}
                          className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {product.price}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}