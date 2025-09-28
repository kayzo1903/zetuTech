// app/products/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { getProductDetails, getRelatedProducts } from "@/app/products/libs/servers/get-productsDeails";
import ProductDetail from "../components/productdetail";


interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  // Await the params first
  const resolvedParams = await params;
  const productId = resolvedParams.slug.at(-1)!;
  
  const productData = await getProductDetails(productId);

  if (!productData) {
    return {
      title: "Product Not Found",
      description: "This product does not exist or may have been removed.",
      openGraph: {
        title: "Product Not Found",
        description: "This product does not exist or may have been removed.",
        type: "website",
      },
    };
  }

  return {
    title: `${productData.name} | zetutech`,
    description: productData.shortDescription || productData.description,
    openGraph: {
      title: productData.name,
      description: productData.shortDescription || productData.description,
      images: productData.images?.length ? productData.images.slice(0, 1) : [],
      type: "website", // Changed from "product" to "website" to fix the OpenGraph error
    },
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  // Await the params first
  const resolvedParams = await params;
  const productId = resolvedParams.slug.at(-1)!;

  const productData = await getProductDetails(productId);
  if (!productData) notFound();

  const relatedProducts = await getRelatedProducts(
    productId,
    productData.productType,
    productData.categories,
    productData.brand
  );

  return (
    <main>
      <ProductDetail productData={productData} relatedProducts={relatedProducts} />
    </main>
  );
}