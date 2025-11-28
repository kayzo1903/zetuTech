import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import {
  order,
  orderItem,
  orderAddress,
  orderStatusHistory,
  product,
  productImage,
} from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { getServerSession } from "@/lib/server-session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession();
    const { orderId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get order with user validation
    const [orderData] = await dbServer
      .select()
      .from(order)
      .where(and(eq(order.id, orderId), eq(order.userId, session.user.id)))
      .limit(1);

    if (!orderData) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Get order items with product details
    const orderItems = await dbServer
      .select({
        id: orderItem.id,
        productId: orderItem.productId,
        productName: product.name,
        quantity: orderItem.quantity,
        price: orderItem.price,
        attributes: orderItem.attributes,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
        },
      })
      .from(orderItem)
      .innerJoin(product, eq(orderItem.productId, product.id))
      .where(eq(orderItem.orderId, orderId));

    // Get first image for each product (ordered by `order` column if available)
    const itemsWithImages = await Promise.all(
      orderItems.map(async (item) => {
        const [image] = await dbServer
          .select({
            url: productImage.url,
            alt: productImage.alt,
          })
          .from(productImage)
          .where(eq(productImage.productId, item.productId))
          .orderBy(asc(productImage.order))
          .limit(1);

        return {
          ...item,
          product: {
            ...item.product,
            image: image || null,
          },
        };
      })
    );

    // Get order address
    const [orderAddressData] = await dbServer
      .select()
      .from(orderAddress)
      .where(
        and(
          eq(orderAddress.orderId, orderId),
          eq(orderAddress.type, "shipping")
        )
      )
      .limit(1);

    // Get status history
    const statusHistory = await dbServer
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, orderId))
      .orderBy(desc(orderStatusHistory.createdAt));

    const completeOrder = {
      ...orderData,
      items: itemsWithImages,
      address: orderAddressData,
      statusHistory,
    };

    return NextResponse.json({
      success: true,
      order: completeOrder,
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
