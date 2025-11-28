// app/api/products/get-product/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { dbServer } from "@/db/db-server";
import {
  product,
  productCategory,
  productImage,
  productAttribute,
} from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function GET(
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

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // First, get the basic product data
    const productResult = await dbServer
      .select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (productResult.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Then get related data separately to avoid json_agg issues
    const [categories, images, attributes] = await Promise.all([
      // Get categories
      dbServer
        .select({ category: productCategory.category })
        .from(productCategory)
        .where(eq(productCategory.productId, productId)),

      // Get images
      dbServer
        .select({ url: productImage.url })
        .from(productImage)
        .where(eq(productImage.productId, productId))
        .orderBy(productImage.order),

      // Get attributes
      dbServer
        .select({
          name: productAttribute.name,
          value: productAttribute.value,
        })
        .from(productAttribute)
        .where(eq(productAttribute.productId, productId)),
    ]);

    // Format the response
    const formattedProduct = {
      ...productResult[0],
      categories: categories.map((c) => c.category) || [],
      images: images.map((i) => i.url) || [],
      attributes: attributes || [],
    };

    return NextResponse.json({
      product: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
