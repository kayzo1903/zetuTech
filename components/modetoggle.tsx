"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 opacity-50 transition-all duration-500 ease-out">
        <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-300 ease-out"></div>
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <div 
      className={`relative w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        isDark ? 'bg-blue-600' : 'bg-amber-300'
      }`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div 
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transform transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isDark ? (
            <Moon className="h-4 w-4 text-blue-600 transition-all duration-700 ease-out" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500 transition-all duration-700 ease-out" />
          )}
        </div>
      </div>
      
      {/* Optional: Add system option on long press */}
      <button 
        className="sr-only"
        onClick={(e) => {
          e.stopPropagation()
          setTheme("system")
        }}
      >
        Use system theme
      </button>

      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-full opacity-0 transition-all duration-1000 ${
        isDark ? 'bg-blue-400' : 'bg-amber-200'
      } ${isDark ? 'group-hover:opacity-20' : 'group-hover:opacity-30'}`} />
    </div>
  )
}