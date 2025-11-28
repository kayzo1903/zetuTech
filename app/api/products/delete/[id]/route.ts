// app/api/products/delete/[id]/route.ts
import { dbServer } from "@/db/db-server";
import {
  product,
  productAttribute,
  productCategory,
  productImage,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

type Params = Promise<{ id : string }>

export async function DELETE(
  request: NextRequest,
  props: {
  params: Params }
) {
  const params = await props.params
  const productId = params.id;

  try {
    // 1. Check authentication
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can delete products" },
        { status: 403 }
      );
    }

    // 3. Ensure product ID is valid
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 4. Check if product exists
    const existingProduct = await dbServer
      .select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 5. Delete product and related data in transaction
    await dbServer.transaction(async (tx) => {
      await tx
        .delete(productAttribute)
        .where(eq(productAttribute.productId, productId));
      await tx
        .delete(productImage)
        .where(eq(productImage.productId, productId));
      await tx
        .delete(productCategory)
        .where(eq(productCategory.productId, productId));
      await tx.delete(product).where(eq(product.id, productId));
    });

    // 6. Revalidate cache
    revalidatePath("/products");
    revalidatePath("/dashboard/allproducts");

    if (existingProduct[0].slug) {
      revalidatePath(`/product/${existingProduct[0].slug}`);
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
