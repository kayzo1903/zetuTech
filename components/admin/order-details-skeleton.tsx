import React from 'react'

// Theme-aware color classes
export const themeClasses = {
  // Backgrounds
  bg: {
    primary: "bg-white dark:bg-gray-900",
    secondary: "bg-gray-50 dark:bg-gray-800",
    accent: "bg-blue-50 dark:bg-blue-900/20",
    muted: "bg-gray-100 dark:bg-gray-800/50",
  },
  // Text
  text: {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-600 dark:text-gray-400",
    muted: "text-gray-500 dark:text-gray-500",
    accent: "text-blue-600 dark:text-blue-400",
  },
  // Borders
  border: {
    primary: "border-gray-200 dark:border-gray-700",
    secondary: "border-gray-300 dark:border-gray-600",
    accent: "border-blue-200 dark:border-blue-700",
  },
  // Cards
  card: {
    bg: "bg-white dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    hover: "hover:bg-gray-50 dark:hover:bg-gray-700/50",
  },
} as const;

export default function OrderDetailsSkeleton() {
  return (
    <div className={`min-h-screen ${themeClasses.bg.secondary} p-6`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-9 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div>
                <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-64 ${themeClasses.card.bg} border ${themeClasses.border.primary} rounded-lg animate-pulse`}></div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-32 ${themeClasses.card.bg} border ${themeClasses.border.primary} rounded-lg animate-pulse`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}
