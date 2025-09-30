import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import TanStackProviders from "@/lib/tanStackprovider";
import WishlistProvider from "./wishlist/provider/wishlistProvider";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAdmin = session?.user?.role === "admin";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header
            session={
              session
                ? {
                    user: session.user
                      ? {
                          name: session.user.name,
                          image: session.user.image ?? undefined,
                          role: session.user.role ?? undefined,
                        }
                      : undefined,
                  }
                : null
            }
            isAdmin={isAdmin}
          />
          <WishlistProvider>
            <TanStackProviders>{children}</TanStackProviders>
          </WishlistProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
