"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 opacity-50 transition-colors duration-300" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-out ${
        isDark 
          ? "bg-gradient-to-r from-indigo-700 to-purple-700" 
          : "bg-gradient-to-r from-blue-400 to-cyan-400"
      } shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {/* Track with subtle gradient */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
        isDark ? "opacity-100" : "opacity-0"
      } bg-gradient-to-r from-indigo-700 to-purple-700`} />
      
      <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
        isDark ? "opacity-0" : "opacity-100"
      } bg-gradient-to-r from-blue-400 to-cyan-400`} />
      
      {/* Knob with floating effect */}
      <span
        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-lg transform transition-all duration-500 ease-in-out ${
          isDark 
            ? "translate-x-8 rotate-360" 
            : "translate-x-0 rotate-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-indigo-700 transition-all duration-500" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500 transition-all duration-500" />
        )}
      </span>
      
      {/* Optional: Add stars for dark mode and sun rays for light mode */}
      <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-500 ${
        isDark ? "opacity-100" : "opacity-0"
      }`}>
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1 h-1 rounded-full bg-white/70" />
        ))}
      </div>
    </button>
  )
}