import { and, eq, sql, ilike } from "drizzle-orm";
import { dbServer } from "@/db/db-server";
import { product, productCategory, productImage } from "@/db/schema";
import { PRODUCT_TYPES, PRODUCT_CATEGORIES } from "@/lib/validation-schemas/product-type";

export async function getProducts(searchParams: Record<string, string>) {
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const limit = Math.min(100, parseInt(searchParams.limit || "12"));
  const offset = (page - 1) * limit;

  const conditions = [];

  // Product Type Filter
  if (searchParams.productType && searchParams.productType !== "all") {
    conditions.push(eq(product.productType, searchParams.productType));
  }

  // Category Filter
  if (searchParams.category && searchParams.category !== "all") {
    conditions.push(eq(productCategory.category, searchParams.category));
  }

  // Brand Filter
  if (searchParams.brand && searchParams.brand !== "all") {
    conditions.push(ilike(product.brand, `%${searchParams.brand}%`));
  }

  // Price Range Filter
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

  // Status Filters
  conditions.push(sql`${product.status} != 'Draft'`);
  conditions.push(sql`${product.stockStatus} != 'Archived'`);

  // Sorting
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
    // Main Product Query
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
        images: sql<string[]>`ARRAY_AGG(DISTINCT ${productImage.url})`,
        categories: sql<string[]>`ARRAY_AGG(DISTINCT ${productCategory.category})`,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
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

    // Total Count
    const countResult = await dbServer
      .select({ count: sql<number>`COUNT(DISTINCT ${product.id})` })
      .from(product)
      .leftJoin(productCategory, eq(productCategory.productId, product.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCount = Number(countResult[0]?.count || 0);

    // Available Brands
    const brandsResult = await dbServer
      .select({ brand: product.brand })
      .from(product)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(product.brand);

    const brands = brandsResult.map((r) => r.brand).filter(Boolean) as string[];

    return {
      products: products.map((p) => ({
        ...p,
        originalPrice: Number(p.originalPrice),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
      })),
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
