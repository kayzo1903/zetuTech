// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/validation-schemas/products-schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadImageToStorage } from "@/lib/storage";

import { product, productCategory, productImage } from "@/db/schema";
import { ZodError } from "zod";
import { dbServer } from "@/db/db-server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role (only Admin should be able to create products)
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only sellers can create products" },
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
    const categories = JSON.parse(
      formData.get("categories") as string
    ) as string[];
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;
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

    // Get image files
    const imageFiles = formData.getAll("images") as File[];

    // Validate the data
    const validatedData = productSchema.parse({
      productType,
      name,
      brand,
      stock,
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

    // Start a transaction to create product and related records
    const newProduct = await dbServer.transaction(async (tx) => {
      // Create the product
      const [productResult] = await tx
        .insert(product)
        .values({
          name: validatedData.name,
          description: validatedData.description,
          brand: validatedData.brand,
          productType: validatedData.productType,
          status: validatedData.status,
          originalPrice: validatedData.originalPrice.toString(),
          salePrice: validatedData.salePrice?.toString(),
          hasDiscount: validatedData.hasDiscount,
          stock: validatedData.stock,
          hasWarranty: validatedData.hasWarranty,
          warrantyPeriod: validatedData.warrantyPeriod
            ? parseInt(validatedData.warrantyPeriod)
            : null,
          warrantyDetails: validatedData.warrantyDetails,
          userId: session.user.id,
        })
        .returning();

      // Add categories
      if (validatedData.categories.length > 0) {
        await tx.insert(productCategory).values(
          validatedData.categories.map((category) => ({
            productId: productResult.id,
            category,
          }))
        );
      }

      // Add images
      if (imageUrls.length > 0) {
        await tx.insert(productImage).values(
          imageUrls.map((url, index) => ({
            productId: productResult.id,
            url,
            alt: `${validatedData.name} - Image ${index + 1}`,
            order: index,
          }))
        );
      }

      return productResult;
    });

    // Revalidate relevant paths
    revalidatePath("/products");
    revalidatePath("/dashboard/products");

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
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
