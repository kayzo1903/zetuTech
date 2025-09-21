import FeaturedProduct from "@/components/featuredproduct";
import Hero from "@/components/hero";
import HowItWorks from "@/components/howitwork";
import NewArrivals from "@/components/newarrival";
import ServerHeader from "@/components/server-header";
import WhyBuy from "@/components/whybuy";

export default function Home() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <main className="w-full">
        <ServerHeader />
        <Hero />
        <NewArrivals />
        <WhyBuy />
        <FeaturedProduct />
        <HowItWorks />
      </main>
    </div>
  );
}
