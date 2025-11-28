// lib/server/get-infinityProducts.ts
import { dbServer } from "@/db/db-server";
import { product, productImage } from "@/db/schema";
import { inArray ,desc } from "drizzle-orm";
import { Product } from "../types/product";

export async function getInfinityProducts(
  offset = 0,
  limit = 12
): Promise<Product[]> { // ✅ Change return type to ProductType[]
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
      description: p.description,
      shortDescription: p.shortDescription,
      brand: p.brand,
      productType: p.productType,
      originalPrice: Number(p.originalPrice), // Convert to number
      salePrice: p.salePrice ? Number(p.salePrice) : null, // Convert to number or null
      hasDiscount: p.hasDiscount,
      stock: p.stock,
      stockStatus: p.stockStatus,
      status: p.status,
      slug: p.slug,
      categories: [], // You'll need to fetch categories separately
      images: images
        .filter((img) => img.productId === p.id)
        .map((img) => img.url),
      averageRating: 4.5, // Default or fetch from DB
      reviewCount: 0, // Default or fetch from DB
      createdAt: p.createdAt.toISOString(), // ✅ Convert Date to string
      updatedAt: p.createdAt.toISOString(), // Use createdAt if updatedAt doesn't exist
      // Add other fields with defaults or fetch them
    }));
  } catch (error) {
    console.error("Error fetching infinity products:", error);
    return [];
  }
}