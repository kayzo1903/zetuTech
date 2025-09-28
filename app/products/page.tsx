// app/products/page.tsx
import { Suspense } from "react";
import { PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import { getProducts } from "@/app/products/libs/servers/getProduct";
import ProductsLoading from "./components/productListLoading";
import ProductsList from "./components/ProductList";


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


