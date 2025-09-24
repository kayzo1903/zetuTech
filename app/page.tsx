import FeaturedProduct from "@/components/landing-page-components/featuredproduct";
import NewArrivals from "@/components/landing-page-components/newarrival";
import { getFeaturedProduct } from "@/lib/server/get-featuredProduct";
import { getNewArrivals } from "@/lib/server/get-newArrival";
import ZetutechHero from "@/components/zetuhero/zetutechhero";

export default async function Home() {
  // Fetch latest 4 products
  const newArrivalProducts = await getNewArrivals();
  const featuredProduct = await getFeaturedProduct();

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <main className="w-full">
        <ZetutechHero />
        <NewArrivals products={newArrivalProducts} />
        <FeaturedProduct featuredProduct={featuredProduct}/>
      </main>
    </div>
  );
}
