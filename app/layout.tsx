import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import TanStackProviders from "@/lib/tanStackprovider";
import { Toaster } from "@/components/ui/sonner";
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
    default: "zetuTech — AI Innovation Agency",
    template: "%s | zetuTech",
  },

  description:
    "zetuTech is Tanzania's premier AI integration and web application development agency.",

  keywords: [
    "zetuTech",
    "AI agency Tanzania",
    "web development Dar es Salaam",
    "software engineering",
    "tech innovation",
  ],

  alternates: {
    canonical: "https://zetutech.co.tz",
  },

  openGraph: {
    title: "zetuTech — AI Innovation Agency",
    description:
      "Transforming businesses through intelligent logic and high-performance web platforms.",
    url: "https://zetutech.co.tz",
    siteName: "zetuTech",
    images: [
      {
        url: "/images/kilimanjaro.jpg",
        width: 1200,
        height: 630,
        alt: "zetuTech Innovation Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "zetuTech — AI Innovation Agency",
    description:
      "Tanzania's premier AI integration and web application development agency.",
    images: ["/images/kilimanjaro.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "zetuTech",
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
    // JSON-LD Structured Data for AI Tech Agency
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "zetuTech",
      url: "https://zetutech.co.tz",
      logo: "https://zetutech.co.tz/apple-touch-icon.png",
      description: "Tanzania's premier AI integration and web application development agency.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Magomeni kanisani",
        addressLocality: "Dar es Salaam",
        addressCountry: "TZ"
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+255797465431",
        contactType: "customer service"
      }
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
          <TanStackProviders>
            {/* Client-side Header */}
            <ClientHeader session={session} isAdmin={isAdmin} />

            {/* ✔ Recommended Semantic Structure */}
            <main className="min-h-[70vh]">{children}</main>
          </TanStackProviders>

          <Footer />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
