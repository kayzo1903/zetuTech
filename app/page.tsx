import FeaturedProduct from "@/components/featuredproduct";
import Header from "@/components/header";
import Hero from "@/components/hero";
import HowItWorks from "@/components/howitwork";
import NewArrivals from "@/components/newarrival";

import WhyBuy from "@/components/whybuy";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <main className="w-full">
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
        <Hero />
        <NewArrivals />
        <WhyBuy />
        <FeaturedProduct />
        <HowItWorks />
      </main>
    </div>
  );
}
