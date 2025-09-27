// app/products/page.tsx
import { Suspense } from "react";
import { PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import { getProducts } from "@/lib/server/getProduct";
import ProductsList from "@/components/products/ProductList";


// Define SearchParams with Record utility
type SearchParams = Record<string, string | undefined> & {
  productType?: string;
  category?: string;
  brand?: string;
  status?: string;
  stockStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams;
  const productType = resolved.productType || "all";
  const category = resolved.category || "all";

  const productTypeLabel = productType !== "all"
    ? PRODUCT_TYPES.find((t) => t.id === productType)?.label
    : "All Products";

  const title = category !== "all"
    ? `${category} ${productTypeLabel} | Tech Store`
    : `${productTypeLabel} | zetutech`;

  const description = category !== "all"
    ? `Browse our selection of ${category} in ${productTypeLabel}.`
    : `Discover our range of tech products including laptops, desktops, and accessories.`;

  return { title, description, openGraph: { title, description, type: "website" } };
}



export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams;
  const data = await getProducts(resolved);

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsList initialData={data} searchParams={resolved} />
    </Suspense>
  );
}

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-300 rounded"></div>)}
            </div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
