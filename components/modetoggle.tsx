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
      <div className="w-14 h-8 rounded-full bg-gray-300 dark:bg-gray-600 opacity-50 transition-colors duration-300" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out ${
        isDark ? "bg-gray-700" : "bg-gray-300"
      }`}
    >
      {/* Knob */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transform transition-transform duration-500 ease-in-out ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-blue-600 transition-transform duration-500" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-transform duration-500" />
        )}
      </span>
    </button>
  )
}
