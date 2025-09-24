import FeaturedProduct from "@/components/landing-page-components/featuredproduct";
import Hero from "@/components/hero/hero";
import NewArrivals from "@/components/landing-page-components/newarrival";
import { getFeaturedProduct } from "@/lib/server/get-featuredProduct";
import { getNewArrivals } from "@/lib/server/get-newArrival";

export default async function Home() {
  // Fetch latest 4 products
  const newArrivalProducts = await getNewArrivals();
  // Fetch featured product
  const featuredProduct = await getFeaturedProduct();

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <main className="w-full">
        <Hero />
        <NewArrivals products={newArrivalProducts} />
        <FeaturedProduct featuredProduct={featuredProduct}/>
      </main>
    </div>
  );
}
