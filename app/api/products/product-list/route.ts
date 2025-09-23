// app/api/products/product-list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql, SQL } from "drizzle-orm";
import { product, productCategory, productImage } from "@/db/schema";
import { dbServer } from "@/db/db-server";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
} from "@/lib/validation-schemas/product-type";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const productType = searchParams.get("productType");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const stockStatus = searchParams.get("stockStatus");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "newest";

    const offset = (page - 1) * limit;

    // Build dynamic WHERE conditions
    const whereConditions: SQL[] = [];

    // Product Type filter
    if (productType && productType !== "all") {
      whereConditions.push(sql`${product.productType} = ${productType}`);
    }

    // Category filter
    if (category && category !== "all") {
      whereConditions.push(sql`EXISTS (
        SELECT 1 FROM ${productCategory} 
        WHERE ${productCategory.productId} = ${product.id} 
        AND ${productCategory.category} = ${category}
      )`);
    }

    // Status filter
    if (status && status !== "all") {
      whereConditions.push(sql`${product.status} = ${status}`);
    }

    // Stock Status filter
    if (stockStatus && stockStatus !== "all") {
      whereConditions.push(sql`${product.stockStatus} = ${stockStatus}`);
    }

    // Brand filter
    if (brand && brand !== "all") {
      whereConditions.push(sql`${product.brand} = ${brand}`);
    }

    // Price range filter
    if (minPrice) {
      whereConditions.push(sql`${product.salePrice} >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice) {
      whereConditions.push(sql`${product.salePrice} <= ${parseFloat(maxPrice)}`);
    }

    // Only show active products
    whereConditions.push(sql`${product.status} != 'Draft'`);

    // Build ORDER BY clause
    let orderByClause;
    switch (sortBy) {
      case "price-low":
        orderByClause = sql`${product.salePrice} ASC`;
        break;
      case "price-high":
        orderByClause = sql`${product.salePrice} DESC`;
        break;
      case "name":
        orderByClause = sql`${product.name} ASC`;
        break;
      default: // newest
        orderByClause = sql`${product.createdAt} DESC`;
    }

    // Fetch products with filters applied
    const productsResult = await dbServer
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
        sku: product.sku,
        createdAt: product.createdAt,
        categories: sql`COALESCE(json_agg(DISTINCT ${productCategory.category}) FILTER (WHERE ${productCategory.category} IS NOT NULL), '[]')`.as("categories"),
        images: sql`COALESCE(json_agg(DISTINCT ${productImage.url}) FILTER (WHERE ${productImage.url} IS NOT NULL), '[]')`.as("images"),
      })
      .from(product)
      .leftJoin(
        productCategory,
        sql`${product.id} = ${productCategory.productId}`
      )
      .leftJoin(productImage, sql`${product.id} = ${productImage.productId}`)
      .where(
        whereConditions.length > 0
          ? sql`${sql.join(whereConditions, sql` AND `)}`
          : undefined
      )
      .groupBy(
        product.id,
        product.name,
        product.description,
        product.shortDescription,
        product.brand,
        product.productType,
        product.originalPrice,
        product.salePrice,
        product.hasDiscount,
        product.stock,
        product.stockStatus,
        product.status,
        product.slug,
        product.sku,
        product.createdAt
      )
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Format response - safely parse JSON arrays
    const formattedProducts = productsResult.map((row) => {
      let categories: string[] = [];
      let images: string[] = [];
      
      try {
        categories = typeof row.categories === 'string' 
          ? JSON.parse(row.categories) 
          : Array.isArray(row.categories) 
            ? row.categories 
            : [];
      } catch {
        categories = [];
      }
      
      try {
        images = typeof row.images === 'string' 
          ? JSON.parse(row.images) 
          : Array.isArray(row.images) 
            ? row.images 
            : [];
      } catch {
        images = [];
      }

      return {
        id: row.id,
        name: row.name,
        description: row.description,
        shortDescription: row.shortDescription,
        brand: row.brand,
        productType: row.productType,
        originalPrice: row.originalPrice,
        salePrice: row.salePrice,
        hasDiscount: row.hasDiscount,
        stock: row.stock,
        stockStatus: row.stockStatus,
        status: row.status,
        slug: row.slug,
        categories: categories,
        images: images,
        createdAt: row.createdAt,
      };
    });

    // Get total count for pagination
    const countResult = await dbServer
      .select({ count: sql<number>`COUNT(DISTINCT ${product.id})` })
      .from(product)
      .leftJoin(
        productCategory,
        sql`${product.id} = ${productCategory.productId}`
      )
      .where(
        whereConditions.length > 0
          ? sql`${sql.join(whereConditions, sql` AND `)}`
          : undefined
      );

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Get available filters for current results
    const brandsResult = await dbServer
      .select({ brand: product.brand })
      .from(product)
      .where(
        whereConditions.length > 0
          ? sql`${sql.join(whereConditions, sql` AND `)}`
          : undefined
      )
      .groupBy(product.brand);

    const availableBrands = brandsResult.map((row) => row.brand).filter(Boolean);

    return NextResponse.json({
      products: formattedProducts,
      filters: {
        brands: availableBrands,
        productTypes: PRODUCT_TYPES,
        categories: PRODUCT_CATEGORIES,
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}