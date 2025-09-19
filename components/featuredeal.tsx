// components/Hero/FeaturedDeal.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { featuredDeals } from "@/lib/data/hero-data";

export default function FeaturedDeal() {
  const [currentDeal, setCurrentDeal] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % featuredDeals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const deal = featuredDeals[currentDeal];

  return (
    <div className="lg:w-2/4 relative">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden h-full">
        <div className="p-6 flex flex-col md:flex-row items-center h-full">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <motion.div
              key={currentDeal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                {deal.discount}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">{deal.name}</h2>
              <div className="flex items-center mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(deal.rating) ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="text-blue-100 text-sm ml-2">({deal.rating})</span>
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">{deal.price}</span>
                <span className="text-blue-200 line-through ml-2">{deal.originalPrice}</span>
              </div>
              <Link
                href={`/product/${deal.id}`}
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-48">
              <Image
                src={deal.image}
                alt={deal.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {featuredDeals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentDeal(index)}
            className={`w-2 h-2 rounded-full ${
              currentDeal === index ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
