// lib/server/getProducts.ts
import { and, eq, sql } from "drizzle-orm";
import { dbServer } from "@/db/db-server";
import { product, productCategory, productImage } from "@/db/schema";
import { PRODUCT_TYPES, PRODUCT_CATEGORIES } from "@/lib/validation-schemas/product-type";
import { Product } from "../types/product";

export interface SearchParams {
  productType?: string;
  category?: string;
  brand?: string;
  status?: string;
  stockStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
}

export async function getProducts(searchParams: SearchParams) {
  
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const limit = Math.min(100, parseInt(searchParams.limit || "12"));
  const offset = (page - 1) * limit;

  const conditions = [];

  // Product type filter
  if (searchParams.productType && searchParams.productType !== "all") {
    conditions.push(eq(product.productType, searchParams.productType));
  }

  // Category filter
  if (searchParams.category && searchParams.category !== "all") {
    conditions.push(eq(productCategory.category, searchParams.category));
  }

  // Price range
  if (searchParams.minPrice) {
    conditions.push(
      sql`COALESCE(${product.salePrice}, ${product.originalPrice}) >= ${parseFloat(searchParams.minPrice)}`
    );
  }
  if (searchParams.maxPrice) {
    conditions.push(
      sql`COALESCE(${product.salePrice}, ${product.originalPrice}) <= ${parseFloat(searchParams.maxPrice)}`
    );
  }

  // Ensure only active + in-stock products
  conditions.push(sql`${product.status} != 'Draft'`);
  conditions.push(sql`${product.stockStatus} != 'Archived'`);

  // Order by
  let orderBy;
  switch (searchParams.sortBy) {
    case "price-low":
      orderBy = sql`COALESCE(${product.salePrice}, ${product.originalPrice}) ASC`;
      break;
    case "price-high":
      orderBy = sql`COALESCE(${product.salePrice}, ${product.originalPrice}) DESC`;
      break;
    case "name":
      orderBy = product.name;
      break;
    default:
      orderBy = sql`${product.createdAt} DESC`;
  }

  try {
    // Main query
    const productsQuery = dbServer
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
        hasWarranty: product.hasWarranty,
        warrantyPeriod: product.warrantyPeriod,
        warrantyDetails: product.warrantyDetails,
        updatedAt: product.updatedAt,
        images: sql<string[]>`ARRAY_AGG(DISTINCT ${productImage.url})`,
        categories: sql<string[]>`ARRAY_AGG(DISTINCT ${productCategory.category})`,
        createdAt: product.createdAt,
      })
      .from(product)
      .leftJoin(productImage, eq(productImage.productId, product.id))
      .leftJoin(productCategory, eq(productCategory.productId, product.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(product.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const products = await productsQuery;

    // Total count
    const countResult = await dbServer
      .select({ count: sql<number>`COUNT(DISTINCT ${product.id})` })
      .from(product)
      .leftJoin(productCategory, eq(productCategory.productId, product.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCount = Number(countResult[0]?.count || 0);

    // Available brands
    const brandsResult = await dbServer
      .select({ brand: product.brand })
      .from(product)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(product.brand);

    const brands = brandsResult.map(r => r.brand).filter(Boolean) as string[];

        // ✅ Convert prices from string to number
    const convertedProducts: Product[] = products.map(product => ({
      ...product,
      originalPrice: Number(product.originalPrice), // Convert string to number
      salePrice: product.salePrice ? Number(product.salePrice) : null, // Convert string to number or null
      createdAt: product.createdAt.toISOString(), // Convert Date to string
      updatedAt: product.updatedAt?.toISOString(), // Convert Date to string
      // Ensure other fields match your Product type
    }));
    
    return {
      products: convertedProducts,
      filters: {
        brands,
        productTypes: PRODUCT_TYPES,
        categories: PRODUCT_CATEGORIES,
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    };

  } catch (error) {
    console.error("❌ getProducts error:", error);
    return {
      products: [],
      filters: {
        brands: [],
        productTypes: PRODUCT_TYPES,
        categories: PRODUCT_CATEGORIES,
      },
      pagination: {
        page: 1,
        limit,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}