// lib/products.ts
import { dbServer } from "@/db/db-server";
import { product, productCategory, productImage, productReview } from "@/db/schema";
import { safeJsonParse } from "@/utils/parser";
import { sql} from "drizzle-orm";
import { Product } from "../validation-schemas/product-type";

export async function getProductDetails(productId: string): Promise<Product | null> {
  const result = await dbServer
    .select({
      product,
      categories: sql`
        COALESCE(
          json_agg(DISTINCT ${productCategory.category}) FILTER (WHERE ${productCategory.category} IS NOT NULL), 
          '[]'
        )
      `.as("categories"),
      images: sql`
        COALESCE(
          json_agg(DISTINCT ${productImage.url}) FILTER (WHERE ${productImage.url} IS NOT NULL), 
          '[]'
        )
      `.as("images"),
      averageRating: sql`COALESCE(AVG(${productReview.rating}), 0)`.as("averageRating"),
      reviewCount: sql`COUNT(DISTINCT ${productReview.id})`.as("reviewCount"),
    })
    .from(product)
    .leftJoin(productCategory, sql`${product.id} = ${productCategory.productId}`)
    .leftJoin(productImage, sql`${product.id} = ${productImage.productId}`)
    .leftJoin(productReview, sql`${product.id} = ${productReview.productId}`)
    .where(sql`${product.id} = ${productId} AND ${product.status} != 'Draft'`)
    .groupBy(product.id)
    .limit(1);

  if (result.length === 0) return null;

  const row = result[0];

  return {
  ...row.product,
  originalPrice: String(row.product.originalPrice),
  salePrice: row.product.salePrice !== null ? String(row.product.salePrice) : null,

  categories: safeJsonParse(row.categories, []),
  images: safeJsonParse(row.images, []),

  averageRating: parseFloat(row.averageRating as unknown as string) || 0,
  reviewCount: parseInt(row.reviewCount as unknown as string) || 0,

  // Fix: Convert Date to string
  createdAt: row.product.createdAt.toISOString(),
  updatedAt: row.product.updatedAt.toISOString(),
};

}

export async function getRelatedProducts(
  productId: string,
  productType: string,
  categories: string[],
  brand: string,
  limit = 4
): Promise<Product[]> {
  const whereConditions = [
    sql`${product.id} != ${productId}`,
    sql`${product.status} != 'Draft'`,
  ];

  if (productType) whereConditions.push(sql`${product.productType} = ${productType}`);
  if (brand) whereConditions.push(sql`${product.brand} = ${brand}`);

  if (categories.length > 0) {
    const categoryFilters = categories.map(cat =>
      sql`EXISTS (
        SELECT 1 FROM ${productCategory}
        WHERE ${productCategory.productId} = ${product.id}
        AND ${productCategory.category} = ${cat}
      )`
    );
    whereConditions.push(sql`(${sql.join(categoryFilters, sql` OR `)})`);
  }

  const results = await dbServer
    .select({
      product,
      categories: sql`
        COALESCE(
          json_agg(DISTINCT ${productCategory.category}) FILTER (WHERE ${productCategory.category} IS NOT NULL), 
          '[]'
        )
      `.as("categories"),
      images: sql`
        COALESCE(
          json_agg(DISTINCT ${productImage.url}) FILTER (WHERE ${productImage.url} IS NOT NULL), 
          '[]'
        )
      `.as("images"),
      averageRating: sql`COALESCE(AVG(${productReview.rating}), 0)`.as("averageRating"),
      reviewCount: sql`COUNT(DISTINCT ${productReview.id})`.as("reviewCount"),
    })
    .from(product)
    .leftJoin(productCategory, sql`${product.id} = ${productCategory.productId}`)
    .leftJoin(productImage, sql`${product.id} = ${productImage.productId}`)
    .leftJoin(productReview, sql`${product.id} = ${productReview.productId}`)
    .where(sql.join(whereConditions, sql` AND `))
    .groupBy(product.id)
    .orderBy(sql`RANDOM()`)
    .limit(limit);

  return results.map(row => ({
    ...row.product,
  originalPrice: String(row.product.originalPrice),
  salePrice: row.product.salePrice !== null ? String(row.product.salePrice) : null,

  categories: safeJsonParse(row.categories, []),
  images: safeJsonParse(row.images, []),

  averageRating: parseFloat(row.averageRating as unknown as string) || 0,
  reviewCount: parseInt(row.reviewCount as unknown as string) || 0,

  // Fix: Convert Date to string
  createdAt: row.product.createdAt.toISOString(),
  updatedAt: row.product.updatedAt.toISOString(),
  }));
}