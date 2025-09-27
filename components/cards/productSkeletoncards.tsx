"use client";
import { motion } from "framer-motion";

export default function ProductSkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700"
    >
      {/* Image Skeleton */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>

        {/* Price Skeleton */}
        <div className="flex gap-2 mt-4">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-9 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
      </div>
    </motion.div>
  );
}
