// components/Hero/HorizontalCategories.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/lib/data/hero-data";


export default function HorizontalCategories() {
  const categoriesRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoriesRef.current) {
      const scrollAmount = 200;
      categoriesRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white">Popular Right Now</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scrollCategories("left")}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollCategories("right")}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={categoriesRef}
        className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 no-scrollbar"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.url.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex-shrink-0 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow snap-start"
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Shop now</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
