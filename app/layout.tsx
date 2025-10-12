import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import TanStackProviders from "@/lib/tanStackprovider";
import WishlistProvider from "./wishlist/provider/wishlistProvider";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/provider/cart-provider";
import { getServerSession } from "@/lib/server-session";
import ClientHeader from "@/components/clientHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "zetuTech",
  description: "online store for selling tech gadgets and laptops",
};


export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, isAdmin } = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WishlistProvider>
            <TanStackProviders>
              <CartProvider>
                {/* ✅ Header now controlled client-side */}
                <ClientHeader session={session} isAdmin={isAdmin} />
                {children}
              </CartProvider>
            </TanStackProviders>
          </WishlistProvider>
          <Footer />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}


