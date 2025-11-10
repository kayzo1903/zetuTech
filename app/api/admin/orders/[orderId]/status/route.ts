// app/api/admin/orders/[orderId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { order, orderStatusHistory, orderAddress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getServerSession } from "@/lib/server-session";

// Validation schema for status update
const statusUpdateSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  notes: z.string().max(500).optional().default(""),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { session, isAdmin } = await getServerSession();

    // Check if user is authenticated and admin
    if (!session || !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access. Admin privileges required.",
        },
        { status: 401 }
      );
    }
    const { orderId } = await params;

    // Validate order ID format
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    const validationResult = statusUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status data",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { status, notes } = validationResult.data;

    // Start database transaction
    return await dbServer.transaction(async (tx) => {
      try {
        // 1. Check if order exists and get current status with customer info
        const [existingOrder] = await tx
          .select({
            id: order.id,
            currentStatus: order.status,
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
          })
          .from(order)
          .where(eq(order.id, orderId))
          .limit(1);

        if (!existingOrder) {
          return NextResponse.json(
            {
              success: false,
              error: "Order not found",
            },
            { status: 404 }
          );
        }

        // 2. Check if status is actually changing
        if (existingOrder.currentStatus === status) {
          return NextResponse.json(
            {
              success: false,
              error: `Order status is already "${status}"`,
            },
            { status: 400 }
          );
        }

        // 3. Validate status transitions (optional business logic)
        const validTransitions: Record<string, string[]> = {
          pending: ["confirmed", "cancelled"],
          confirmed: ["processing", "cancelled"],
          processing: ["shipped", "cancelled"],
          shipped: ["delivered", "cancelled"],
          delivered: ["refunded"],
          cancelled: [],
          refunded: [],
        };

        const allowedNextStatuses =
          validTransitions[existingOrder.currentStatus] || [];
        if (
          allowedNextStatuses.length > 0 &&
          !allowedNextStatuses.includes(status)
        ) {
          return NextResponse.json(
            {
              success: false,
              error: `Cannot change status from "${
                existingOrder.currentStatus
              }" to "${status}". Allowed transitions: ${allowedNextStatuses.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }

        // 4. Update order status
        const [updatedOrder] = await tx
          .update(order)
          .set({
            status,
            updatedAt: new Date(),
            // Update payment status if order is delivered or cancelled
            ...(status === "delivered" && { paymentStatus: "paid" }),
            ...(status === "cancelled" && { paymentStatus: "refunded" }),
          })
          .where(eq(order.id, orderId))
          .returning({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            updatedAt: order.updatedAt,
          });

        // 5. Create status history record
        const statusNotes = notes.trim()
          ? notes
          : `Order status updated from "${existingOrder.currentStatus}" to "${status}" by admin`;

        await tx.insert(orderStatusHistory).values({
          orderId,
          status,
          notes: statusNotes,
          createdAt: new Date(),
        });

        // 6. Send email notification to customer if email exists
        if (existingOrder.customerEmail) {
          try {
            // Get customer name from order address
            const [shippingAddress] = await tx
              .select({
                fullName: orderAddress.fullName,
              })
              .from(orderAddress)
              .where(eq(orderAddress.orderId, orderId))
              .limit(1);

            const customerName = shippingAddress?.fullName || "Customer";

            // Send email notification
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/send`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "order-update",
                to: existingOrder.customerEmail,
                data: {
                  name: customerName,
                  orderId: existingOrder.orderNumber,
                  status: status,
                },
              }),
            });
          } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Don't fail the entire request if email fails
          }
        }

        // 7. Return success response
        return NextResponse.json({
          success: true,
          message: `Order status updated successfully to "${status}"`,
          emailSent: !!existingOrder.customerEmail,
          order: {
            id: updatedOrder.id,
            orderNumber: updatedOrder.orderNumber,
            status: updatedOrder.status,
            previousStatus: existingOrder.currentStatus,
            updatedAt: updatedOrder.updatedAt,
          },
        });
      } catch (txError) {
        console.error("Transaction error in status update:", txError);
        throw new Error("Failed to update order status in database");
      }
    });
  } catch (error) {
    console.error("Order status update error:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("violates foreign key constraint")) {
        return NextResponse.json(
          {
            success: false,
            error: "Order not found or invalid order ID",
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order status",
        ...(process.env.NODE_ENV === "development" && {
          debug: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 }
    );
  }
}