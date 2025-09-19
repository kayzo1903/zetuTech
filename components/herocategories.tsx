// components/Hero/HeroCategories.tsx
"use client";

import Link from "next/link";
import { Truck, Shield, Zap } from "lucide-react";
import { categories } from "@/lib/data/hero-data";


interface Category {
  id: number | string;
  name: string;
  icon: string;
  url: string
}

export default function HeroCategories() {
  return (
    <div className="hidden md:block lg:w-1/4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
        Shop by Category
      </h2>

      <div className="space-y-2">
        {categories.map((category: Category) => (
          <Link
            key={category.id}
            href={`/categories/${category.url
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="flex items-center py-2 px-3 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl mr-3">{category.icon}</span>
            <span className="text-gray-800 dark:text-gray-200">
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
          Why Choose ZetuTech?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Free Dar es Salaam Delivery
            </span>
          </div>
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              1-Year Warranty
            </span>
          </div>
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Same-Day Setup
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}