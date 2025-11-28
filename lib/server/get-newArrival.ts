// lib/server/get-newArrival.ts

import { desc, inArray } from "drizzle-orm";
import { dbServer } from "@/db/db-server";
import { product, productImage } from "@/db/schema";
import { Product } from "../types/product";

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
        // Add other fields you might need
        warrantyPeriod: product.warrantyPeriod,
        warrantyDetails: product.warrantyDetails,
        sku: product.sku,
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

    // ✅ FIXED: Map data to match the Product interface with proper type conversion
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription ?? undefined,
      brand: p.brand,
      productType: p.productType,
      // ✅ Convert string prices to numbers
      originalPrice: Number(p.originalPrice),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      hasDiscount: p.hasDiscount,
      stock: p.stock,
      stockStatus: p.stockStatus,
      status: p.status,
      slug: p.slug,
      // ✅ Convert Date to string
      createdAt: p.createdAt.toISOString(),
      // ✅ Add default values for optional fields
      averageRating: 4.5,
      reviewCount: 0,
      categories: [],
      images: images
        .filter((img) => img.productId === p.id)
        .map((img) => img.url),
      // ✅ Add other required fields with defaults
      updatedAt: p.createdAt.toISOString(), // Use createdAt if updatedAt not available
      warrantyPeriod: p.warrantyPeriod ?? null,
      warrantyDetails: p.warrantyDetails ?? null,
      sku: p.sku ?? null,
      hasWarranty: !!p.warrantyPeriod, // Set hasWarranty based on warrantyPeriod
    }));
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}