// lib/server/get-infinityProducts.ts
import { ProductType } from "@/components/cards/productcards";
import { dbServer } from "@/db/db-server";
import { product, productImage } from "@/db/schema";
import { inArray ,desc } from "drizzle-orm";

export async function getInfinityProducts(
  offset = 0,
  limit = 12
): Promise<ProductType[]> { // ✅ Change return type to ProductType[]
  try {
    const rows = await dbServer
      .select({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        brand: product.brand,
        productType: product.productType,
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        hasDiscount: product.hasDiscount,
        stock: product.stock,
        stockStatus: product.stockStatus,
        status: product.status,
        slug: product.slug,
        createdAt: product.createdAt,
      })
      .from(product)
      .orderBy(desc(product.createdAt))
      .limit(limit)
      .offset(offset);

    if (rows.length === 0) return [];

    const productIds = rows.map((p) => p.id);
    const images = await dbServer
      .select({
        productId: productImage.productId,
        url: productImage.url,
      })
      .from(productImage)
      .where(inArray(productImage.productId, productIds));

    // ✅ Convert to ProductType with proper number types
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      images: images
        .filter((img) => img.productId === p.id)
        .map((img) => img.url),
      originalPrice: Number(p.originalPrice), // ✅ Convert string to number
      salePrice: p.salePrice ? Number(p.salePrice) : undefined, // ✅ Convert and make optional
      hasDiscount: p.hasDiscount,
      averageRating: 4.5, // ✅ Add default rating
      stock: p.stock,
      // Add any other required ProductType fields
    }));
  } catch (error) {
    console.error("Error fetching infinity products:", error);
    return [];
  }
}