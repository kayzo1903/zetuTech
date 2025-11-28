// app/api/search/route.ts
import { dbServer } from "@/db/db-server";
import { product, productCategory, productImage, searchQuery } from "@/db/schema";
import { getServerSession } from "@/lib/server-session";
import { ilike, or, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  try {
    // Get user session for analytics
    const session = await getServerSession()
    const userId = session?.user?.id || null;

    // Search for products
    const results = await dbServer
      .select({
        id: product.id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        productType: product.productType,
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        hasDiscount: product.hasDiscount,
        stock: product.stock,
        stockStatus: product.stockStatus,
        slug: product.slug,
        status: product.status,
        images: sql<string[]>`ARRAY_AGG(DISTINCT ${productImage.url})`,
        categories: sql<string[]>`ARRAY_AGG(DISTINCT ${productCategory.category})`,
      })
      .from(product)
      .leftJoin(productCategory, eq(productCategory.productId, product.id))
      .leftJoin(productImage, eq(productImage.productId, product.id))
      .where(
        or(
          ilike(product.name, `%${query}%`),
          ilike(product.description, `%${query}%`),
          ilike(product.brand, `%${query}%`),
          ilike(product.productType, `%${query}%`),
          ilike(productCategory.category, `%${query}%`)
        )
      )
      .groupBy(product.id)
      .limit(limit);

    const formattedResults = results.map(p => ({
      ...p,
      originalPrice: Number(p.originalPrice),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      images: p.images?.filter(Boolean) || [],
      categories: p.categories?.filter(Boolean) || [],
    }));

    // Record search query analytics (don't wait for this to complete)
    recordSearchQuery(query, formattedResults.length, userId).catch(console.error);

    return NextResponse.json({ products: formattedResults });
  } catch (error) {
    console.error("❌ Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Function to record search queries (runs in background)
async function recordSearchQuery(query: string, resultCount: number, userId: string | null) {
  try {
    // Check if we should record this search (avoid recording very short queries)
    if (query.length < 2) return;

    // Check for recent duplicate searches (within last 5 minutes) to avoid spam
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentDuplicate = await dbServer
      .select()
      .from(searchQuery)
      .where(
        sql`${searchQuery.query} = ${query} 
            AND ${searchQuery.userId} = ${userId} 
            AND ${searchQuery.createdAt} > ${fiveMinutesAgo.toISOString()}`
      )
      .limit(1);

    // If no recent duplicate, record the search
    if (recentDuplicate.length === 0) {
      await dbServer.insert(searchQuery).values({
        query,
        resultCount,
        userId,
        createdAt: new Date(),
      });

    }
  } catch (error) {
    console.error("❌ Failed to record search query:", error);
    // Don't throw error - we don't want search to fail because of analytics
  }
}