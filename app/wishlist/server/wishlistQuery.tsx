// app/wishlist/server/wishlistQuery.tsx
import { eq, and, desc, sql } from "drizzle-orm";
import { Product } from "@/lib/types/product";
import { dbServer } from "@/db/db-server";
import { product, productCategory, productImage, productReview, wishlist, wishlistItem } from "@/db/schema";

// Get user's wishlist
export async function getUserWishlist(userId: string) {
  try {
    const userWishlist = await dbServer
      .select()
      .from(wishlist)
      .where(eq(wishlist.userId, userId))
      .limit(1);

    return userWishlist[0] || null;
  } catch (error) {
    console.error("Error getting user wishlist:", error);
    return null;
  }
}

// Create wishlist for user
export async function createWishlist(userId: string, name: string = "My Wishlist") {
  try {
    const [newWishlist] = await dbServer
      .insert(wishlist)
      .values({
        userId,
        name,
        visibility: "private",
      })
      .returning();

    return newWishlist;
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return null;
  }
}

// Get wishlist items with product details
export async function getWishlistItems(wishlistId: string): Promise<Product[]> {
  try {
    const items = await dbServer
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
        averageRating: sql<number>`COALESCE((
          SELECT AVG(rating) 
          FROM ${productReview} 
          WHERE product_id = ${product.id}
        ), 0)`,
        reviewCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${productReview} 
          WHERE product_id = ${product.id}
        )`,
        createdAt: product.createdAt,
        warrantyPeriod: product.warrantyPeriod,
        warrantyDetails: product.warrantyDetails,
        sku: product.sku,
        hasWarranty: product.hasWarranty,
        // Get categories as array
        categories: sql<string[]>`(
          SELECT ARRAY_AGG(category) 
          FROM ${productCategory} 
          WHERE product_id = ${product.id}
        )`,
        // Get images as array
        images: sql<string[]>`(
          SELECT ARRAY_AGG(url) 
          FROM ${productImage} 
          WHERE product_id = ${product.id} 
          ORDER BY ${productImage.order} ASC
        )`,
        addedAt: wishlistItem.addedAt,
        priceAtAdd: wishlistItem.priceAtAdd,
      })
      .from(wishlistItem)
      .innerJoin(product, eq(wishlistItem.productId, product.id))
      .where(
        and(
          eq(wishlistItem.wishlistId, wishlistId),
          eq(wishlistItem.isActive, true)
        )
      )
      .orderBy(desc(wishlistItem.addedAt));

    // Convert decimal prices to numbers
     return items.map(item => ({
      ...item,
      originalPrice: Number(item.originalPrice),
      salePrice: item.salePrice ? Number(item.salePrice) : null,
      averageRating: Number(item.averageRating) || 0,
      reviewCount: Number(item.reviewCount) || 0,
      categories: item.categories || [],
      images: item.images || [],
      // Convert Date objects to ISO strings
      createdAt: item.createdAt.toISOString(),
      // Add optional fields with proper types
      updatedAt: item.addedAt.toISOString(), // Using addedAt as updatedAt fallback
      warrantyPeriod: item.warrantyPeriod ? Number(item.warrantyPeriod) : null,
      hasWarranty: item.hasWarranty ?? false,
    }));
  } catch (error) {
    console.error("Error getting wishlist items:", error);
    return [];
  }
}

// Add item to wishlist
export async function addToWishlist(wishlistId: string, productId: string) {
  try {
    // Check if item already exists in wishlist
    const existingItem = await dbServer
      .select()
      .from(wishlistItem)
      .where(
        and(
          eq(wishlistItem.wishlistId, wishlistId),
          eq(wishlistItem.productId, productId),
          eq(wishlistItem.isActive, true)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      return { success: true, message: "Item already in wishlist" };
    }

    // Get current product price
    const productData = await dbServer
      .select({
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
      })
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    const currentPrice = productData[0]?.salePrice || productData[0]?.originalPrice;

    // Add to wishlist
    const [newItem] = await dbServer
      .insert(wishlistItem)
      .values({
        wishlistId,
        productId,
        priceAtAdd: currentPrice,
        isActive: true,
      })
      .returning();

    return { success: true, data: newItem };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, error: "Failed to add item to wishlist" };
  }
}

// Remove item from wishlist
export async function removeFromWishlist(wishlistId: string, productId: string) {
  try {
    await dbServer
      .update(wishlistItem)
      .set({ isActive: false })
      .where(
        and(
          eq(wishlistItem.wishlistId, wishlistId),
          eq(wishlistItem.productId, productId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { success: false, error: "Failed to remove item from wishlist" };
  }
}

// Check if product is in wishlist
export async function isInWishlist(wishlistId: string, productId: string): Promise<boolean> {
  try {
    const result = await dbServer
      .select()
      .from(wishlistItem)
      .where(
        and(
          eq(wishlistItem.wishlistId, wishlistId),
          eq(wishlistItem.productId, productId),
          eq(wishlistItem.isActive, true)
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
}