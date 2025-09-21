"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, Search, LogOut, User } from "lucide-react";
import { ModeToggle } from "./modetoggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

interface HeaderProps {
  session: {
    user?: {
      name?: string;
      image?: string;
      role?: string;
    };
  } | null;
  isAdmin: boolean;
}

export default function Header({ session, isAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to home after sign out
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-white flex-shrink-0"
        >
          zetu<span className="text-blue-600 dark:text-blue-400">Tech</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Products
          </Link>
          <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Categories
          </Link>
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            About
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </Link>

          {/* Authentication */}
          {!session ? (
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition hidden md:inline-block"
            >
              Sign In
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || <User size={18} />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  {session.user?.name || "User"}
                  <div className="text-xs text-gray-500 capitalize">
                    {session.user?.role || "buyer"}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin-dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Mobile Nav */}
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-700 dark:text-gray-300"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-700 dark:text-gray-300"
              >
                Products
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-700 dark:text-gray-300"
              >
                Categories
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-700 dark:text-gray-300"
              >
                About
              </Link>

              {/* Auth Section */}
              {!session ? (
                <Link
                  href="/auth/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition text-center"
                >
                  Sign In
                </Link>
              ) : (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-700 dark:text-gray-300"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={async () => {
                      await handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition w-full text-center"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
