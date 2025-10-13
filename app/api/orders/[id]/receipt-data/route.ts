// app/api/orders/[id]/receipt-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { order, orderItem, orderAddress, product } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { validateOrderAccess } from "@/lib/orders/security";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
     const { id } = await params;
     const orderId = id
    

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Validate order access - allow access for receipt generation
    const accessValidation = await validateOrderAccess(orderId, null);
    
    if (!accessValidation.allowed) {
      return NextResponse.json(
        { success: false, error: "Order not found or access denied" },
        { status: 404 }
      );
    }

    // ========== FETCH DATA USING EXPLICIT QUERIES ==========

    // 1. Get main order data
    const [orderData] = await dbServer
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderData) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }


    // 2. Get order items with product details
    const orderItems = await dbServer
      .select({
        id: orderItem.id,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItem.price,
        attributes: orderItem.attributes,
        product: {
          name: product.name,
          brand: product.brand,
          sku: product.sku,
        },
      })
      .from(orderItem)
      .innerJoin(product, eq(orderItem.productId, product.id))
      .where(eq(orderItem.orderId, orderId));


    // 3. Get shipping address
    const [shippingAddress] = await dbServer
      .select()
      .from(orderAddress)
      .where(
        and(
          eq(orderAddress.orderId, orderId),
          eq(orderAddress.type, "shipping")
        )
      )
      .limit(1);


    // Safe parsing of attributes
    const parseAttributes = (attributes: string | null) => {
      if (!attributes) return null;
      try {
        return JSON.parse(attributes);
      } catch {
        return null;
      }
    };

    // Format response data
    const responseData = {
      order: {
        id: orderData.id,
        orderNumber: orderData.orderNumber,
        orderDate: orderData.createdAt,
        status: orderData.status,
        subtotal: parseFloat(orderData.subtotal),
        shippingAmount: parseFloat(orderData.shippingAmount),
        taxAmount: parseFloat(orderData.taxAmount),
        discountAmount: parseFloat(orderData.discountAmount || "0"),
        totalAmount: parseFloat(orderData.totalAmount),
        paymentMethod: orderData.paymentMethod,
        deliveryMethod: orderData.deliveryMethod,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        agentLocation: orderData.agentLocation,
        agentInstructions: orderData.agentInstructions,
        pdfFile: orderData.pdfFile,
        verificationCode: orderData.verificationCode,
      },
      items: orderItems.map(item => ({
        name: item.product?.name || "Product",
        brand: item.product?.brand || null,
        sku: item.product?.sku || null,
        quantity: item.quantity,
        price: parseFloat(item.price),
        total: parseFloat(item.price) * item.quantity,
        attributes: parseAttributes(item.attributes),
      })),
      shippingAddress: shippingAddress ? {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        email: shippingAddress.email || null,
        address: shippingAddress.address || null,
        city: shippingAddress.city,
        region: shippingAddress.region,
        country: shippingAddress.country,
        notes: shippingAddress.notes || null,
      } : null
    };


    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch order data" },
      { status: 500 }
    );
  }
}