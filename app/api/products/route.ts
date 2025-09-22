// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/validation-schemas/products-schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadImageToStorage } from "@/lib/storage";

import { product, productCategory, productImage, productAttribute } from "@/db/schema";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbServer } from "@/db/db-server";
import { STOCK_STATUS } from "@/lib/validation-schemas/products-schema";
import { slugify } from "@/lib/slugify";
import { generateUniqueSKU } from "@/lib/sku-generator";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role (only Admin should be able to create products)
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can create products" },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();

    // Extract form data
    const productType = formData.get("productType") as string;
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const stock = parseInt(formData.get("stock") as string);
    const stockStatus = formData.get("stockStatus") as string || STOCK_STATUS[2]; // Default to "In Stock"
    const categories = JSON.parse(
      formData.get("categories") as string
    ) as string[];
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;
    const shortDescription = formData.get("shortDescription") as string || "";
    const hasDiscount = formData.get("hasDiscount") === "true";
    const originalPrice = parseFloat(formData.get("originalPrice") as string);
    const salePrice = hasDiscount
      ? parseFloat(formData.get("salePrice") as string)
      : undefined;
    const hasWarranty = formData.get("hasWarranty") === "true";
    const warrantyPeriod = hasWarranty
      ? (formData.get("warrantyPeriod") as string)
      : undefined;
    const warrantyDetails = hasWarranty
      ? (formData.get("warrantyDetails") as string)
      : undefined;
    
    // Extract SEO fields
    const slug = formData.get("slug") as string || slugify(name);
    const metaTitle = formData.get("metaTitle") as string || name;
    const metaDescription = formData.get("metaDescription") as string || 
      (shortDescription || description.substring(0, 160));
    const keywords = formData.get("keywords") as string || "";
    const sku = formData.get("sku") as string || generateUniqueSKU();
    const upc = formData.get("upc") as string || "";
    
    // Extract attributes if provided
    const attributes = formData.get("attributes") 
      ? JSON.parse(formData.get("attributes") as string) 
      : [];

    // Get image files
    const imageFiles = formData.getAll("images") as File[];

    // Validate the data
    const validatedData = productSchema.parse({
      productType,
      name,
      brand,
      stock,
      stockStatus,
      categories,
      status,
      description,
      images: imageFiles,
      hasDiscount,
      originalPrice,
      salePrice,
      hasWarranty,
      warrantyPeriod,
      warrantyDetails,
    });

    // Upload images to storage and get URLs
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const url = await uploadImageToStorage(
          file,
          `products/${Date.now()}-${file.name}`
        );
        return url;
      })
    );

    // Generate UUID for the product
    const productId = uuidv4();

    // Start a transaction to create product and related records
    const newProduct = await dbServer.transaction(async (tx) => {
      // Create the product with explicit UUID
      const [productResult] = await tx
        .insert(product)
        .values({
          id: productId, // Explicitly set UUID
          name: validatedData.name,
          description: validatedData.description,
          shortDescription: shortDescription,
          brand: validatedData.brand,
          productType: validatedData.productType,
          status: validatedData.status,
          stockStatus: stockStatus,
          originalPrice: validatedData.originalPrice.toString(),
          salePrice: validatedData.salePrice?.toString(),
          hasDiscount: validatedData.hasDiscount,
          stock: validatedData.stock,
          hasWarranty: validatedData.hasWarranty,
          warrantyPeriod: validatedData.warrantyPeriod
            ? parseInt(validatedData.warrantyPeriod)
            : null,
          warrantyDetails: validatedData.warrantyDetails,
          // SEO fields
          slug: slug,
          metaTitle: metaTitle,
          metaDescription: metaDescription,
          keywords: keywords,
          sku: sku,
          upc: upc,
          userId: session.user.id,
        })
        .returning();

      // Add categories with UUIDs
      if (validatedData.categories.length > 0) {
        await tx.insert(productCategory).values(
          validatedData.categories.map((category) => ({
            id: uuidv4(), // Generate UUID for each category
            productId: productResult.id,
            category,
            slug: slugify(category),
          }))
        );
      }

      // Add images with UUIDs
      if (imageUrls.length > 0) {
        await tx.insert(productImage).values(
          imageUrls.map((url, index) => ({
            id: uuidv4(), // Generate UUID for each image
            productId: productResult.id,
            url,
            alt: `${validatedData.name} - Image ${index + 1}`,
            title: `${validatedData.name} - Image ${index + 1}`,
            order: index,
          }))
        );
      }

      // Add attributes with UUIDs if provided
      if (attributes.length > 0) {
        await tx.insert(productAttribute).values(
          attributes.map((attr: { name: string; value: string }) => ({
            id: uuidv4(), // Generate UUID for each attribute
            productId: productResult.id,
            name: attr.name,
            value: attr.value,
          }))
        );
      }

      return productResult;
    });

    // Revalidate relevant paths
    revalidatePath("/products");
    revalidatePath("/admin-dashboard/products");
    revalidatePath(`/product/${slug}`);

    return NextResponse.json(
      {
        success: true,
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// GET endpoint to fetch products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const stockStatus = searchParams.get('stockStatus');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;
    
    // Build where conditions
    const whereConditions = [];
    
    if (category) {
      whereConditions.push(`pc.category = '${category}'`);
    }
    
    if (status) {
      whereConditions.push(`p.status = '${status}'`);
    }
    
    if (stockStatus) {
      whereConditions.push(`p.stockStatus = '${stockStatus}'`);
    }
    
    if (search) {
      whereConditions.push(`(p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%' OR p.brand ILIKE '%${search}%')`);
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Get products with categories
    const products = await dbServer.execute(`
      SELECT 
        p.*,
        json_agg(DISTINCT pc.category) as categories,
        json_agg(DISTINCT pi.url) as images
      FROM product p
      LEFT JOIN product_category pc ON p.id = pc.productId
      LEFT JOIN product_image pi ON p.id = pi.productId
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    
    // Get total count for pagination
    const totalResult = await dbServer.execute(`
      SELECT COUNT(DISTINCT p.id) as count
      FROM product p
      LEFT JOIN product_category pc ON p.id = pc.productId
      ${whereClause}
    `);
    
    // Fix the type issue by properly accessing the count value
    const totalCount = totalResult.rows[0] ? Number(totalResult.rows[0].count) : 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      products: products.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}