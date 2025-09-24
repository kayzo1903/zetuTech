// lib/server/get-newArrival.ts

import { desc, inArray } from "drizzle-orm";
import { Product } from "@/lib/types/product";
import { dbServer } from "@/db/db-server";
import { product, productImage } from "@/db/schema";

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  try {
    // Fetch the latest products
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
      .limit(limit);

    if (rows.length === 0) return [];

    // Fetch images for these products
    const productIds = rows.map((p) => p.id);

    const images = await dbServer
      .select({
        productId: productImage.productId,
        url: productImage.url,
      })
      .from(productImage)
      .where(inArray(productImage.productId, productIds));

    // Map data to match the Product interface
    return rows.map((p) => ({
      ...p,
      shortDescription: p.shortDescription ?? undefined,
      salePrice: p.salePrice ?? p.originalPrice, // Use originalPrice as fallback
      createdAt: p.createdAt.toISOString(),

      images: images
        .filter((img) => img.productId === p.id)
        .map((img) => img.url),

      categories: [],
    }));
    
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}
