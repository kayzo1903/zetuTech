"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  Search,
  LogOut,
  User,
  Heart,
  ChevronDown,
  Phone,
  Mail,
  Truck,
  Shield,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
} from "@/lib/validation-schemas/product-type";
import { ModeToggle } from "./modetoggle";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/lib/cart/store"; // ✅ Import cart store
import { toast } from "sonner";
import { CartDrawer } from "./cart-system/cart-drawer";

interface HeaderProps {
  session: {
    user?: {
      id?: string; // ✅ Added id for cart merging
      name?: string;
      image?: string;
      role?: string;
    };
  } | null;
  isAdmin: boolean;
}

export default function Header({ session, isAdmin }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // ✅ Get real wishlist data from store
  const { items: wishlistItems, initializeWishlist } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

  // ✅ Get cart data from store
  const { summary: cartSummary, initializeCart, syncCart } = useCartStore();
  const cartItemsCount = cartSummary.totalItems;

  // ✅ Initialize wishlist and cart when user state changes
  useEffect(() => {
    if (session?.user) {
      initializeWishlist();
      initializeCart();
    } else {
      // Initialize cart for guest users too
      initializeCart();
    }
  }, [session?.user, initializeWishlist, initializeCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          // ✅ Reinitialize cart as guest after sign out
          setTimeout(() => {
            initializeCart();
          }, 1000);
        },
      },
    });
  };

  return (
    <header
      className="sticky bg-gradient-to-r from-gray-50 via-white to-gray-100 
        dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 
        text-gray-900 dark:text-white text-xs sm:text-sm top-0 z-50 w-full border-b bg-background shadow-sm"
    >
      {/* Top Bar */}
      <div>
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Contact Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>+255 123 456 789</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>support@zetutech.co.tz</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>Free Shipping Over 500,000 TZS</span>
              </div>
              <div className="hidden lg:flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>1-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              {/* Mobile Sidebar */}
              <SheetContent
                side="left"
                className="w-80 sm:w-96 overflow-y-auto bg-background"
              >
                <div className="space-y-6 px-4">
                  {/* Logo */}
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      zetu<span className="text-blue-600">Tech</span>
                    </span>
                  </Link>

                  {/* User Info or Auth Buttons */}
                  {session ? (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>
                          {session.user?.name?.charAt(0) || <User size={16} />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {session.user?.role || "buyer"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild className="w-full" size="sm">
                        <Link href="/auth/sign-in">Sign In</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <Link href="/auth/sign-up">Create Account</Link>
                      </Button>
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="block rounded-md hover:bg-muted"
                      >
                        Home
                      </Link>
                    </SheetClose>

                    {/* Product Types Accordion */}
                    <div>
                      <Accordion type="single" collapsible className="w-full">
                        <SheetClose asChild>
                          <Link
                            href="/products"
                            className="text-sm font-medium mb-3"
                          >
                            All Categories
                          </Link>
                        </SheetClose>
                        {PRODUCT_TYPES.map((type) => (
                          <AccordionItem
                            key={type.id}
                            value={type.id}
                            className="border-none"
                          >
                            <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                              {type.label}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-1 pl-4">
                                {PRODUCT_CATEGORIES[
                                  type.id as keyof typeof PRODUCT_CATEGORIES
                                ]?.map((category) => (
                                  <SheetClose key={category} asChild>
                                    <Link
                                      href={`/products?type=${
                                        type.id
                                      }&category=${encodeURIComponent(
                                        category
                                      )}`}
                                      className="block text-sm text-muted-foreground hover:text-primary py-1 transition-colors"
                                    >
                                      {category}
                                    </Link>
                                  </SheetClose>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    {/* ✅ Wishlist with Real Count */}
                    <SheetClose asChild>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md relative"
                      >
                        <Heart className="w-5 h-5" />
                        <span>My Wishlist</span>
                        {wishlistCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                          >
                            {wishlistCount > 99 ? "99+" : wishlistCount}
                          </Badge>
                        )}
                      </Link>
                    </SheetClose>

                    {/* ✅ Cart in Mobile Menu with Real Count */}
                    <SheetClose asChild>
                      <Link
                        href="/cart"
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md relative"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>My Cart</span>
                        {cartItemsCount > 0 && (
                          <Badge
                            variant="default"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                          >
                            {cartItemsCount > 99 ? "99+" : cartItemsCount}
                          </Badge>
                        )}
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="/deals"
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                      >
                        <Badge variant="destructive">Hot</Badge>
                        <span>Today&apos;s Deals</span>
                      </Link>
                    </SheetClose>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo Desktop */}
            <Link
              href="/"
              className="text-2xl font-bold text-foreground flex-shrink-0"
            >
              zetu<span className="text-blue-600">Tech</span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                aria-label="Search"
                placeholder="Search laptops, desktops, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-24 rounded-full"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* ✅ Wishlist with Real Count */}
            <Link
              href="/wishlist"
              className="relative hidden md:flex items-center text-foreground hover:text-primary transition p-2 rounded-md hover:bg-muted"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* ✅ Cart Drawer - Replaces direct cart link */}
            <CartDrawer />

            {/* Account Menu */}
            {!session ? (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || <User size={16} />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">
                      {session.user?.name}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {session.user?.name || "User"}
                    <div className="text-xs text-muted-foreground capitalize">
                      {session.user?.role || "buyer"}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>

                  {/* ✅ Wishlist in Dropdown with Count */}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/wishlist"
                      className="flex justify-between items-center w-full"
                    >
                      <span>My Wishlist</span>
                      {wishlistCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 h-5 min-w-5 flex items-center justify-center text-xs"
                        >
                          {wishlistCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  {/* ✅ Cart in Dropdown with Real Count */}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/cart"
                      className="flex justify-between items-center w-full"
                    >
                      <span>My Cart</span>
                      {cartItemsCount > 0 && (
                        <Badge
                          variant="default"
                          className="ml-2 h-5 min-w-5 flex items-center justify-center text-xs"
                        >
                          {cartItemsCount > 99 ? "99+" : cartItemsCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account">Account Settings</Link>
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
                    onClick={handleSignOut}
                    className="text-destructive hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Desktop Product Types Navigation */}
        <div className="hidden md:flex justify-center space-x-6 mt-3">
          {PRODUCT_TYPES.map((type) => (
            <DropdownMenu key={type.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  {type.label}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {PRODUCT_CATEGORIES[
                  type.id as keyof typeof PRODUCT_CATEGORIES
                ]?.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link
                      href={`/products?type=${type.id}&category=${category}`}
                    >
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 rounded-full"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}