import { dbServer } from "@/db/db-server";
import { featuredProduct } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getProductDetails } from "./get-productsDeails";
import { Product } from "../types/product";

export async function getFeaturedProduct(): Promise<Product | null> {
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

    // ✅ Return the complete product object
    return productDetails;
    
  } catch (error) {
    console.error("Error fetching featured product:", error);
    return null;
  }
}