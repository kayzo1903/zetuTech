// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import {
  order,
  orderItem,
  orderAddress,
  orderStatusHistory,
  cart,
  cartItem,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionIdFromRequest } from "@/lib/server/cart/session-util";
import { orderCreateSchema } from "@/lib/validation-schemas/checkout";




export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionIdFromRequest(request);
    const body = await request.json();

    // Validate the request data
    const validationResult = orderCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order data",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const orderData = validationResult.data;
    const orderNumber = generateOrderNumber();

    return await dbServer.transaction(async (tx) => {
      try {
        // Create the order - support both user and guest
        const [newOrder] = await tx
          .insert(order)
          .values({
            orderNumber,
            userId: body.userId || null,
            guestSessionId: !body.userId
              ? body.guestSessionId || sessionId
              : null,
            status: "pending",
            subtotal: orderData.pricing.subtotal.toString(),
            shippingAmount: orderData.pricing.shipping.toString(),
            taxAmount: orderData.pricing.tax.toString(),
            discountAmount: orderData.pricing.discount.toString(),
            totalAmount: orderData.pricing.total.toString(),
            deliveryMethod: orderData.delivery.method,
            paymentMethod: orderData.payment.method,
            paymentStatus:
              orderData.payment.method === "cash_delivery"
                ? "pending"
                : "unpaid",
            agentLocation: orderData.delivery.agentLocation || null,
            customerPhone: orderData.contact.phone,
            customerEmail: orderData.contact.email || null,
          })
          .returning();

        // Create order address
        await tx.insert(orderAddress).values({
          orderId: newOrder.id,
          type: "shipping",
          fullName: orderData.address.fullName,
          phone: orderData.contact.phone,
          email: orderData.contact.email || "",
          address: orderData.address.address || "",
          city: orderData.address.city || orderData.contact.region,
          region: orderData.contact.region,
          country: "Tanzania",
          notes: orderData.address.notes || "",
        });

        // Create order items
        const orderItems = orderData.cartItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice.toString(),
          attributes: item.attributes ? JSON.stringify(item.attributes) : null,
        }));

        console.log("📦 Creating order items:", orderItems.length);
        await tx.insert(orderItem).values(orderItems);

        // Create initial status history
        await tx.insert(orderStatusHistory).values({
          orderId: newOrder.id,
          status: "pending",
          notes: "Order created successfully",
        });

        // Clear the cart (works for both user and guest)
        if (body.userId) {
          // Clear user cart
          const [userCart] = await tx
            .select()
            .from(cart)
            .where(eq(cart.userId, body.userId));
          if (userCart) {
            await tx.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
          }
        } else {
          // Clear guest cart using session ID
          const [guestCart] = await tx
            .select()
            .from(cart)
            .where(eq(cart.sessionId, sessionId));
          if (guestCart) {
            await tx.delete(cartItem).where(eq(cartItem.cartId, guestCart.id));
            console.log("✅ Guest cart cleared");
          }
        }

        console.log("🎉 Order creation completed successfully");

        // ========== SEND ORDER CONFIRMATION EMAIL ==========
        if (orderData.contact.email) {
          try {
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL || "https://zetutech.vercel.app";

            // Prepare email data
            const emailData = {
              name: orderData.address.fullName,
              orderNumber: newOrder.orderNumber,
              orderId: newOrder.id,
              items: orderData.cartItems.map((item) => ({
                name: item.productName || `Product ${item.productId}`, // Fallback
                quantity: item.quantity,
                price: parseFloat(item.unitPrice.toString()),
              })),
              total: parseFloat(orderData.pricing.total.toString()),
              orderDate: newOrder.createdAt,
            };

            console.log(
              "📧 Sending order confirmation email to:",
              orderData.contact.email
            );

            // Send email (non-blocking)
            const emailResponse = await fetch(`${baseUrl}/api/email/send`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "invoice",
                to: orderData.contact.email,
                data: emailData,
              }),
            });

            if (emailResponse.ok) {
              console.log("✅ Order confirmation email sent successfully");
            } else {
              const emailError = await emailResponse.text();
              console.warn("❌ Email sending failed:", emailError);
              // Don't throw - order was created successfully
            }
          } catch (emailError) {
            console.warn(
              "❌ Email sending error (order still created):",
              emailError
            );
            // Don't fail the transaction if email fails
          }
        } else {
          console.log("ℹ️ No email provided, skipping email confirmation");
        }

        // Return success response
        return NextResponse.json({
          success: true,
          order: {
            id: newOrder.id,
            orderNumber: newOrder.orderNumber,
            total: newOrder.totalAmount,
            status: newOrder.status,
            isGuest: !body.userId,
          },
        });
      } catch (txError) {
        console.error("❌ Transaction error:", txError);
        throw txError;
      }
    });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const day = new Date().getDate().toString().padStart(2, "0");
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0");

  return `ZT-${month}${day}-${timestamp.slice(-4)}-${random}`;
}
