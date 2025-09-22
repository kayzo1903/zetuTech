// // app/api/products/update-product/[id]/route.ts
import { productSchema } from "@/lib/validation-schemas/products-schema";
import { revalidatePath } from "next/cache";
import { uploadImageToStorage } from "@/lib/storage";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "@/lib/slugify";
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { product, productCategory, productImage } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function PUT(
  request: NextRequest,
  props: {
    params: Params;
  }
) {
  try {
    const params = await props.params;
    const productId = params.id;
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can update products" },
        { status: 403 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();

    // Check if product exists
    const existingProduct = await dbServer
      .select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Extract form data
    const productType = formData.get("productType") as string;
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const stock = parseInt(formData.get("stock") as string);
    const stockStatus = formData.get("stockStatus") as string;
    const categories = JSON.parse(
      formData.get("categories") as string
    ) as string[];
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;
    const shortDescription = (formData.get("shortDescription") as string) || "";
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
    const slug = (formData.get("slug") as string) || slugify(name);
    const metaTitle = (formData.get("metaTitle") as string) || name;
    const metaDescription =
      (formData.get("metaDescription") as string) ||
      shortDescription ||
      description.substring(0, 160);
    const keywords = (formData.get("keywords") as string) || "";

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
      images: imageFiles.length > 0 ? imageFiles : [{}], // Allow no new images for updates
      hasDiscount,
      originalPrice,
      salePrice,
      hasWarranty,
      warrantyPeriod,
      warrantyDetails,
    });

    // Upload new images to storage
    const newImageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const url = await uploadImageToStorage(
          file,
          `products/${Date.now()}-${file.name}`
        );
        return url;
      })
    );

    // Start a transaction to update product and related records
    const updatedProduct = await dbServer.transaction(async (tx) => {
      // Update the product
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
          slug: slug,
          metaTitle: metaTitle,
          metaDescription: metaDescription,
          keywords: keywords,
          updatedAt: new Date(),
        })
        .where(eq(product.id, productId))
        .returning();

      // Update categories - delete existing and add new
      await tx
        .delete(productCategory)
        .where(eq(productCategory.productId, productId));

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

      // Only update images if new images are provided
      if (newImageUrls.length > 0) {
        // Delete existing images
        await tx
          .delete(productImage)
          .where(eq(productImage.productId, productId));

        // Add new images
        await tx.insert(productImage).values(
          newImageUrls.map((url, index) => ({
            id: uuidv4(),
            productId: productResult.id,
            url,
            alt: `${validatedData.name} - Image ${index + 1}`,
            title: `${validatedData.name} - Image ${index + 1}`,
            order: index,
          }))
        );
      }

      return productResult;
    });

    // Revalidate relevant paths
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
