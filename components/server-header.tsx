import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { ModeToggle } from "./modetoggle";
import { getServerSession } from "@/lib/server-session";
import { ClientAuthSection } from "./client-auth-section";
import { ClientMobileMenu } from "./client-mobile-menu";

export default async function ServerHeader() {
  // Get session on the server side
  const { user, userRole, isAdmin } = await getServerSession();

  // Extract only serializable properties from user
  const serializableUser = user ? {
    name: user.name || '',
    image: user.image || '',
    email: user.email || ''
  } : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-white flex-shrink-0"
        >
          zetu<span className="text-blue-600 dark:text-blue-400">Tech</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <form className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
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

        {/* Right Side Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition" />
            {/* Cart badge */}
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </Link>

          {/* Auth Section - Client Component */}
          <ClientAuthSection 
            user={serializableUser}
            userRole={userRole}
            isAdmin={isAdmin}
          />

          {/* Mobile Menu Toggle - Client Component */}
          <ClientMobileMenu />
        </div>
      </div>
    </header>
  );
}