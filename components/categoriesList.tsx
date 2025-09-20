"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, Shield, Truck, Zap, DollarSign, Home, ChevronRight
} from "lucide-react";

import type { LucideProps } from "lucide-react";

// ================= Types =================
type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  specs: string[];
  icon: React.ComponentType<LucideProps>;
};

type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  isNew: boolean;
};

// ================= Mock Data =================
const categories: Category[] = [
  {
    id: "premium",
    name: "Premium Laptops",
    description: "High-performance laptops for professionals and creators",
    image: "/premium-category.jpeg",
    specs: ["Intel i7/i9 processors", "16GB+ RAM", "512GB+ SSD storage", "High-resolution displays", "Premium build quality"],
    icon: Star
  },
  {
    id: "gaming",
    name: "Gaming Laptops",
    description: "Powerful machines designed for immersive gaming",
    image: "/gaming-category.jpeg",
    specs: ["RTX GPUs", "High refresh rate", "Advanced cooling", "RGB lighting", "Performance tuned"],
    icon: Zap
  },
  {
    id: "business",
    name: "Business Laptops",
    description: "Reliable and secure laptops for enterprises",
    image: "/business-category.jpeg",
    specs: ["Security features", "Long battery life", "Professional design", "Docking support", "Enterprise management"],
    icon: Shield
  },
  {
    id: "budget",
    name: "Budget Friendly",
    description: "Affordable laptops for everyday use",
    image: "/budget-category.jpeg",
    specs: ["Value performance", "Lightweight", "Long battery life", "Basic features", "Durable design"],
    icon: DollarSign
  },
];

const productsByCategory: Record<string, Product[]> = {
  premium: [
    { id: "1", name: "MacBook Pro 16\"", price: "4,200,000 TZS", originalPrice: "4,600,000 TZS", image: "/laptop1.jpeg", rating: 4.9, reviews: 124, isNew: true },
    { id: "2", name: "Dell XPS 15", price: "3,800,000 TZS", originalPrice: "4,200,000 TZS", image: "/laptop1.jpeg", rating: 4.8, reviews: 98, isNew: false },
  ],
  gaming: [
    { id: "5", name: "ASUS ROG Zephyrus", price: "3,200,000 TZS", originalPrice: "3,600,000 TZS", image: "/laptop1.jpeg", rating: 4.5, reviews: 76, isNew: true },
    { id: "6", name: "MSI Katana GF66", price: "2,900,000 TZS", originalPrice: "3,300,000 TZS", image: "/laptop1.jpeg", rating: 4.6, reviews: 64, isNew: false },
  ],
  business: [
    { id: "9", name: "HP EliteBook 840", price: "2,100,000 TZS", originalPrice: "2,400,000 TZS", image: "/laptop1.jpeg", rating: 4.7, reviews: 93, isNew: false },
  ],
  budget: [
    { id: "12", name: "Acer Aspire 5", price: "1,300,000 TZS", originalPrice: "1,600,000 TZS", image: "/laptop1.jpeg", rating: 4.3, reviews: 67, isNew: false },
  ],
};

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

// ================= Component =================
export default function CategoryList() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [isLoading, setIsLoading] = useState(true);



  // Load category & products
  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      // Simulate API call with timeout
      const timer = setTimeout(() => {
        const foundCategory = categories.find((c) => c.id === categoryId[0]);
       
        
        if (foundCategory) {
          setCategory(foundCategory);
          setProducts(productsByCategory[categoryId[0]] || []);
        } else {
          setCategory(null);
        }
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [categoryId]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    const parsePrice = (price: string) => parseFloat(price.replace(/[^\d]/g, ""));
    switch (sortBy) {
      case "price-low": return parsePrice(a.price) - parsePrice(b.price);
      case "price-high": return parsePrice(b.price) - parsePrice(a.price);
      case "rating": return b.rating - a.rating;
      case "newest": return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
      default: return 0;
    }
  });

  // Handle case where category is not found
  if (!categoryId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Category not specified</p>
          <button 
            onClick={() => router.push('/categories')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Category &quot;{categoryId}&quot; not found</p>
          <button 
            onClick={() => router.push('/categories')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                <Link href="/categories" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                  Categories
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{category.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Category Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
            <div className="text-center px-4 z-10">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
              <p className="text-blue-100 max-w-2xl mx-auto text-lg">{category.description}</p>
            </div>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </motion.div>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Features</h2>
              <ul className="space-y-3">
                {category.specs.map((spec, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Value Propositions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Shop With Us?</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Free Delivery</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dar es Salaam and major cities</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">1-Year Warranty</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">On all products</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Same-Day Setup</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Free technical support</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Controls */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
              </p>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">No products available in this category yet.</p>
                <button 
                  onClick={() => router.push('/categories')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Browse other categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <Link href={`/products/${p.id}`} className="block w-full">
                      <div className="relative h-48 w-full">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                        {p.isNew && (
                          <div className="absolute top-3 left-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                            NEW
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{p.name}</h3>

                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(p.rating) ? "text-amber-500 fill-current" : "text-gray-300"}`} />
                          ))}
                          <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                            ({p.reviews} reviews)
                          </span>
                        </div>

                        <div className="flex items-center mb-4">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">{p.price}</span>
                          {p.originalPrice && <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">{p.originalPrice}</span>}
                        </div>

                        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}