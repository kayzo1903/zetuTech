import { productSchema } from "@/lib/validation-schemas/products-schema";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "@/lib/slugify";
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { product, productCategory, productImage } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { uploadImageToStorage } from "@/lib/storage";

type Params = Promise<{ id: string }>;

/**
 * PUT /api/products/update-product/[id]
 * Updates a product including details, categories, and images.
 */
export async function PUT(
  request: NextRequest,
  props: { params: Params }
) {
  try {
    const params = await props.params;
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // --- AUTHENTICATION ---
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update products
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can update products" },
        { status: 403 }
      );
    }

    // --- CHECK EXISTING PRODUCT ---
    const existingProduct = await dbServer
      .select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // --- PARSE FORM DATA ---
    const formData = await request.formData();

    const productType = formData.get("productType") as string;
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const stock = parseInt(formData.get("stock") as string);
    const stockStatus = formData.get("stockStatus") as string;
    const categories = JSON.parse(formData.get("categories") as string) as string[];
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;
    const shortDescription = (formData.get("shortDescription") as string) || "";
    const hasDiscount = formData.get("hasDiscount") === "true";
    const originalPrice = parseFloat(formData.get("originalPrice") as string);
    const salePrice = hasDiscount
      ? parseFloat(formData.get("salePrice") as string)
      : undefined;
    const hasWarranty = formData.get("hasWarranty") === "true";
    const warrantyPeriod = hasWarranty ? (formData.get("warrantyPeriod") as string) : undefined;
    const warrantyDetails = hasWarranty ? (formData.get("warrantyDetails") as string) : undefined;

    // --- SEO FIELDS ---
    const slug = (formData.get("slug") as string) || slugify(name);
    const metaTitle = (formData.get("metaTitle") as string) || name;
    const metaDescription =
      (formData.get("metaDescription") as string) ||
      shortDescription ||
      description.substring(0, 160);
    const keywords = (formData.get("keywords") as string) || "";

    // --- IMAGES ---
    const imageFiles = formData.getAll("images") as File[];

    // --- VALIDATE INPUT DATA ---
    const validatedData = productSchema.parse({
      productType,
      name,
      brand,
      stock,
      stockStatus,
      categories,
      status,
      description,
      images: imageFiles, // allow empty array
      hasDiscount,
      originalPrice,
      salePrice,
      hasWarranty,
      warrantyPeriod,
      warrantyDetails,
    });

    // --- UPLOAD IMAGES TO CLOUDFLARE R2 ---
    let newImages: { url: string; key: string }[] = [];

    if (imageFiles.length > 0) {
      newImages = await Promise.all(
        imageFiles.map(async (file) => {
          const uniqueKey = `products/${uuidv4()}-${file.name}`;
          const url = await uploadImageToStorage(file, uniqueKey);
          return { url, key: uniqueKey };
        })
      );
    }

    // --- UPDATE PRODUCT IN DATABASE ---
    const updatedProduct = await dbServer.transaction(async (tx) => {
      // Update the main product
      const [productResult] = await tx
        .update(product)
        .set({
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
          slug,
          metaTitle,
          metaDescription,
          keywords,
          updatedAt: new Date(),
        })
        .where(eq(product.id, productId))
        .returning();

      // Update categories
      await tx.delete(productCategory).where(eq(productCategory.productId, productId));
      if (validatedData.categories.length > 0) {
        await tx.insert(productCategory).values(
          validatedData.categories.map((category) => ({
            id: uuidv4(),
            productId: productResult.id,
            category,
            slug: slugify(category),
          }))
        );
      }

      // Update images if new ones were uploaded
      if (newImages.length > 0) {
        await tx.delete(productImage).where(eq(productImage.productId, productId));
        await tx.insert(productImage).values(
          newImages.map((image, index) => ({
            id: uuidv4(),
            productId: productResult.id,
            url: image.url,
            storageKey: image.key, // store R2 key for future deletion
            alt: `${validatedData.name} - Image ${index + 1}`,
            title: `${validatedData.name} - Image ${index + 1}`,
            order: index,
          }))
        );
      }

      return productResult;
    });

    // --- REVALIDATE PAGES ---
    revalidatePath("/products");
    revalidatePath("/admin-dashboard/products");
    revalidatePath(`/product/${slug}`);
    revalidatePath(`/product/${existingProduct[0].slug}`);

    return NextResponse.json(
      {
        success: true,
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);

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
