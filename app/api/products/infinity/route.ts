import { dbServer } from "@/db/db-server";
import { product } from "@/db/schema";
import { getInfinityProducts } from "@/lib/server/get-infinityProduct";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// app/api/products/infinity/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  try {
    const products = await getInfinityProducts(offset, limit);
    
    // ✅ More explicit total count query
    const totalCountResult = await dbServer.execute(
      sql`SELECT COUNT(*) as total_count FROM ${product}`
    );
    
    // ✅ Handle different database response formats
    let totalCount = 0;
    if (Array.isArray(totalCountResult) && totalCountResult[0]) {
      totalCount = Number(totalCountResult[0].total_count || totalCountResult[0].count || 0);
    } else if (totalCountResult.rows && totalCountResult.rows[0]) {
      totalCount = Number(totalCountResult.rows[0].total_count || 0);
    }
    
    // ✅ Explicit number conversion for safety
    const currentOffset = Number(offset);
    const productsLength = Number(products.length);
    const totalCountNum = Number(totalCount);
    
    const hasMore = currentOffset + productsLength < totalCountNum;

    return NextResponse.json({
      products,
      hasMore,
      nextOffset: hasMore ? currentOffset + limit : undefined,
    });
  } catch (error) {
    console.error("Error in infinity products API:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" }, 
      { status: 500 }
    );
  }
}