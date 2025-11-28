// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { order, orderItem, user } from "@/db/schema";
import { eq, desc, and, like, sql, or } from "drizzle-orm";
import { z } from "zod";
import { getServerSession } from "@/lib/server-session";

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional().default(""),
  status: z.string().optional().default("all"),
});

export async function GET(request: NextRequest) {
  try {
    const { session, isAdmin } = await getServerSession();

    if (!session || !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const { page, limit, search, status } = querySchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];

    if (search && search.trim() !== "") {
      whereConditions.push(
        or(
          like(order.orderNumber, `%${search}%`),
          like(order.customerPhone, `%${search}%`),
          like(order.customerEmail, `%${search}%`),
          like(user.name, `%${search}%`)
        )
      );
    }

    // FIX: Only add status condition if it's not "all" and not null/undefined
    if (status && status !== "all") {
      whereConditions.push(eq(order.status, status));
    }

    const finalWhere = whereConditions.length > 0 
      ? and(...whereConditions) 
      : undefined;

    const orders = await dbServer
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
        userName: user.name,
        userEmail: user.email,
        itemsCount: sql<number>`(
          SELECT COUNT(*) FROM ${orderItem} WHERE ${orderItem.orderId} = ${order.id}
        )`.as("items_count"),
      })
      .from(order)
      .leftJoin(user, eq(order.userId, user.id))
      .where(finalWhere)
      .orderBy(desc(order.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count with the same conditions
    const countQuery = dbServer
      .select({ count: sql<number>`COUNT(*)` })
      .from(order)
      .leftJoin(user, eq(order.userId, user.id))
      .where(finalWhere);

    const [countResult] = await countQuery;
    const total = countResult?.count || 0;

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}