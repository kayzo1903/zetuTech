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

// ✅ Full SEO Optimization
export const metadata: Metadata = {
  metadataBase: new URL("https://zetutech.co.tz"),

  title: {
    default: "ZetuTech — Tech Gadgets, Laptops & Accessories",
    template: "%s | ZetuTech",
  },

  description:
    "ZetuTech is Tanzania’s trusted online store for high-quality laptops, phones, accessories, and tech gadgets.",

  keywords: [
    "ZetuTech",
    "tech gadgets Tanzania",
    "laptops Tanzania",
    "electronics shop",
    "computer accessories",
    "online store Tanzania",
  ],

  alternates: {
    canonical: "https://zetutech.co.tz",
  },

  openGraph: {
    title: "ZetuTech — Tech Gadgets & Laptops",
    description:
      "Shop laptops, phones, computer accessories and premium tech gadgets at ZetuTech Tanzania.",
    url: "https://zetutech.co.tz",
    siteName: "ZetuTech",
    images: [
      {
        url: "/https://unsplash.com/photos/black-sony-wireless-headphones-on-black-computer-keyboard-gz9njd0zYbQ",
        width: 1200,
        height: 630,
        alt: "ZetuTech Online Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ZetuTech — Tech Gadgets & Laptops",
    description:
      "Tanzania's top online store for laptops, phones, and tech gadgets.",
    images: ["/https://unsplash.com/photos/black-sony-wireless-headphones-on-black-computer-keyboard-gz9njd0zYbQ"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  other: {
    // JSON-LD Structured Data
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ZetuTech",
      url: "https://zetutech.co.tz",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://zetutech.co.tz/search?query={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }),
  },
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WishlistProvider>
            <TanStackProviders>
              <CartProvider>
                {/* Client-side Header */}
                <ClientHeader session={session} isAdmin={isAdmin} />

                {/* ✔ Recommended Semantic Structure */}
                <main className="min-h-[70vh]">{children}</main>
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
