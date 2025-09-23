// app/products/page.tsx
import ProductsList from "@/components/ProductList";
import { PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import { Suspense } from "react";

interface SearchParams {
  productType?: string;
  category?: string;
  brand?: string;
  status?: string;
  stockStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  page?: string;
}

async function getProducts(searchParams: SearchParams) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  // Ensure we have an absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/products/product-list?${params.toString()}`,
    {
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ["products"],
      },
    }
  );

  if (!res.ok) {
    // Try to get error details from response
    let errorMessage = "Failed to fetch products";
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Ignore JSON parsing errors
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  const productType = resolvedSearchParams.productType || "all";
  const category = resolvedSearchParams.category || "all";

  const productTypeLabel =
    productType !== "all"
      ? PRODUCT_TYPES.find((t) => t.id === productType)?.label
      : "All Products";

  const title =
    category !== "all"
      ? `${category} ${productTypeLabel} | Tech Store`
      : `${productTypeLabel} | Tech Store`;

  const description =
    category !== "all"
      ? `Browse our selection of ${category} in ${productTypeLabel}. High-quality tech products at the best prices.`
      : `Discover our range of tech products including laptops, desktops, and accessories.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  const data = await getProducts(resolvedSearchParams);

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsList initialData={data} searchParams={resolvedSearchParams} />
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
            {/* Filters skeleton */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
            {/* Products skeleton */}
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