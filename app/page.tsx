import FeaturedProduct from "@/components/landing-page-components/featuredproduct";
import NewArrivals from "@/components/landing-page-components/newarrival";
import { getFeaturedProduct } from "@/lib/server/get-featuredProduct";
import { getNewArrivals } from "@/lib/server/get-newArrival";
import ZetutechHero from "@/components/zetuhero/zetutechhero";
import InfinityProducts from "@/components/landing-page-components/infinityProducts";
import { getInfinityProducts } from "@/lib/server/get-infinityProduct";

export default async function Home() {
  // ✅ Fetch initial data in parallel for better performance
  const [newArrivalProducts, featuredProduct, initialProducts] = await Promise.all([
    getNewArrivals(),
    getFeaturedProduct(),
    getInfinityProducts(0, 8) // ✅ Specify offset and limit
  ]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <main className="w-full">
        <ZetutechHero />
        <NewArrivals products={newArrivalProducts} />
        <FeaturedProduct featuredProduct={featuredProduct}/>
        <InfinityProducts initialProducts={initialProducts} />
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';