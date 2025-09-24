import FeaturedProduct from "@/components/featuredproduct";
import Hero from "@/components/hero";
import HowItWorks from "@/components/howitwork";
import NewArrivals from "@/components/newarrival";
import WhyBuy from "@/components/whybuy";
import { getNewArrivals } from "@/lib/server/get-newArrival";




export default async function Home() {
  // Fetch latest 4 products
  const newArrivalProducts = await getNewArrivals();

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <main className="w-full">
        <Hero />
        <NewArrivals products={newArrivalProducts} />
        <WhyBuy />
        <FeaturedProduct />
        <HowItWorks />
      </main>
    </div>
  );
}
