// app/api/admin/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import {
  order,
  orderItem,
  orderAddress,
  orderStatusHistory,
  product,
  productImage,
  user,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

import { getServerSession } from "@/lib/server-session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const { session, isAdmin } = await getServerSession();

    if (!session || !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get order with user information
    const [orderData] = await dbServer
      .select({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        subtotal: order.subtotal,
        shippingAmount: order.shippingAmount,
        taxAmount: order.taxAmount,
        discountAmount: order.discountAmount,
        deliveryMethod: order.deliveryMethod,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        agentLocation: order.agentLocation,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        userId: order.userId,
        guestSessionId: order.guestSessionId,
        userName: user.name,
        userEmail: user.email,
      })
      .from(order)
      .leftJoin(user, eq(order.userId, user.id))
      .where(eq(order.id, orderId))
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
          name: product.name,
          slug: product.slug,
          brand: product.brand,
        },
      })
      .from(orderItem)
      .innerJoin(product, eq(orderItem.productId, product.id))
      .where(eq(orderItem.orderId, orderId));

    // Get product images for items
    const itemsWithImages = await Promise.all(
      orderItems.map(async (item) => {
        const images = await dbServer
          .select({
            url: productImage.url,
            alt: productImage.alt,
          })
          .from(productImage)
          .where(eq(productImage.productId, item.productId))
          .orderBy(productImage.order)
          .limit(1);

        return {
          ...item,
          product: {
            ...item.product,
            image: images[0] || null,
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
    console.error("Admin order detail fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const { session, isAdmin } = await getServerSession();

    // Check admin authorization
    if (!session || !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First, check if order exists
    const [existingOrder] = await dbServer
      .select({ id: order.id })
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Use transaction to delete all related records
    await dbServer.transaction(async (tx) => {
      // Delete order status history
      await tx
        .delete(orderStatusHistory)
        .where(eq(orderStatusHistory.orderId, orderId));

      // Delete order addresses
      await tx
        .delete(orderAddress)
        .where(eq(orderAddress.orderId, orderId));

      // Delete order items
      await tx
        .delete(orderItem)
        .where(eq(orderItem.orderId, orderId));

      // Finally delete the order
      await tx
        .delete(order)
        .where(eq(order.id, orderId));
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Admin order delete error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete order",
      },
      { status: 500 }
    );
  }
}