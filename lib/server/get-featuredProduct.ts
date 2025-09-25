import { dbServer } from "@/db/db-server";
import { featuredProduct } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getProductDetails } from "./get-productsDeails";

export interface FeaturedProductTypes {
  id: string;
  name: string;
  slug: string;
  description: string;
  originalPrice: string;
  salePrice: string | null;
  hasDiscount: boolean;
  stock: number;
  stockStatus: string;
  images: string[];
  categories: string[];
  averageRating: number;
  reviewCount: number;
}

export async function getFeaturedProduct(): Promise<FeaturedProductTypes | null> {
  try {
    // Get the active featured product
    const featured = await dbServer
      .select({
        productId: featuredProduct.productId,
        featuredAt: featuredProduct.createdAt,
      })
      .from(featuredProduct)
      .where(eq(featuredProduct.status, "active"))
      .limit(1);

    if (featured.length === 0) {
      return null; // No featured product
    }

    const { productId } = featured[0];

    // Use your existing function to get full product details
    const productDetails = await getProductDetails(productId);

    if (!productDetails) {
      return null; // Product not found or is draft
    }

    // Transform to the format needed by your FeaturedProduct component
    return {
      id: productDetails.id,
      name: productDetails.name,
      slug: productDetails.slug,
      description: productDetails.description,
      originalPrice: productDetails.originalPrice,
      salePrice: productDetails.salePrice,
      hasDiscount: productDetails.hasDiscount,
      stock: productDetails.stock,
      stockStatus: productDetails.stockStatus,
      images: productDetails.images,
      categories: productDetails.categories,
      averageRating: productDetails.averageRating,
      reviewCount: productDetails.reviewCount,
    };
  } catch (error) {
    console.error("Error fetching featured product:", error);
    return null;
  }
}