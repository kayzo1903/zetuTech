import FeaturedProduct from "@/components/landing-page-components/featuredproduct";
import NewArrivals from "@/components/landing-page-components/newarrival";
import { getFeaturedProduct } from "@/lib/server/get-featuredProduct";
import { getNewArrivals } from "@/lib/server/get-newArrival";
import ZetutechHero from "@/components/zetuhero/zetutechhero";
import InfinityProducts from "@/components/landing-page-components/infinityProduct";
import { getInfinityProducts } from "@/lib/server/get-infinityProduct";

export default async function Home() {
  // Fetch latest 4 products
  const newArrivalProducts = await getNewArrivals();
  const featuredProduct = await getFeaturedProduct();
  const initialProducts = await getInfinityProducts();

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <main className="w-full">
        <ZetutechHero />
        <NewArrivals products={newArrivalProducts} />
        <FeaturedProduct featuredProduct={featuredProduct}/>
        <InfinityProducts initialProducts={initialProducts} />;
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';