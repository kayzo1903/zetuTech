"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types/product";
import ProductCard from "../cards/productlistCard";

interface NewArrivalsProps {
  products: Product[]; // Use Product type
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl px-4 mx-auto sm:px-6">
        {/* Section Header */}
        <div className="flex flex-row flex-nowrap items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">New Arrival</h2>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition group"
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
