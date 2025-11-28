// app/wishlist/server/wishlistQuery.tsx
import { eq, and, desc, sql } from "drizzle-orm";
import { dbServer } from "@/db/db-server";
import { product, wishlist, wishlistItem } from "@/db/schema";

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
export async function getWishlistItems(wishlistId: string) {
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
          FROM product_review
          WHERE product_id = ${product.id}
        ), 0)`,
        reviewCount: sql<number>`(
          SELECT COUNT(*)
          FROM product_review
          WHERE product_id = ${product.id}
        )`,
        createdAt: product.createdAt,
        warrantyPeriod: product.warrantyPeriod,
        warrantyDetails: product.warrantyDetails,
        sku: product.sku,
        hasWarranty: product.hasWarranty,
        categories: sql<string[]>`(
          SELECT ARRAY_AGG(category)
          FROM product_category
          WHERE product_id = ${product.id}
        )`,
        images: sql<string[]>`(
          SELECT ARRAY_AGG(url ORDER BY "product_image"."order" ASC)
          FROM product_image
          WHERE product_id = ${product.id}
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

    return items;
  } catch (error) {
    console.error("Error getting wishlist items:", error);
    throw error;
  }
}


// Add item to wishlist
// app/wishlist/server/wishlistQuery.ts
export async function addToWishlist(wishlistId: string, productId: string) {
  try {
    // Get current product price
    const productData = await dbServer
      .select({
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
      })
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (!productData.length) {
      return { success: false, error: "Product not found" };
    }

    const currentPrice = productData[0].salePrice || productData[0].originalPrice;

    // Check if item already exists in wishlist
    const existing = await dbServer
      .select()
      .from(wishlistItem)
      .where(
        and(
          eq(wishlistItem.wishlistId, wishlistId),
          eq(wishlistItem.productId, productId)
        )
      );

    if (existing.length > 0) {
      // ✅ Reactivate instead of inserting a duplicate
      await dbServer
        .update(wishlistItem)
        .set({
          isActive: true,
          addedAt: new Date(),
          priceAtAdd: currentPrice, // optional: update with latest price
        })
        .where(eq(wishlistItem.id, existing[0].id));

      return { success: true, message: "Item reactivated in wishlist" };
    }

    // Insert a brand new item if none exists
    await dbServer.insert(wishlistItem).values({
      wishlistId,
      productId,
      priceAtAdd: currentPrice,
      isActive: true,
    });

    return { success: true, message: "Item added to wishlist" };
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